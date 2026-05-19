#!/bin/bash
# ============================================
# Instalar Market Maule desde GitHub (VPS AlmaLinux 9)
# ============================================
# Uso (como root en el VPS):
#   bash install-from-github.sh TU-USUARIO-GITHUB

set -e

if [ "$EUID" -ne 0 ]; then
    echo "Ejecuta como root: sudo bash install-from-github.sh"
    exit 1
fi

GITHUB_USER="${1:-}"
if [ -z "$GITHUB_USER" ]; then
    read -p "Tu usuario de GitHub: " GITHUB_USER
fi

REPO="marketmaule"
DIR="/opt/marketmaule"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  INSTALANDO MARKET MAULE DESDE GITHUB   ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Repo: https://github.com/$GITHUB_USER/$REPO"
echo "Destino: $DIR"
echo ""

# 1. Instalar git y docker
echo "[1/7] Instalando dependencias..."
dnf update -y -q
dnf install -y -q git curl wget unzip firewalld

if ! command -v docker &> /dev/null; then
    dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    dnf install -y -q docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker --now
fi
systemctl enable firewalld --now

# 2. Firewall
echo "[2/7] Configurando firewall..."
firewall-cmd --permanent --add-service=http 2>/dev/null || true
firewall-cmd --permanent --add-service=https 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

# 3. Clonar repo
echo "[3/7] Clonando repositorio..."
rm -rf $DIR
mkdir -p $DIR
cd /opt
git clone "https://github.com/$GITHUB_USER/$REPO.git" marketmaule
cd marketmaule

# 4. Configurar .env
echo "[4/7] Configurando entorno..."
read -p "Tu dominio (ej: marketmaule.tudominio.cl): " DOMAIN

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

sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx.conf

# 5. Construir
echo "[5/7] Construyendo contenedores..."
docker compose build --no-cache
docker compose up -d

# 6. Esperar MySQL y cargar datos
echo "[6/7] Inicializando base de datos..."
for i in {1..30}; do
    docker compose exec -T db mysqladmin ping -h localhost --silent 2>/dev/null && break
    sleep 2; echo -n "."
done
docker compose exec -T db mysql -u root -proot_password_marketmaule marketmaule < init-db.sql 2>/dev/null || true

# 7. SSL opcional
echo "[7/7] SSL..."
read -p "Instalar SSL con Let's Encrypt? (s/n): " SSL
if [ "$SSL" = "s" ]; then
    dnf install -y -q certbot
    docker compose stop nginx
    certbot certonly --standalone -d "$DOMAIN" --agree-tos --non-interactive --email "admin@$DOMAIN" || true
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        mkdir -p ssl
        cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/cert.pem
        cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/key.pem
        docker compose up -d nginx
        echo "Auto-renew: 0 3 * * * certbot renew --quiet && cd $DIR && docker compose restart nginx" | crontab -
    fi
fi

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  MARKET MAULE INSTALADO!               ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "URL: https://$DOMAIN"
echo "Dir:  cd $DIR"
echo "Logs: docker compose logs -f"
echo ""
