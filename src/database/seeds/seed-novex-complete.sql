-- ============================================================
-- NOVE X CRM - Seed Data (SECUENCIAS RESETEADAS A 1)
-- Los IDs son secuenciales empezando en 1
-- ============================================================

-- ----------------------------------------------------------
-- 1. CITY (10 ciudades)
-- ----------------------------------------------------------
INSERT INTO city (city, template, image) VALUES
('La Paz', '📍 Ciudad de La Paz - Delivery disponible', 'https://example.com/images/cities/la-paz.jpg'),
('Cochabamba', '📍 Cochabamba - Delivery disponible', 'https://example.com/images/cities/cochabamba.jpg'),
('Santa Cruz', '📍 Santa Cruz - Delivery disponible', 'https://example.com/images/cities/santa-cruz.jpg'),
('El Alto', '📍 El Alto - Delivery disponible', 'https://example.com/images/cities/el-alto.jpg'),
('Oruro', '📍 Oruro - Delivery disponible', 'https://example.com/images/cities/oruro.jpg'),
('Potosí', '📍 Potosí - Delivery disponible', 'https://example.com/images/cities/potosi.jpg'),
('Sucre', '📍 Sucre - Delivery disponible', 'https://example.com/images/cities/sucre.jpg'),
('Tarija', '📍 Tarija - Delivery disponible', 'https://example.com/images/cities/tarija.jpg'),
('Beni', '📍 Beni - Delivery disponible', 'https://example.com/images/cities/beni.jpg'),
('Pando', '📍 Pando - Delivery disponible', 'https://example.com/images/cities/pando.jpg');

-- ----------------------------------------------------------
-- 2. PAYMENT_METHOD (5 métodos)
-- ----------------------------------------------------------
INSERT INTO payment_method (method, template, image) VALUES
('QR', '💳 Pago por QR - Transferencia inmediata', 'https://example.com/images/payments/qr.jpg'),
('Transferencia', '🏦 Transferencia bancaria', 'https://example.com/images/payments/transfer.jpg'),
('Efectivo', '💵 Pago en efectivo', 'https://example.com/images/payments/cash.jpg'),
('Contra Entrega', '📦 Pago contra entrega', 'https://example.com/images/payments/cod.jpg'),
('Mercado Pago', '🛒 Pago con Mercado Pago', 'https://example.com/images/payments/mercadopago.jpg');

-- ----------------------------------------------------------
-- 3. DISTRIBUTOR (5 distribuidores)
-- DistributorID: 1=Shenzhen, 2=Guangzhou, 3=USA, 4=Yiwu, 5=HK
-- ----------------------------------------------------------
INSERT INTO distributor ("DistributorID", "Name", "Country", "Address", "ContactPhone") VALUES
(1, 'Shenzhen Tech Imports', 'China', 'Shenzhen, Guangdong, China', '+86 138 1234 5678'),
(2, 'Guangzhou Electronics', 'China', 'Guangzhou, Guangdong, China', '+86 139 8765 4321'),
(3, 'USA Wholesale Direct', 'Estados Unidos', 'Los Angeles, CA, USA', '+1 213 555 1234'),
(4, 'Yiwu Trading Market', 'China', 'Yiwu, Zhejiang, China', '+86 579 1234 5678'),
(5, 'HK Global Distributors', 'Hong Kong', 'Kowloon, Hong Kong', '+852 5123 4567');

-- ----------------------------------------------------------
-- 4. CATEGORY (10 categorías)
-- CategoryID: 1=Audio, 2=Smartwatch, 3=Powerbank, 4=Drones,
--            5=JuguetesRC, 6=Accesorios, 7=Cocina,
--            8=Iluminacion, 9=Deportes, 10=Hogar
-- ----------------------------------------------------------
INSERT INTO category ("CategoryID", "Name") VALUES
(1, 'Audio y Auriculares'),
(2, 'Smartwatches y Wearables'),
(3, 'Powerbanks y Cargadores'),
(4, 'Drones y RC'),
(5, 'Juguetes Telecontrolados'),
(6, 'Accesorios Móviles'),
(7, 'Gadgets de Cocina'),
(8, 'Iluminación LED'),
(9, 'Deportes y Fitness'),
(10, 'Hogar y Oficina');

