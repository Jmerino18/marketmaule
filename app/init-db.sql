-- Base de datos inicial para Market Maule
-- Se ejecuta automáticamente al crear el contenedor MySQL

USE marketmaule;

-- Tabla de usuarios (emprendedores y admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin','editor','emprendedor') DEFAULT 'emprendedor',
    avatar VARCHAR(500),
    phone VARCHAR(50),
    comuna VARCHAR(100),
    categoria VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    instagram VARCHAR(255),
    status ENUM('activo','pendiente','inactivo') DEFAULT 'pendiente',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(50),
    description TEXT,
    image VARCHAR(500),
    category VARCHAR(100),
    status ENUM('activo','inactivo') DEFAULT 'activo',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image VARCHAR(500),
    tag VARCHAR(100),
    status ENUM('published','draft') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de banners
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    image VARCHAR(500) NOT NULL,
    link VARCHAR(500),
    order_num INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de solicitudes (Unete)
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    rep_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    comuna VARCHAR(100),
    category VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    status ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo: 10 emprendedores
INSERT INTO users (email, name, role, phone, comuna, categoria, description, status, views) VALUES
('mermeladas@marketmaule.cl', 'Mermeladas Yerbas', 'emprendedor', '56912345678', 'Talca', 'Alimentos', 'Mermeladas artesanales naturales del Maule, sin conservantes ni colorantes.', 'activo', 1240),
('artesanos@marketmaule.cl', 'Artesanos de Chanco', 'emprendedor', '56923456789', 'Chanco', 'Artesanía', 'Artesanía tradicional con técnicas ancestrales de la costa maulina.', 'activo', 980),
('vina@marketmaule.cl', 'Viña Colinas del Maule', 'emprendedor', '56934567890', 'Cauquenes', 'Vinos', 'Vinos artesanales de la región del Maule, producción familiar.', 'activo', 1560),
('miel@marketmaule.cl', 'Miel del Maule', 'emprendedor', '56945678901', 'San Javier', 'Alimentos', 'Miel orgánica pura de los valles del Maule.', 'activo', 890),
('cosmetica@marketmaule.cl', 'Cosmética Licantén', 'emprendedor', '56956789012', 'Licantén', 'Belleza', 'Productos de belleza naturales hechos a mano.', 'activo', 760),
('madera@marketmaule.cl', 'Madera Viva', 'emprendedor', '56967890123', 'Longaví', 'Madera', 'Diseño en madera nativa, mesas, decoración y utensilios.', 'activo', 1100),
('dulces@marketmaule.cl', 'Dulces de Molina', 'emprendedor', '56978901234', 'Molina', 'Alimentos', 'Repostería tradicional maulina, kuchen, alfajores y más.', 'activo', 1340),
('cerveza@marketmaule.cl', 'Cerveza Pencahue', 'emprendedor', '56989012345', 'Pencahue', 'Vinos', 'Cerveza artesanal del Valle del Maule, estilos únicos.', 'activo', 1020),
('panaderia@marketmaule.cl', 'Panadería Constitución', 'emprendedor', '56990123456', 'Constitución', 'Alimentos', 'Pan artesanal de la costa maulina, horneado fresco.', 'activo', 780),
('tejidos@marketmaule.cl', 'Tejidos Villa Alegre', 'emprendedor', '56901234567', 'Villa Alegre', 'Artesanía', 'Tejidos en lana de oveja criolla, ponchos, bufandas, chullos.', 'activo', 920);

-- Insertar productos de ejemplo
INSERT INTO products (user_id, name, price, description, image, category) VALUES
(1, 'Mermelada de Frutilla', '$3.500', 'Mermelada artesanal de frutillas del Maule, sin conservantes.', 'images/product-mermeladas.jpg', 'Alimentos'),
(1, 'Mermelada de Arándanos', '$4.000', 'Mermelada de arándanos silvestres, dulce y natural.', 'images/product-mermeladas.jpg', 'Alimentos'),
(1, 'Pack Degustación', '$9.000', 'Pack con 3 mermeladas surtidas para degustar.', 'images/product-mermeladas.jpg', 'Alimentos'),
(2, 'Cesta de Mimbre', '$12.000', 'Cesta tejida a mano con mimbre local.', 'images/product-artesanias.jpg', 'Artesanía'),
(2, 'Cerámica Decorativa', '$8.500', 'Piezas de cerámica pintadas a mano.', 'images/product-artesanias.jpg', 'Artesanía'),
(3, 'Vino Tinto Reserva', '$6.500', 'Vino tinto artesanal, cosecha 2025.', 'images/product-vino.jpg', 'Vinos'),
(3, 'Vino Rosé', '$5.500', 'Vino rosé fresco, ideal para el verano.', 'images/product-vino.jpg', 'Vinos'),
(4, 'Miel Cruda 500g', '$4.500', 'Miel pura y cruda, directo del productor.', 'images/product-miel.jpg', 'Alimentos'),
(5, 'Jabón Natural de Lavanda', '$2.500', 'Jabón artesanal con aceite esencial de lavanda.', 'images/product-cosmetica.jpg', 'Belleza'),
(6, 'Tabla de Madera Nativa', '$15.000', 'Tabla rústica de madera nativa para servir.', 'images/product-madera.jpg', 'Madera'),
(7, 'Kuchen de Nuez', '$5.000', 'Kuchen tradicional maulino con nueces.', 'images/product-kuchen.jpg', 'Alimentos'),
(8, 'Cerveza IPA Artesanal', '$3.500', 'Cerveza IPA con lúpulos locales.', 'images/product-cerveza.jpg', 'Vinos'),
(9, 'Pan Amasado', '$1.500', 'Pan amasado tradicional, horneado fresco.', 'images/product-pan.jpg', 'Alimentos'),
(10, 'Poncho de Lana', '$35.000', 'Poncho tejido a mano en lana de oveja criolla.', 'images/product-poncho.jpg', 'Artesanía');

-- Insertar noticias
INSERT INTO news (title, excerpt, content, image, tag, status, created_at) VALUES
('CRDP Maule proyecta alianza 2026', 'Articulación para impulsar emprendimiento y turismo local.', '<p>El CRDP Maule, la Municipalidad de Yerbas Buenas y Vincula Maule se reunieron para proyectar una alianza estratégica para 2026.</p>', 'images/noticia-real-1.jpg', 'Alianza', 'published', '2026-03-25'),
('Emprendedores en Comité Pehuenche', 'La instancia permitió mostrar productos a nivel internacional.', '<p>Emprendedores de Market Maule participaron en el XXIV Comité de Integración Pehuenche.</p>', 'images/noticia-real-2.jpg', 'Evento', 'published', '2026-02-26'),
('Semana del Turismo 2025', 'Jornada de plantación de árboles y participación ciudadana.', '<p>La Semana del Turismo comenzó con una jornada de plantación en la Región del Maule.</p>', 'images/noticia-real-3.jpg', 'Turismo', 'published', '2025-05-06'),
('Nuevos emprendedores en Curicó', 'Cinco nuevos emprendimientos se integran a la vitrina.', '<p>Cinco nuevos emprendimientos de Curicó se han integrado a Market Maule.</p>', 'images/product-mermeladas.jpg', 'Nuevos', 'published', '2025-04-15'),
('Market Maule en ExpoMaule 2025', 'Confirmada participación con stand destacado.', '<p>Market Maule confirmó su participación en la ExpoMaule 2025.</p>', 'images/banner-hero-1.jpg', 'Evento', 'published', '2025-03-20'),
('Capacitación para emprendedores', 'Talleres gratuitos de marketing digital.', '<p>Abiertas las inscripciones para talleres de marketing digital y ventas online.</p>', 'images/entrepreneur-join.jpg', 'Capacitación', 'published', '2025-02-10');

-- Insertar banners del carrusel
INSERT INTO banners (title, image, link, order_num, active) VALUES
('Compra en el Comercio Local', 'images/banner-hero-1.jpg', 'emprendedores.html', 1, TRUE),
('Descubre el Sabor del Maule', 'images/banner-hero-2.jpg', 'emprendedores.html', 2, TRUE),
('Únete a Market Maule', 'images/banner-hero-3.jpg', 'unirse.html', 3, TRUE);

-- Insertar admin
INSERT INTO users (email, name, role, status, views) VALUES
('admin@marketmaule.cl', 'Administrador', 'admin', 'activo', 0);
