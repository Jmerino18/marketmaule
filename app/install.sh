#!/bin/bash
# ============================================
# Market Maule - Script de Instalación VPS
# ============================================
# Uso: curl -fsSL https://tuurl.com/install.sh | bash
# o: wget -qO- https://tuurl.com/install.sh | bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_NAME="marketmaule"
INSTALL_DIR="/opt/marketmaule"
DOMAIN=""

print_banner() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     MARKET MAULE - INSTALADOR VPS      ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

# Verificar root
if [ "$EUID" -ne 0 ]; then
    print_error "Por favor ejecuta como root: sudo bash install.sh"
    exit 1
fi

print_banner

# Paso 1: Pedir dominio
read -p "Ingresa tu dominio o subdominio (ej: marketmaule.tudominio.cl): " DOMAIN
if [ -z "$DOMAIN" ]; then
    print_error "Debes ingresar un dominio"
    exit 1
fi

print_info "Dominio configurado: $DOMAIN"

# Paso 2: Instalar Docker si no existe
print_info "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    print_info "Instalando Docker..."
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker
    systemctl start docker
    print_success "Docker instalado"
else
    print_success "Docker ya está instalado"
fi

# Instalar Docker Compose si no existe
if ! command -v docker-compose &> /dev/null; then
    print_info "Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose instalado"
else
    print_success "Docker Compose ya está instalado"
fi

# Paso 3: Crear directorio
print_info "Creando directorio de instalación..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Paso 4: Descargar el código
print_info "Descargando Market Maule..."
# Si el ZIP está en un servidor, descargarlo:
# wget -q "https://tu-servidor.com/marketmaule-vps.zip" -O marketmaule.zip
# unzip -q marketmaule.zip
# rm marketmaule.zip

# Por ahora, asumimos que los archivos ya están en /opt/marketmaule/
print_success "Archivos preparados en $INSTALL_DIR"

# Paso 5: Configurar variables de entorno
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

print_success "Variables de entorno configuradas"

# Paso 6: Actualizar nginx.conf con el dominio
print_info "Configurando Nginx..."
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx.conf
print_success "Nginx configurado para $DOMAIN"

# Paso 7: Construir y levantar
print_info "Construyendo contenedores (esto puede tomar 2-3 minutos)..."
docker-compose down 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

print_success "Contenedores construidos y ejecutándose"

# Paso 8: Esperar a que MySQL esté listo
print_info "Esperando a que MySQL esté listo..."
sleep 15

# Paso 9: Ejecutar migraciones de Drizzle
print_info "Ejecutando migraciones de base de datos..."
docker-compose exec -T app npx drizzle-kit push:mysql 2>/dev/null || print_info "Migraciones ya aplicadas o usando init.sql"

# Paso 10: Verificar estado
print_info "Verificando estado de los servicios..."
docker-compose ps

# Paso 11: Configurar SSL con Certbot (opcional)
read -p "¿Quieres instalar SSL con Let's Encrypt? (s/n): " INSTALL_SSL
if [ "$INSTALL_SSL" = "s" ] || [ "$INSTALL_SSL" = "S" ]; then
    print_info "Instalando Certbot..."
    apt-get update -qq
    apt-get install -y -qq certbot
    
    # Detener nginx temporalmente
    docker-compose stop nginx
    
    # Obtener certificado
    certbot certonly --standalone -d $DOMAIN --agree-tos --non-interactive --email admin@$DOMAIN
    
    # Copiar certificados
    mkdir -p ssl
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
    
    # Actualizar nginx.conf para HTTPS
    sed -i 's/# listen 443/listen 443/g' nginx.conf
    sed -i 's/# ssl_certificate/ssl_certificate/g' nginx.conf
    sed -i 's/# ssl_certificate_key/ssl_certificate_key/g' nginx.conf
    sed -i 's/# server {/server {/g' nginx.conf
    sed -i 's/#     listen 443/    listen 443/g' nginx.conf
    sed -i 's/#     server_name/    server_name/g' nginx.conf
    sed -i 's/#     ssl_certificate/    ssl_certificate/g' nginx.conf
    sed -i 's/#     ssl_certificate_key/    ssl_certificate_key/g' nginx.conf
    sed -i 's/#     location/    location/g' nginx.conf
    sed -i 's/#         proxy_pass/        proxy_pass/g' nginx.conf
    sed -i 's/#     }/    }/g' nginx.conf
    sed -i 's/# }/}/g' nginx.conf
    
    docker-compose up -d nginx
    print_success "SSL instalado para $DOMAIN"
fi

# Final
print_banner
print_success "¡MARKET MAULE instalado correctamente!"
echo ""
echo -e "${GREEN}URL:${NC} http://$DOMAIN"
echo -e "${GREEN}Directorio:${NC} $INSTALL_DIR"
echo -e "${GREEN}Logs:${NC} docker-compose logs -f"
echo ""
echo -e "${YELLOW}Comandos útiles:${NC}"
echo "  cd $INSTALL_DIR"
echo "  docker-compose ps          # Ver estado"
echo "  docker-compose logs -f     # Ver logs"
echo "  docker-compose restart     # Reiniciar"
echo "  docker-compose down        # Detener"
echo "  docker-compose up -d       # Iniciar"
echo ""
echo -e "${YELLOW}Admin:${NC}"
echo "  Email: admin@marketmaule.cl"
echo "  Pass:  Cambiar en base de datos"
echo ""