-- ----------------------------------------------------------
-- 5. PRODUCT (37 productos)
-- Audio: 1-4, Smartwatches: 5-8, Powerbanks: 9-12,
-- Drones: 13-16, Juguetes RC: 17-20, Accesorios: 21-24,
-- Cocina: 25-27, Iluminación: 28-30, Deportes: 31-33,
-- Hogar: 34-37
-- DistributorID ref: 1=Shenzhen, 2=Guangzhou, 3=USA, 4=Yiwu, 5=HK
-- ----------------------------------------------------------
INSERT INTO product ("ProductID", "Name", "NickName", "Description", "Template", "Image", "DistributorID") VALUES
-- Audio (1-4)
(1, 'Auricular Bluetooth Pro X9', 'Pro X9', 'Auriculares Bluetooth 5.3 con cancelación de ruido, 30h de batería, sonido HI-FI', '🎧 Auricular Pro X9 - Bluetooth 5.3 - Cancelación de ruido - Bs {{price}}', 'https://example.com/images/products/pro-x9.jpg', 1),
(2, 'Auricular Gamer RGB Thunder', 'Thunder RGB', 'Auriculares gamer con iluminación RGB, micrófono desmontable, sonido surround 7.1', '🎧 Thunder RGB - Gamer - 7.1 Surround - Mic desm. - Bs {{price}}', 'https://example.com/images/products/thunder-rgb.jpg', 2),
(3, 'AirPods Clone Premium', 'AirPods Clone', 'Auriculares estilo AirPods con estuche de carga, touch control, sincronización automática', '🎧 AirPods Clone Premium - Estuche carga - Touch - Bs {{price}}', 'https://example.com/images/products/airpods-clone.jpg', 4),
(4, 'Auricular Neckband Sport', 'Neckband Sport', 'Auriculares de cuello Bluetooth IPX7 resistente al sudor, perfecta para ejercicio', '🎧 Neckband Sport - IPX7 - Running - Bs {{price}}', 'https://example.com/images/products/neckband.jpg', 1),
-- Smartwatches (5-8)
(5, 'Smartwatch FitPro Ultra', 'FitPro Ultra', 'Reloj inteligente con monitor cardíaco, SpO2, presión arterial, 7 días batería', '⌚ FitPro Ultra - Cardiaco - SpO2 - 7 dias batt - Bs {{price}}', 'https://example.com/images/products/fitpro-ultra.jpg', 1),
(6, 'Smartwatch Kids Tracker', 'Kids Tracker', 'Reloj GPS para niños con botón SOS, geofencing, llamadas bidireccionales', '⌚ Kids Tracker - GPS ninos - SOS - Llamadas - Bs {{price}}', 'https://example.com/images/products/kids-tracker.jpg', 3),
(7, 'Smartwatch Sport Elite', 'Sport Elite', 'Reloj deportivo con GPS integrado, 20 modos de ejercicio, sumergible 5ATM', '⌚ Sport Elite - GPS - 20 modos - 5ATM - Bs {{price}}', 'https://example.com/images/products/sport-elite.jpg', 2),
(8, 'Smartband Mi Band 6 Clone', 'Mi Band Clone', 'Pulsera fitness con pantalla AMOLED, monitor de sueño, 14 días batería', '⌚ Mi Band Clone - AMOLED - Sueño - 14 dias - Bs {{price}}', 'https://example.com/images/products/miband-clone.jpg', 4),
-- Powerbanks (9-12)
(9, 'Powerbank 20000mAh Fast Charge', 'PB 20000', 'Powerbank 20000mAh con carga rápida 65W, 3 puertos USB, carga Qi inalambrica', '🔋 Powerbank 20000mAh - 65W - 3 puertos - Qi - Bs {{price}}', 'https://example.com/images/products/pb-20000.jpg', 1),
(10, 'Powerbank Mini 5000mAh', 'PB Mini', 'Powerbank compacto 5000mAh con clip para celular, ideal para viaje', '🔋 PB Mini 5000mAh - Compacto - Viaje - Bs {{price}}', 'https://example.com/images/products/pb-mini.jpg', 4),
(11, 'Cargador Inalámbrico 3 en 1', 'Wireless 3in1', 'Cargador inalábrico para telefono + apple watch + airpods, 15W fast charge', '🔌 Wireless 3in1 - 15W - Phone+Watch+Pods - Bs {{price}}', 'https://example.com/images/products/wireless-3in1.jpg', 2),
(12, 'Cargador Carro Dual USB', 'Car Charger', 'Cargador para carro con 2 puertos USB-A + USB-C, 30W total', '🔌 Car Charger - 2 USB-A + USB-C - 30W - Bs {{price}}', 'https://example.com/images/products/car-charger.jpg', 4),
-- Drones (13-16)
(13, 'Drone Mini 4K con Cámara', 'Drone Mini 4K', 'Drone plegable con cámara 4K, GPS, 25 min vuelo, sigue al objetivo', '🚁 Drone Mini 4K - 4K - GPS - 25min - Bs {{price}}', 'https://example.com/images/products/drone-mini.jpg', 1),
(14, 'Drone GPS Professional 8K', 'Drone Pro 8K', 'Drone profesional con cámara 8K, evasion de obstáculos, 35 min vuelo', '🚁 Drone Pro 8K - 8K - Obstaculos - 35min - Bs {{price}}', 'https://example.com/images/products/drone-pro.jpg', 3),
(15, 'Drone Racing 1500KV', 'Drone Racing', 'Drone de carreras 1500KV, frame de carbono, FPV, hasta 180km/h', '🚁 Drone Racing 1500KV - Carbono - FPV - Bs {{price}}', 'https://example.com/images/products/drone-racing.jpg', 2),
(16, 'Drone Juguete Indoor', 'Drone Indoor', 'Mini drone para interiores con protección de hélices, 3 velocidades, niños', '🚁 Drone Indoor - Nino - Proteccion - 3 vel - Bs {{price}}', 'https://example.com/images/products/drone-indoor.jpg', 4),
-- Juguetes RC (17-20)
(17, 'Auto RC Buggy 4x4 Pro', 'Buggy 4x4', 'Auto teledirigido Buggy 4x4, motor brushless, 45km/h, 2.4GHz', '🚗 Buggy 4x4 Pro - Brushless - 45km/h - 2.4G - Bs {{price}}', 'https://example.com/images/products/buggy-4x4.jpg', 1),
(18, 'Auto RC Monster Truck', 'Monster Truck', 'Camioneta RC Monster, grandes ruedas, todoterreno, 2.4GHz 30min autonomía', '🚗 Monster Truck RC - Todoterreno - 30min - Bs {{price}}', 'https://example.com/images/products/monster-truck.jpg', 2),
(19, 'Barco RC Speedboat', 'Speedboat RC', 'Barco RC de velocidad para agua, 25km/h, 2.4GHz, batería 1000mAh', '🚤 Speedboat RC - Agua - 25km/h - 2.4G - Bs {{price}}', 'https://example.com/images/products/speedboat.jpg', 4),
(20, 'Helicoptero RC Indoor', 'Helicoptero RC', 'Helicóptero RC de interior con gyro 6 ejes, 3.5 canales, carga USB', '🚁 Heli RC - Interior - 6 ejes - USB carga - Bs {{price}}', 'https://example.com/images/products/heli-rc.jpg', 1),
-- Accesorios (21-24)
(21, 'Funda Antigolpe Premium', 'Funda Premium', 'Funda celular antichoque militar, compatible con iPhone y Samsung', '📱 Funda Premium - Militar - iPhone/Samsung - Bs {{price}}', 'https://example.com/images/products/case-premium.jpg', 4),
(22, 'Vidrio Templado 9H', 'Tempered Glass', 'Vidrio templado 9H, transparencia 99%, antihuella, instalación fácil', '📱 Vidrio 9H - Transparente - Antihuella - Bs {{price}}', 'https://example.com/images/products/tempered-glass.jpg', 4),
(23, 'Cable USB-C 100W 2m', 'USB-C 100W', 'Cable USB-C a USB-C 100W, carga rápida, transferencia 10Gbps, mallado', '🔌 USB-C 100W - 2m - Carga rapida - Bs {{price}}', 'https://example.com/images/products/usbc-100w.jpg', 1),
(24, 'Soporte Celular Carro Magnético', 'Mag Car', 'Soporte magnético para carro, 360°, aire acondicionado, muy resistente', '📱 Mag Car - 360° - Imán - Acessive - Bs {{price}}', 'https://example.com/images/products/mag-car.jpg', 2),
-- Cocina (25-27)
(25, 'Balanza Digital Cocina', 'Balanza Cocina', 'Balanza digital de cocina, precisión 1g, hasta 10kg, pantalla LCD', '🍳 Balanza Cocina - 1g precision - 10kg - LCD - Bs {{price}}', 'https://example.com/images/products/balanza.jpg', 4),
(26, 'Tostadora Doble Ranura', 'Tostadora', 'Tostadora 800W, doble ranura, 6 niveles de tostado, bandeja migas', '🍞 Tostadora - 800W - Doble - 6 niveles - Bs {{price}}', 'https://example.com/images/products/tostadora.jpg', 4),
(27, 'Licuadora Portátil USB', 'Licuadora USB', 'Licuadora portátil USB, pilas recargables, corte acero inoxidable, 380ml', '🍹 Licuadora USB - Recargable - Acero - 380ml - Bs {{price}}', 'https://example.com/images/products/licuadora.jpg', 1),
-- Iluminación (28-30)
(28, 'Tira LED RGB 5m WiFi', 'Tira RGB WiFi', 'Tira LED 5 metros, RGB 16 millones colores, control WiFi, compatible Alexa/Google', '💡 Tira RGB WiFi - 5m - Alexa - Google Home - Bs {{price}}', 'https://example.com/images/products/tira-rgb.jpg', 1),
(29, 'Bombilla LED WiFi 10W', 'Bulb WiFi', 'Bombilla LED WiFi 10W, equivalente 60W, 16M colores, control voz', '💡 Bulb WiFi 10W - RGB - Alexa - Google - Bs {{price}}', 'https://example.com/images/products/bulb-wifi.jpg', 2),
(30, 'Lampara LED Escritorio', 'Desk Lamp', 'Lámpara LED de escritorio, 3 temperaturas color, regulable, USB carga', '💡 Desk Lamp LED - 3 temp - Regulable - USB - Bs {{price}}', 'https://example.com/images/products/desk-lamp.jpg', 4),
-- Deportes (31-33)
(31, 'Bicicleta Estática Plegable', 'Bike Plegable', 'Bicicleta estática plegable, 8 niveles de resistencia, pantalla LCD, hasta 100kg', '🚴 Bike Plegable - 8 resist - LCD - Plegable - Bs {{price}}', 'https://example.com/images/products/bike-plegable.jpg', 1),
(32, 'Caminadora Eléctrica Mini', 'Caminadora Mini', 'Caminadora eléctrica mini, velocidad 6km/h, pantalla LED, plegable', '🏃 Caminadora Mini - 6km/h - LED - Plegable - Bs {{price}}', 'https://example.com/images/products/caminadora.jpg', 2),
(33, 'Columpio Eléctrico Fit', 'Columpio Fit', 'Columpio eléctrico para ejercicio, 10 niveles, control remoto, baja de peso', '🏋️ Columpio Fit - 10 niveles - Control - Bs {{price}}', 'https://example.com/images/products/columpio.jpg', 4),
-- Hogar (34-37)
(34, 'Escritorio Elevable Eléctrico', 'Desk Elevable', 'Escritorio eléctrico sit/stand, altura regulable 70-120cm, 2 motores', '🖥️ Desk Elevable - Electrico - 70-120cm - 2 motores - Bs {{price}}', 'https://example.com/images/products/desk-elevable.jpg', 3),
(35, 'Silla Ergonómica Mesh', 'Silla Ergo', 'Silla ergonómica de malla, soporte lumbar, reposabrazos 4D, hasta 150kg', '🪑 Silla Ergo Mesh - Lumbar - 4D - 150kg - Bs {{price}}', 'https://example.com/images/products/silla-ergo.jpg', 3),
(36, 'Purificador de Aire HEPA', 'Purificador', 'Purificador de aire HEPA H13, silencioso 25dB, cobertura 40m², temporizador', '🌬️ Purificador HEPA H13 - 25dB - 40m² - Bs {{price}}', 'https://example.com/images/products/purificador.jpg', 1),
(37, 'Humidificador Ultrasónico', 'Humidificador', 'Humidificador ultrasónico 4L, niebla fría, 30h autonomía, luz nocturna LED', '💨 Humidificador 4L - Ultrasónico - 30h - LED - Bs {{price}}', 'https://example.com/images/products/humidificador.jpg', 4);

