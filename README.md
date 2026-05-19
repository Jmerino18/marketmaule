# Market Maule

La vitrina digital de emprendedores mas grande de la Region del Maule, Chile.

## Descripcion

Market Maule es una plataforma web que conecta emprendedores locales de la Region del Maule con consumidores. Funciona como un nexo: los compradores descubren productos artesanales, alimentos, vinos, artesania y mas, y contactan directamente al emprendedor via WhatsApp o Email.

**La plataforma no cobra ni procesa pagos.** Cada emprendedor recibe el pago directamente.

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | tRPC + Hono + Drizzle ORM |
| Base de datos | MySQL 8.0 |
| Servidor | Node.js 20 + Nginx |
| Contenedores | Docker + Docker Compose |

## Caracteristicas

- **40 paginas HTML** funcionales
- **10 perfiles de emprendedores** con productos
- **Mapa interactivo** con Leaflet y popups enriquecidos
- **Carrusel de banners** con autoplay
- **Buscador** con filtros por categoria y comuna
- **Carrito de interes** (lista de productos guardados)
- **Modal de compra** con cantidad y contacto WhatsApp/Email
- **Panel de administracion** con 8 tabs
- **Editores visuales**: Noticias, Banners, Quienes Somos, Unete, Emprendedores
- **Autenticacion** con roles (Admin / Emprendedor)
- **Modo oscuro** persistente
- **SEO completo**: meta tags, Open Graph, sitemap, schema.org
- **Responsive** (mobile + desktop)
- **Paginas legales**: Terminos y Privacidad
- **FAQ y Contacto**

## Requisitos

- Docker 20.10+ y Docker Compose 2.0+
- O Node.js 20+ si corres local

## Instalacion con Docker (Recomendado)

```bash
# 1. Clonar
git clone https://github.com/TU-USUARIO/marketmaule.git
cd marketmaule

# 2. Configurar variables
cp .env.example .env
# Editar .env con tu dominio

# 3. Ejecutar
bash install.sh
```

El script `install.sh` es compatible con AlmaLinux 9, Rocky Linux 9, CentOS Stream 9 y RHEL 9.

## Instalacion Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Editar con tus variables

# 3. Compilar
npm run build

# 4. Iniciar
npm start
```

## Estructura del Proyecto

```
.
├── docker-compose.yml       # Orquestacion Docker
├── Dockerfile.prod          # Multi-stage build
├── nginx.conf               # Reverse proxy
├── init-db.sql              # Datos iniciales
├── install.sh               # Instalador automatico
├── src/                     # Frontend React
│   ├── pages/               # Paginas (Home, Admin, etc.)
│   ├── components/          # Componentes UI
│   └── hooks/               # Custom hooks
├── api/                     # Backend tRPC + Hono
│   ├── router.ts            # Router principal
│   └── middleware.ts        # Auth middleware
├── db/                      # Drizzle ORM
│   └── schema.ts            # Esquema de tablas
└── public/                  # Assets estaticos
```

## Base de Datos

Al iniciar, MySQL se inicializa automaticamente con:
- 10 emprendedores de ejemplo
- 13 productos
- 6 noticias reales
- 3 banners para el carrusel

## Docker Compose

Levanta 3 contenedores:

| Servicio | Descripcion |
|----------|-------------|
| `app` | Node.js con React + API tRPC |
| `db` | MySQL 8.0 con datos de ejemplo |
| `nginx` | Reverse proxy + SSL |

```bash
docker compose up -d     # Iniciar
docker compose ps        # Estado
docker compose logs -f   # Logs
docker compose down      # Detener
```

## Variables de Entorno

| Variable | Descripcion |
|----------|-------------|
| `DATABASE_URL` | URL de conexion MySQL |
| `JWT_SECRET` | Secret para tokens JWT |
| `SESSION_SECRET` | Secret para sesiones |
| `OAUTH_REDIRECT_URL` | URL callback OAuth |

## Licencia

Proyecto impulsado por el Gobierno Regional del Maule.
