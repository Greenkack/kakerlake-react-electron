#!/usr/bin/env python3
"""
product_bridge.py
Simplified bridge for product data only - avoids database stdout pollution
"""

import sys
import json
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent.parent  # Go up from apps/main to root
sys.path.insert(0, str(project_root))

# Suppress database print statements by redirecting stdout
import contextlib
from io import StringIO

# Mock product data until database is available
MOCK_PRODUCTS = {
    'Modul': {
        'Aiko Solar': [
            {'id': 1, 'kategorie': 'Modul', 'hersteller': 'Aiko Solar', 'produkt_modell': 'A400-MAH54Mb', 'pv_modul_leistung': 400},
            {'id': 2, 'kategorie': 'Modul', 'hersteller': 'Aiko Solar', 'produkt_modell': 'A405-MAH54Mb', 'pv_modul_leistung': 405}
        ],
        'ViessmannPV': [
            {'id': 3, 'kategorie': 'Modul', 'hersteller': 'ViessmannPV', 'produkt_modell': 'Vitovolt 300-DG M440HC', 'pv_modul_leistung': 440}
        ],
        'TrinaSolarPV': [
            {'id': 4, 'kategorie': 'Modul', 'hersteller': 'TrinaSolarPV', 'produkt_modell': 'TSM-DE21M(II)-440W', 'pv_modul_leistung': 440}
        ]
    },
    'Wechselrichter': {
        'SolarEdge': [
            {'id': 5, 'kategorie': 'Wechselrichter', 'hersteller': 'SolarEdge', 'produkt_modell': 'SE5K-RWS', 'wr_leistung_kw': 5.0}
        ],
        'SMA': [
            {'id': 6, 'kategorie': 'Wechselrichter', 'hersteller': 'SMA', 'produkt_modell': 'Sunny Boy 5.0', 'wr_leistung_kw': 5.0}
        ]
    },
    'Batteriespeicher': {
        'Tesla': [
            {'id': 7, 'kategorie': 'Batteriespeicher', 'hersteller': 'Tesla', 'produkt_modell': 'Powerwall 2', 'kapazitaet_speicher_kwh': 13.5}
        ]
    },
    'Wallbox': {
        'ABL': [
            {'id': 8, 'kategorie': 'Wallbox', 'hersteller': 'ABL', 'produkt_modell': 'eMH1 11kW'}
        ]
    },
    'Energiemanagementsystem': {
        'SMA': [
            {'id': 9, 'kategorie': 'Energiemanagementsystem', 'hersteller': 'SMA', 'produkt_modell': 'Sunny Home Manager 2.0'}
        ]
    },
    'Leistungsoptimierer': {
        'SolarEdge': [
            {'id': 10, 'kategorie': 'Leistungsoptimierer', 'hersteller': 'SolarEdge', 'produkt_modell': 'P370-5RM4MRY'}
        ]
    },
    'Carport': {
        'Solarcarport GmbH': [
            {'id': 11, 'kategorie': 'Carport', 'hersteller': 'Solarcarport GmbH', 'produkt_modell': 'Solar Carport Standard'}
        ]
    },
    'Notstromversorgung': {
        'Tesla': [
            {'id': 12, 'kategorie': 'Notstromversorgung', 'hersteller': 'Tesla', 'produkt_modell': 'Backup Gateway 2'}
        ]
    },
    'Tierabwehrschutz': {
        'SolarProtect': [
            {'id': 13, 'kategorie': 'Tierabwehrschutz', 'hersteller': 'SolarProtect', 'produkt_modell': 'Taubenabwehr Standard'}
        ]
    }
}

def get_manufacturers_by_category(category):
    """Get manufacturers for a category"""
    products = MOCK_PRODUCTS.get(category, {})
    return sorted(list(products.keys()))

def get_models_by_manufacturer(category, manufacturer):
    """Get models for a manufacturer in a category"""
    products = MOCK_PRODUCTS.get(category, {})
    return products.get(manufacturer, [])

def main():
    """Main function - only handles direct commands"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({'error': 'No command provided'}))
            return
            
        command = sys.argv[1]
        
        if command == 'get_pv_manufacturers':
            result = get_manufacturers_by_category('Modul')
            
        elif command == 'get_pv_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Modul', manufacturer)
            
        elif command == 'get_inverter_manufacturers':
            result = get_manufacturers_by_category('Wechselrichter')
            
        elif command == 'get_inverter_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Wechselrichter', manufacturer)
            
        elif command == 'get_storage_manufacturers':
            result = get_manufacturers_by_category('Batteriespeicher')
            
        elif command == 'get_storage_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Batteriespeicher', manufacturer)
            
        elif command == 'get_wallbox_manufacturers':
            result = get_manufacturers_by_category('Wallbox')
            
        elif command == 'get_wallbox_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Wallbox', manufacturer)
            
        elif command == 'get_ems_manufacturers':
            result = get_manufacturers_by_category('Energiemanagementsystem')
            
        elif command == 'get_ems_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Energiemanagementsystem', manufacturer)
            
        elif command == 'get_optimizer_manufacturers':
            result = get_manufacturers_by_category('Leistungsoptimierer')
            
        elif command == 'get_optimizer_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Leistungsoptimierer', manufacturer)
            
        elif command == 'get_carport_manufacturers':
            result = get_manufacturers_by_category('Carport')
            
        elif command == 'get_carport_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Carport', manufacturer)
            
        elif command == 'get_emergency_power_manufacturers':
            result = get_manufacturers_by_category('Notstromversorgung')
            
        elif command == 'get_emergency_power_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Notstromversorgung', manufacturer)
            
        elif command == 'get_animal_protection_manufacturers':
            result = get_manufacturers_by_category('Tierabwehrschutz')
            
        elif command == 'get_animal_protection_models' and len(sys.argv) >= 3:
            manufacturer = sys.argv[2]
            result = get_models_by_manufacturer('Tierabwehrschutz', manufacturer)
            
        else:
            result = {'error': f'Unknown command: {command}'}
        
        # Output clean JSON
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        error_result = {'error': str(e)}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