-- ----------------------------------------------------------
-- 6. PRODUCTS_CATEGORIES
-- Cat 1 -> products 1-4, Cat 2 -> 5-8, Cat 3 -> 9-12,
-- Cat 4 -> 13-16, Cat 5 -> 17-20, Cat 6 -> 21-24,
-- Cat 7 -> 25-27, Cat 8 -> 28-30, Cat 9 -> 31-33,
-- Cat 10 -> 34-37
-- ----------------------------------------------------------
INSERT INTO products_categories ("CategoryID", "ProductID")
SELECT v.cat, generate_series AS prod FROM (
  VALUES (1,1,4), (2,5,8), (3,9,12), (4,13,16), (5,17,20),
         (6,21,24), (7,25,27), (8,28,30), (9,31,33), (10,34,37)
) AS v(cat, start_prod, end_prod)
CROSS JOIN generate_series(v.start_prod, v.end_prod);

-- ----------------------------------------------------------
-- 7. PRICE
-- USD/BOB ~= 6.96
-- ----------------------------------------------------------
INSERT INTO price ("PriceID", "Cost", "SellingPrice", "Currency", "ProductID")
SELECT
  g,
  (ARRAY[12.50,18.00,6.00,8.50, 22.00,25.00,35.00,7.00, 14.00,5.00,11.00,4.50,
        45.00,120.00,65.00,15.00, 28.00,35.00,22.00,12.00,
        2.00,1.00,3.50,4.00, 8.00,15.00,10.00,
        7.00,5.00,12.00, 85.00,95.00,55.00, 180.00,95.00,65.00,18.00])[g],
  (ARRAY[299.00,399.00,149.00,199.00, 499.00,599.00,799.00,179.00,
        329.00,129.00,279.00,99.00, 999.00,2599.00,1399.00,349.00,
        649.00,799.00,499.00,279.00, 49.00,29.00,79.00,89.00,
        189.00,349.00,229.00, 169.00,119.00,279.00,
        1899.00,2099.00,1199.00, 3899.00,2099.00,1449.00,399.00])[g],
  'BOB',
  g
