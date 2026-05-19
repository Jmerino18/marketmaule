#!/bin/bash
# ============================================
# Market Maule - Instalador para AlmaLinux 9
# ============================================
# Compatible: AlmaLinux 9, Rocky Linux 9, CentOS Stream 9, RHEL 9
# Uso: bash install.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="marketmaule"
INSTALL_DIR="/opt/marketmaule"
DOMAIN=""

print_banner() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  MARKET MAULE - INSTALADOR AlmaLinux 9 ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${YELLOW}→${NC} $1"; }

# Verificar root
if [ "$EUID" -ne 0 ]; then
    print_error "Ejecuta como root: sudo bash install.sh"
    exit 1
fi

# Detectar OS
if [ -f /etc/almalinux-release ]; then
    OS="almalinux"
elif [ -f /etc/rocky-release ]; then
    OS="rocky"
elif [ -f /etc/centos-stream ]; then
    OS="centos"
else
    OS="rhel"
fi

print_banner
print_info "Sistema detectado: $OS 9"

# Paso 1: Pedir dominio
read -p "Ingresa tu dominio o subdominio (ej: marketmaule.tudominio.cl): " DOMAIN
if [ -z "$DOMAIN" ]; then
    print_error "Debes ingresar un dominio"
    exit 1
fi
print_info "Dominio: $DOMAIN"

# Paso 2: Actualizar sistema e instalar dependencias
print_info "Actualizando sistema..."
dnf update -y -q
dnf install -y -q curl wget unzip openssl firewalld
systemctl enable firewalld --now

# Paso 3: Instalar Docker
print_info "Instalando Docker..."
if ! command -v docker &> /dev/null; then
    # AlmaLinux 9 - metodo oficial Docker
    dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    dnf install -y -q docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker --now
    print_success "Docker instalado"
else
    print_success "Docker ya instalado"
fi

# Verificar Docker Compose plugin
docker compose version &>/dev/null || {
    print_info "Instalando Docker Compose plugin..."
    dnf install -y -q docker-compose-plugin
}

# Paso 4: Firewall - abrir puertos
print_info "Configurando firewall..."
firewall-cmd --permanent --add-service=http 2>/dev/null || true
firewall-cmd --permanent --add-service=https 2>/dev/null || true
firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true
print_success "Firewall configurado"

# Paso 5: Crear directorio
print_info "Preparando directorio..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Verificar que los archivos existen
if [ ! -f "docker-compose.yml" ]; then
    print_error "No se encuentra docker-compose.yml en $INSTALL_DIR"
    print_info "Asegurate de subir y extraer marketmaule-vps.zip primero"
    exit 1
fi

# Paso 6: Configurar .env
print_info "Configurando variables de entorno..."
JWT_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)

cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://marketmaule:marketmaule_password@db:3306/marketmaule
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
OAUTH_REDIRECT_URL=https://$DOMAIN/api/auth/callback
EOF
chmod 600 .env
print_success "Variables configuradas"

# Paso 7: Actualizar nginx.conf
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx.conf 2>/dev/null || true

# Paso 8: Construir y levantar
print_info "Construyendo contenedores (2-5 minutos)..."
docker compose down 2>/dev/null || true
docker compose build --no-cache
print_success "Imagenes construidas"

print_info "Iniciando servicios..."
docker compose up -d
print_success "Servicios iniciados"

# Paso 9: Esperar MySQL
print_info "Esperando base de datos..."
for i in {1..30}; do
    if docker compose exec -T db mysqladmin ping -h localhost --silent 2>/dev/null; then
        print_success "MySQL listo"
        break
    fi
    sleep 2
    echo -n "."
done

# Paso 10: Ejecutar migraciones
print_info "Ejecutando migraciones..."
docker compose exec -T app npx drizzle-kit push:mysql 2>/dev/null || {
    print_info "Drizzle push fallo, verificando init.sql..."
}

# Paso 11: Seed de datos
print_info "Cargando datos de ejemplo..."
docker compose exec -T db mysql -u root -proot_password_marketmaule marketmaule < init-db.sql 2>/dev/null || {
    print_info "Datos ya cargados o tabla no existe aun"
}

# Paso 12: Instalar SSL
read -p "Instalar SSL con Let's Encrypt? (s/n): " INSTALL_SSL
if [ "$INSTALL_SSL" = "s" ] || [ "$INSTALL_SSL" = "S" ]; then
    print_info "Instalando Certbot..."
    dnf install -y -q certbot
    
    # Detener nginx Docker temporalmente
    docker compose stop nginx
    
    # Obtener certificado
    certbot certonly --standalone -d $DOMAIN --agree-tos --non-interactive --email admin@$DOMAIN || {
        print_error "Certbot fallo, continuando sin SSL..."
    }
    
    # Si obtuvo certificado, configurar HTTPS
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        mkdir -p ssl
        cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
        cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
        
        # Actualizar nginx para HTTPS
        sed -i 's/# listen 443/listen 443/g' nginx.conf
        sed -i 's/# ssl_certificate/ssl_certificate/g' nginx.conf
        sed -i 's/# ssl_certificate_key/ssl_certificate_key/g' nginx.conf
        
        docker compose up -d nginx
        print_success "SSL instalado para $DOMAIN"
    fi
else
    print_info "SSL omitido. Puedes instalarlo despues con: certbot"
fi

# Paso 13: Verificar
print_info "Verificando servicios..."
docker compose ps

# Final
print_banner
print_success "MARKET MAULE instalado en $DOMAIN!"
echo ""
echo -e "${GREEN}URL:${NC} http://$DOMAIN"
if [ -f "ssl/cert.pem" ]; then
    echo -e "${GREEN}HTTPS:${NC} https://$DOMAIN"
fi
echo -e "${GREEN}Directorio:${NC} $INSTALL_DIR"
echo ""
echo -e "${YELLOW}Comandos utiles:${NC}"
echo "  cd $INSTALL_DIR"
echo "  docker compose ps"
echo "  docker compose logs -f"
echo "  docker compose restart"
echo "  docker compose down && docker compose up -d"
echo ""

# Auto-renew SSL con cron
if command -v certbot &> /dev/null; then
    print_info "Configurando auto-renovacion SSL..."
    echo "0 3 * * * certbot renew --quiet && docker compose restart nginx" | crontab - 2>/dev/null || true
    print_success "Auto-renovacion SSL configurada (3am diario)"
fi
