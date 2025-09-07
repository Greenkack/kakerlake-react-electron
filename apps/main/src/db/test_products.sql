-- Sample products for testing the ProductManagement functionality
-- This file can be run manually to populate the database with test data

INSERT OR IGNORE INTO products (
    category, model_name, brand, price_euro, capacity_w, warranty_years, 
    efficiency_percent, description, image_base64, created_at, updated_at,
    cell_technology, module_structure, cell_type, version, module_warranty_text
) VALUES 
-- PV Modules
(
    'Modul', 'JA Solar JAM72D30 530-550/MB', 'JA Solar', 189.50, 540, 25,
    21.2, 'Hochleistungsmodul mit Monokristallin N-Type Zellen und exzellenter Leistung',
    '', datetime('now'), datetime('now'),
    'Monokristallin N-Type', 'Glas-Folie', '144 Halbzellen', 'Standard', 
    '25 Jahre Produktgarantie | 30 Jahre Leistungsgarantie'
),
(
    'Modul', 'Trina Solar Vertex S+ TSM-420DE15H.08(II)', 'Trina Solar', 165.80, 420, 25,
    21.8, 'Hocheffizientes Vertex S+ Modul mit TOPCon Technologie',
    '', datetime('now'), datetime('now'),
    'Monokristallin TOPCon', 'Glas-Glas', '108 Halbzellen', 'All-Black', 
    '25 Jahre Produktgarantie | 30 Jahre Leistungsgarantie'
),
(
    'Modul', 'Longi Solar Hi-MO 6 LR5-54HTH 430-450W', 'Longi Solar', 175.25, 440, 25,
    22.3, 'Premium Hi-MO 6 Serie mit PERC+ Technologie und All-Black Design',
    '', datetime('now'), datetime('now'),
    'Monokristallin PERC+', 'Glas-Folie', '108 Halbzellen', 'All-Black',
    '25 Jahre Produktgarantie | 30 Jahre Leistungsgarantie'
),

-- Inverters
(
    'Wechselrichter', 'SMA Sunny Tripower 15000TL-30', 'SMA', 2845.60, NULL, 10,
    NULL, 'Dreiphasiger String-Wechselrichter für größere Anlagen', 
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '10 Jahre Herstellergarantie'
),
(
    'Wechselrichter', 'Fronius Symo 10.0-3-M', 'Fronius', 1689.90, NULL, 5,
    NULL, 'Kompakter dreiphasiger Wechselrichter mit integriertem Monitoring',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '5 Jahre Standardgarantie'
),
(
    'Wechselrichter', 'Huawei SUN2000-12KTL-M1', 'Huawei', 1250.75, NULL, 10,
    NULL, 'Intelligenter String-Wechselrichter mit hoher Effizienz',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '10 Jahre Herstellergarantie'
),

-- Battery Storage
(
    'Batteriespeicher', 'BYD Battery-Box Premium HVS 7.7', 'BYD', 4567.80, NULL, 10,
    NULL, 'Hochvolt Lithium-Eisenphosphat Speicher mit hoher Sicherheit',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '10 Jahre Garantie'
),
(
    'Batteriespeicher', 'SENEC Home V3 hybrid 10 kWh', 'SENEC', 8950.00, NULL, 10,
    NULL, 'All-in-One Speichersystem mit integriertem Wechselrichter',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '10 Jahre Systemgarantie'
),
(
    'Batteriespeicher', 'Tesla Powerwall 2', 'Tesla', 7800.00, NULL, 10,
    NULL, 'Kompakter AC-Batteriespeicher mit 13,5 kWh nutzbarer Kapazität',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '10 Jahre Garantie'
),

-- Wallboxes  
(
    'Wallbox', 'Heidelberg Wallbox Energy Control 11kW', 'Heidelberg', 649.00, NULL, 3,
    NULL, 'Intelligente Wallbox mit App-Steuerung und Lastmanagement',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '3 Jahre Herstellergarantie'
),
(
    'Wallbox', 'go-eCharger HOME+ 11kW', 'go-e', 599.00, NULL, 2,
    NULL, 'Kompakte mobile Wallbox mit WLAN und App-Steuerung',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '2 Jahre Garantie'
),

-- Accessories
(
    'Zubehör', 'K2 Systems MountainPro Montageschiene 4,20m', 'K2 Systems', 89.50, NULL, 15,
    NULL, 'Hochwertige Aluminium-Montageschiene für Schrägdächer',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '15 Jahre Materialgarantie'
),
(
    'Zubehör', 'MC4 Steckverbinder Set (10 Stück)', 'Multi-Contact', 25.90, NULL, 25,
    NULL, 'Original MC4 Steckverbinder für sichere PV-Verbindungen',
    '', datetime('now'), datetime('now'),
    NULL, NULL, NULL, NULL, '25 Jahre Garantie'
);