FROM generate_series(1,37) AS g;

-- ----------------------------------------------------------
-- 8. INVENTORY
-- ----------------------------------------------------------
INSERT INTO inventory ("InventoryID", quantity, "ProductID")
SELECT g,
  (ARRAY[45,30,120,55, 25,15,10,80, 60,90,35,110,
         12,5,8,40, 20,15,25,50, 200,500,150,80,
         40,20,60, 70,90,45, 8,6,12, 3,10,15,50])[g]::int,
  g
FROM generate_series(1,37) AS g;

-- ----------------------------------------------------------
-- 9. PRODUCT_VARIANT
-- ----------------------------------------------------------
INSERT INTO product_variant ("variantName", "ProductID") VALUES
('Negro', 1),('Blanco', 1),('Azul', 1),
('Negro', 2),('Blanco', 2),
('Blanco', 3),('Negro', 3),
('Negro', 5),('Plata', 5),('Dorado', 5),
('Azul', 6),('Rosa', 6),('Verde', 6),
('Negro', 7),('Negro/Rojo', 7),
('Negro', 9),('Blanco', 9),
('Gris', 13),('Negro', 13),
('Negro', 14),
('Rojo', 17),('Azul', 17),('Verde', 17),
('RGB', 28);

-- ----------------------------------------------------------
-- 10. PRODUCT_LINK
-- ----------------------------------------------------------
INSERT INTO product_link (link, "ProductID") VALUES
('https://fb.com/novex.bo/pro-x9', 1),
('https://instagram.com/novex.bo/p/abc123', 1),
('https://tiktok.com/@novex.bo/video/123', 1),
('https://wa.me/59170000001?text=Hola%20quiero%20comprar%20Pro%20X9', 1),
('https://fb.com/novex.bo/fitpro-ultra', 5),
('https://instagram.com/novex.bo/p/def456', 5),
('https://wa.me/59170000001?text=Hola%20quiero%20comprar%20FitPro%20Ultra', 5),
('https://fb.com/novex.bo/drone-mini-4k', 13),
('https://instagram.com/novex.bo/p/ghi789', 13),
('https://tiktok.com/@novex.bo/video/456', 13),
('https://wa.me/59170000001?text=Hola%20quiero%20comprar%20Drone%20Mini%204K', 13),
('https://fb.com/novex.bo/buggy-4x4', 17),
('https://tiktok.com/@novex.bo/video/789', 17),
('https://fb.com/novex.bo/desk-elevable', 34);

-- ----------------------------------------------------------
-- 11. CUSTOMER (15 clientes)
-- ----------------------------------------------------------
INSERT INTO customer ("CustomerID", name, phone) VALUES
(1, 'Maria Fernanda Lopez', '+591 700 12345'),
(2, 'Carlos Javier Mamani', '+591 712 34567'),
(3, 'Roberto Alejandro Duran', '+591 722 45678'),
(4, 'Ana Lucia Terrazas', '+591 732 56789'),
(5, 'Luis Miguel Condori', '+591 742 67890'),
(6, 'Carmen Rosa Quispe', '+591 752 78901'),
(7, 'Jorge Eduardo Pereda', '+591 762 89012'),
(8, 'Patricia Veronica Flores', '+591 772 90123'),
(9, 'Diego Fernando Choque', '+591 782 01234'),
(10, 'Gabriela Sofia Vargas', '+591 792 12345'),
(11, 'Bruno Nicolas Tellez', '+591 602 23456'),
(12, 'Valentina Raquel Cruz', '+591 612 34567'),
(13, 'Andres Felipe Luna', '+591 623 45678'),
(14, 'Daniela Cristina Torrico', '+591 634 56789'),
(15, 'Francisco Javier Zambrana', '+591 645 67890');

-- ----------------------------------------------------------
-- 12. CUSTOMER_ORDER (10 pedidos)
-- CustomerID -> CityID, PaymentMethodID
-- ----------------------------------------------------------
INSERT INTO customer_order ("CustomerOrderID", "CustomerID", "CityID", "PaymentMethodID") VALUES
(1, 1, 1, 1),  -- Maria -> La Paz -> QR
(2, 2, 2, 2),  -- Carlos -> Cochabamba -> Transferencia
(3, 3, 3, 3),  -- Ana -> Santa Cruz -> Efectivo
(4, 4, 4, 4),  -- Luis -> El Alto -> Contra Entrega
(5, 5, 1, 5),  -- Carmen -> La Paz -> Mercado Pago
(6, 6, 2, 1),  -- Jorge -> Cochabamba -> QR
(7, 7, 8, 2),  -- Patricia -> Tarija -> Transferencia
(8, 8, 3, 3),  -- Diego -> Santa Cruz -> Efectivo
(9, 9, 7, 1),  -- Gabriela -> Sucre -> QR
(10, 10, 1, 2); -- Bruno -> La Paz -> Transferencia

-- ----------------------------------------------------------
-- 13. CUSTOMER_ORDER_DETAIL
-- ----------------------------------------------------------
INSERT INTO customer_order_detail ("CustomerOrderDetailID", "CustomerOrderID", "ProductID", "Quantity", "customerOrderCustomerOrderID", "productProductID") VALUES
(1, 1, 1, 1, 1, 1),
(2, 1, 9, 2, 1, 9),
(3, 2, 5, 1, 2, 5),
(4, 2, 28, 3, 2, 28),
(5, 3, 13, 1, 3, 13),
(6, 4, 17, 1, 4, 17),
(7, 4, 16, 2, 4, 16),
(8, 5, 3, 5, 5, 3),
(9, 6, 34, 1, 6, 34),
(10, 7, 7, 1, 7, 7),
(11, 7, 35, 1, 7, 35),
(12, 8, 18, 1, 8, 18),
(13, 8, 19, 1, 8, 19),
(14, 9, 22, 10, 9, 22),
(15, 9, 21, 10, 9, 21),
(16, 10, 36, 1, 10, 36),
(17, 10, 37, 2, 10, 37);

-- ----------------------------------------------------------
-- 14. PRODUCT_ORDER (4 órdenes a distribuidores)
-- Superadmin UUID
-- ----------------------------------------------------------
INSERT INTO product_order ("ProductOrderID", "UserID", "DistributorID", "OrderDate") VALUES
(1, 'eba04d71-d0b2-4232-9bed-6463f2f5591e', 1, '2026-03-15'),
(2, 'eba04d71-d0b2-4232-9bed-6463f2f5591e', 2, '2026-03-18'),
(3, 'eba04d71-d0b2-4232-9bed-6463f2f5591e', 3, '2026-03-20'),
(4, 'eba04d71-d0b2-4232-9bed-6463f2f5591e', 4, '2026-03-22');

-- ----------------------------------------------------------
-- 15. PRODUCT_ORDER_DETAIL
-- ----------------------------------------------------------
INSERT INTO product_order_detail ("ProductOrderDetailID", "ProductID", "ProductOrderID", "Quantity", "TotalAmount") VALUES
-- Orden 1 (Shenzhen): Pro X9 x50, Neckband x30, PB 20000 x40
(1, 1, 1, 50, 625.00),
(2, 4, 1, 30, 255.00),
(3, 9, 1, 40, 560.00),
-- Orden 2 (Guangzhou): Thunder RGB x20, Sport Elite x15
(4, 2, 2, 20, 360.00),
(5, 7, 2, 15, 525.00),
-- Orden 3 (USA): Kids Tracker x20, Desk Elevable x5
(6, 6, 3, 20, 500.00),
(7, 34, 3, 5, 900.00),
-- Orden 4 (Yiwu): AirPods Clone x100, PB Mini x80, Vidrio x300
(8, 3, 4, 100, 600.00),
(9, 10, 4, 80, 400.00),
(10, 22, 4, 300, 300.00);

-- ----------------------------------------------------------
-- 16. DISTRIBUTOR_RELATION
-- ----------------------------------------------------------
INSERT INTO distributor_relation ("DistributorRelationid", "TotalOrders", "TotalSpent", "DistributorID") VALUES
(1, 12, 8520.00, 1),
(2, 8, 4280.00, 2),
(3, 5, 3200.00, 3),
(4, 15, 2150.00, 4),
(5, 3, 980.00, 5);
