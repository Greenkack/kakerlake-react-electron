"""
Solar Calculator Product Bridge - Verbindung zwischen React Frontend und Python Backend
Ersetzt Mock-Daten durch echte Produktdatenbank
"""
import sqlite3
import json
from typing import List, Dict, Optional
from pathlib import Path

class SolarCalculatorProductBridge:
    """Bridge zwischen React Frontend und Python Produktdatenbank"""
    
    def __init__(self, db_path: str = "data/app_data.db"):
        self.db_path = db_path
        
    def get_connection(self):
        """SQLite Verbindung"""
        return sqlite3.connect(self.db_path)
    
    def get_pv_manufacturers(self) -> List[str]:
        """Alle PV Modul Hersteller laden"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            # Prüfe erst products_complete, dann fallback auf products
            try:
                cursor.execute("""
                    SELECT DISTINCT hersteller 
                    FROM products_complete 
                    WHERE kategorie = 'PV Modul' 
                    ORDER BY hersteller
                """)
                manufacturers = [row[0] for row in cursor.fetchall()]
                if manufacturers:
                    return manufacturers
            except:
                pass
                
            # Fallback auf alte products Tabelle
            cursor.execute("""
                SELECT DISTINCT manufacturer 
                FROM products 
                WHERE category LIKE '%Modul%' OR category LIKE '%PV%'
                ORDER BY manufacturer
            """)
            return [row[0] for row in cursor.fetchall()]
        except Exception as e:
            print(f"Error loading manufacturers: {e}")
            return []
        finally:
            conn.close()
    
    def get_pv_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """PV Module nach Hersteller mit allen Eigenschaften"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            # Erst products_complete versuchen
            try:
                cursor.execute("""
                    SELECT id, produkt_modell, pv_modul_leistung, preis_stück, 
                           wirkungsgrad_prozent, mass_laenge, mass_breite, 
                           mass_gewicht_kg, garantie_zeit, hersteller_land
                    FROM products_complete 
                    WHERE kategorie = 'PV Modul' AND hersteller = ?
                    ORDER BY produkt_modell
                """, [manufacturer])
                
                results = []
                for row in cursor.fetchall():
                    results.append({
                        'id': row[0],
                        'model': row[1],
                        'capacity_w': row[2],
                        'price': row[3],
                        'efficiency': row[4],
                        'length_m': row[5],
                        'width_m': row[6],
                        'weight_kg': row[7],
                        'warranty_years': row[8],
                        'origin': row[9],
                        'category': 'PV Modul',
                        'brand': manufacturer
                    })
                
                if results:
                    return results
            except Exception as e:
                print(f"products_complete error: {e}")
            
            # Fallback auf products Tabelle
            cursor.execute("""
                SELECT id, model_name, capacity_w, price_euro, 
                       efficiency_percent, length_m, width_m, weight_kg,
                       warranty_years, origin_country
                FROM products 
                WHERE manufacturer = ? AND (category LIKE '%Modul%' OR category LIKE '%PV%')
                ORDER BY model_name
            """, [manufacturer])
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    'id': row[0],
                    'model': row[1],
                    'capacity_w': row[2] or 0,
                    'price': row[3] or 0,
                    'efficiency': row[4] or 0,
                    'length_m': row[5] or 0,
                    'width_m': row[6] or 0,
                    'weight_kg': row[7] or 0,
                    'warranty_years': row[8] or 0,
                    'origin': row[9] or '',
                    'category': 'PV Modul',
                    'brand': manufacturer
                })
            
            return results
            
        except Exception as e:
            print(f"Error loading models for {manufacturer}: {e}")
            return []
        finally:
            conn.close()
    
    def get_inverter_manufacturers(self) -> List[str]:
        """Wechselrichter Hersteller"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            # products_complete zuerst
            try:
                cursor.execute("""
                    SELECT DISTINCT hersteller 
                    FROM products_complete 
                    WHERE kategorie = 'Wechselrichter' 
                    ORDER BY hersteller
                """)
                manufacturers = [row[0] for row in cursor.fetchall()]
                if manufacturers:
                    return manufacturers
            except:
                pass
            
            # Fallback
            cursor.execute("""
                SELECT DISTINCT manufacturer 
                FROM products 
                WHERE category LIKE '%Wechselrichter%' OR category LIKE '%Inverter%'
                ORDER BY manufacturer
            """)
            return [row[0] for row in cursor.fetchall()]
        except:
            return []
        finally:
            conn.close()
    
    def get_inverter_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Wechselrichter nach Hersteller"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            # products_complete
            try:
                cursor.execute("""
                    SELECT id, produkt_modell, wr_leistung_kw, preis_stück,
                           wirkungsgrad_prozent, garantie_zeit
                    FROM products_complete 
                    WHERE kategorie = 'Wechselrichter' AND hersteller = ?
                    ORDER BY produkt_modell
                """, [manufacturer])
                
                results = []
                for row in cursor.fetchall():
                    results.append({
                        'id': row[0],
                        'model': row[1],
                        'power_kw': row[2],
                        'price': row[3],
                        'efficiency': row[4],
                        'warranty_years': row[5],
                        'category': 'Wechselrichter',
                        'brand': manufacturer
                    })
                
                if results:
                    return results
            except:
                pass
            
            # Fallback
            cursor.execute("""
                SELECT id, model_name, power_kw, price_euro, efficiency_percent
                FROM products 
                WHERE manufacturer = ? AND category LIKE '%Wechselrichter%'
                ORDER BY model_name
            """, [manufacturer])
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    'id': row[0],
                    'model': row[1],
                    'power_kw': row[2] or 0,
                    'price': row[3] or 0,
                    'efficiency': row[4] or 0,
                    'category': 'Wechselrichter',
                    'brand': manufacturer
                })
            
            return results
            
        except Exception as e:
            print(f"Error loading inverter models: {e}")
            return []
        finally:
            conn.close()
    
    def get_storage_manufacturers(self) -> List[str]:
        """Batteriespeicher Hersteller"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            try:
                cursor.execute("""
                    SELECT DISTINCT hersteller 
                    FROM products_complete 
                    WHERE kategorie = 'Batteriespeicher' 
                    ORDER BY hersteller
                """)
                manufacturers = [row[0] for row in cursor.fetchall()]
                if manufacturers:
                    return manufacturers
            except:
                pass
            
            cursor.execute("""
                SELECT DISTINCT manufacturer 
                FROM products 
                WHERE category LIKE '%Speicher%' OR category LIKE '%Batter%'
                ORDER BY manufacturer
            """)
            return [row[0] for row in cursor.fetchall()]
        except:
            return []
        finally:
            conn.close()
    
    def get_storage_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Batteriespeicher nach Hersteller"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            try:
                cursor.execute("""
                    SELECT id, produkt_modell, kapazitaet_speicher_kwh, preis_stück,
                           ladezyklen_speicher, garantie_zeit
                    FROM products_complete 
                    WHERE kategorie = 'Batteriespeicher' AND hersteller = ?
                    ORDER BY produkt_modell
                """, [manufacturer])
                
                results = []
                for row in cursor.fetchall():
                    results.append({
                        'id': row[0],
                        'model': row[1],
                        'storage_kwh': row[2],
                        'price': row[3],
                        'max_cycles': row[4],
                        'warranty_years': row[5],
                        'category': 'Batteriespeicher',
                        'brand': manufacturer
                    })
                
                if results:
                    return results
            except:
                pass
            
            # Fallback
            cursor.execute("""
                SELECT id, model_name, power_kw as storage_kwh, price_euro
                FROM products 
                WHERE manufacturer = ? AND category LIKE '%Speicher%'
                ORDER BY model_name
            """, [manufacturer])
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    'id': row[0],
                    'model': row[1],
                    'storage_kwh': row[2] or 0,
                    'price': row[3] or 0,
                    'category': 'Batteriespeicher',
                    'brand': manufacturer
                })
            
            return results
            
        except Exception as e:
            print(f"Error loading storage models: {e}")
            return []
        finally:
            conn.close()
    
    def export_for_react(self) -> Dict:
        """Export aller Produkte für React Frontend"""
        return {
            'pv_manufacturers': self.get_pv_manufacturers(),
            'inverter_manufacturers': self.get_inverter_manufacturers(),
            'storage_manufacturers': self.get_storage_manufacturers(),
        }
    
    def get_wallbox_manufacturers(self) -> List[str]:
        """Wallbox Hersteller"""
        return self._get_manufacturers_by_category('Wallbox')
    
    def get_wallbox_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Wallbox nach Hersteller"""
        return self._get_models_by_manufacturer('Wallbox', manufacturer)
    
    def get_ems_manufacturers(self) -> List[str]:
        """Energiemanagementsystem Hersteller"""
        return self._get_manufacturers_by_category('Energiemanagementsystem')
    
    def get_ems_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """EMS nach Hersteller"""
        return self._get_models_by_manufacturer('Energiemanagementsystem', manufacturer)
    
    def get_optimizer_manufacturers(self) -> List[str]:
        """Leistungsoptimierer Hersteller"""
        return self._get_manufacturers_by_category('Leistungsoptimierer')
    
    def get_optimizer_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Optimizer nach Hersteller"""
        return self._get_models_by_manufacturer('Leistungsoptimierer', manufacturer)
    
    def get_carport_manufacturers(self) -> List[str]:
        """Carport Hersteller"""
        return self._get_manufacturers_by_category('Carport')
    
    def get_carport_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Carport nach Hersteller"""
        return self._get_models_by_manufacturer('Carport', manufacturer)
    
    def get_emergency_power_manufacturers(self) -> List[str]:
        """Notstromversorgung Hersteller"""
        return self._get_manufacturers_by_category('Notstromversorgung')
    
    def get_emergency_power_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Notstromversorgung nach Hersteller"""
        return self._get_models_by_manufacturer('Notstromversorgung', manufacturer)
    
    def get_animal_protection_manufacturers(self) -> List[str]:
        """Tierabwehrschutz Hersteller"""
        return self._get_manufacturers_by_category('Tierabwehrschutz')
    
    def get_animal_protection_models_by_manufacturer(self, manufacturer: str) -> List[Dict]:
        """Tierabwehrschutz nach Hersteller"""
        return self._get_models_by_manufacturer('Tierabwehrschutz', manufacturer)
    
    def _get_manufacturers_by_category(self, category: str) -> List[str]:
        """Generische Funktion für Hersteller nach Kategorie"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            # products_complete zuerst
            try:
                cursor.execute("""
                    SELECT DISTINCT hersteller 
                    FROM products_complete 
                    WHERE kategorie = ? 
                    ORDER BY hersteller
                """, [category])
                manufacturers = [row[0] for row in cursor.fetchall()]
                if manufacturers:
                    return manufacturers
            except:
                pass
            
            # Fallback
            cursor.execute("""
                SELECT DISTINCT manufacturer 
                FROM products 
                WHERE category = ?
                ORDER BY manufacturer
            """, [category])
            return [row[0] for row in cursor.fetchall()]
        except:
            return []
        finally:
            conn.close()
    
    def _get_models_by_manufacturer(self, category: str, manufacturer: str) -> List[Dict]:
        """Generische Funktion für Modelle nach Hersteller und Kategorie"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            # products_complete
            try:
                cursor.execute("""
                    SELECT id, produkt_modell, preis_stück, beschreibung_info,
                           pv_modul_leistung, wr_leistung_kw, kapazitaet_speicher_kwh,
                           garantie_zeit, wirkungsgrad_prozent, spezial_merkmal
                    FROM products_complete 
                    WHERE kategorie = ? AND hersteller = ?
                    ORDER BY produkt_modell
                """, [category, manufacturer])
                
                results = []
                for row in cursor.fetchall():
                    results.append({
                        'id': row[0],
                        'model': row[1],
                        'price': row[2],
                        'description': row[3],
                        'capacity_w': row[4] if category == 'PV Modul' else 0,
                        'power_kw': row[5] if category == 'Wechselrichter' else 0,
                        'storage_kwh': row[6] if category == 'Batteriespeicher' else 0,
                        'warranty_years': row[7],
                        'efficiency': row[8],
                        'special_features': row[9],
                        'category': category,
                        'brand': manufacturer
                    })
                
                if results:
                    return results
            except:
                pass
            
            # Fallback
            cursor.execute("""
                SELECT id, model_name, price_euro, description, capacity_w, power_kw
                FROM products 
                WHERE manufacturer = ? AND category = ?
                ORDER BY model_name
            """, [manufacturer, category])
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    'id': row[0],
                    'model': row[1],
                    'price': row[2] or 0,
                    'description': row[3] or '',
                    'capacity_w': row[4] if category == 'PV Modul' else 0,
                    'power_kw': row[5] if category == 'Wechselrichter' else 0,
                    'category': category,
                    'brand': manufacturer
                })
            
            return results
            
        except Exception as e:
            print(f"Error loading models for {category}/{manufacturer}: {e}")
            return []
        finally:
            conn.close()
    
    def save_solar_configuration(self, config_data: Dict) -> bool:
        """Speichere Solar-Konfiguration für Berechnungen"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            # Erstelle solar_configurations Tabelle falls nicht vorhanden
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS solar_configurations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER,
                    module_qty INTEGER,
                    module_brand TEXT,
                    module_model TEXT,
                    module_product_id INTEGER,
                    inverter_brand TEXT,
                    inverter_model TEXT,
                    inverter_product_id INTEGER,
                    inverter_qty INTEGER DEFAULT 1,
                    with_storage BOOLEAN DEFAULT 0,
                    storage_brand TEXT,
                    storage_model TEXT,
                    storage_product_id INTEGER,
                    wallbox_enabled BOOLEAN DEFAULT 0,
                    wallbox_brand TEXT,
                    wallbox_model TEXT,
                    wallbox_product_id INTEGER,
                    ems_enabled BOOLEAN DEFAULT 0,
                    ems_brand TEXT,
                    ems_model TEXT,
                    ems_product_id INTEGER,
                    optimizer_enabled BOOLEAN DEFAULT 0,
                    optimizer_brand TEXT,
                    optimizer_model TEXT,
                    optimizer_product_id INTEGER,
                    carport_enabled BOOLEAN DEFAULT 0,
                    carport_brand TEXT,
                    carport_model TEXT,
                    carport_product_id INTEGER,
                    emergency_power_enabled BOOLEAN DEFAULT 0,
                    emergency_power_brand TEXT,
                    emergency_power_model TEXT,
                    emergency_power_product_id INTEGER,
                    animal_protection_enabled BOOLEAN DEFAULT 0,
                    animal_protection_brand TEXT,
                    animal_protection_model TEXT,
                    animal_protection_product_id INTEGER,
                    total_kwp REAL,
                    estimated_annual_yield_kwh REAL,
                    calculation_status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Konfiguration speichern
            cursor.execute("""
                INSERT INTO solar_configurations (
                    project_id, module_qty, module_brand, module_model, module_product_id,
                    inverter_brand, inverter_model, inverter_product_id, inverter_qty,
                    with_storage, storage_brand, storage_model, storage_product_id,
                    wallbox_enabled, wallbox_brand, wallbox_model, wallbox_product_id,
                    ems_enabled, ems_brand, ems_model, ems_product_id,
                    optimizer_enabled, optimizer_brand, optimizer_model, optimizer_product_id,
                    carport_enabled, carport_brand, carport_model, carport_product_id,
                    emergency_power_enabled, emergency_power_brand, emergency_power_model, emergency_power_product_id,
                    animal_protection_enabled, animal_protection_brand, animal_protection_model, animal_protection_product_id,
                    total_kwp, estimated_annual_yield_kwh
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                config_data.get('project_id', 1),
                config_data.get('module_qty', 0),
                config_data.get('module_brand', ''),
                config_data.get('module_model', ''),
                config_data.get('module_product_id', 0),
                config_data.get('inverter_brand', ''),
                config_data.get('inverter_model', ''),
                config_data.get('inverter_product_id', 0),
                config_data.get('inverter_qty', 1),
                config_data.get('with_storage', False),
                config_data.get('storage_brand', ''),
                config_data.get('storage_model', ''),
                config_data.get('storage_product_id', 0),
                config_data.get('wallbox_enabled', False),
                config_data.get('wallbox_brand', ''),
                config_data.get('wallbox_model', ''),
                config_data.get('wallbox_product_id', 0),
                config_data.get('ems_enabled', False),
                config_data.get('ems_brand', ''),
                config_data.get('ems_model', ''),
                config_data.get('ems_product_id', 0),
                config_data.get('optimizer_enabled', False),
                config_data.get('optimizer_brand', ''),
                config_data.get('optimizer_model', ''),
                config_data.get('optimizer_product_id', 0),
                config_data.get('carport_enabled', False),
                config_data.get('carport_brand', ''),
                config_data.get('carport_model', ''),
                config_data.get('carport_product_id', 0),
                config_data.get('emergency_power_enabled', False),
                config_data.get('emergency_power_brand', ''),
                config_data.get('emergency_power_model', ''),
                config_data.get('emergency_power_product_id', 0),
                config_data.get('animal_protection_enabled', False),
                config_data.get('animal_protection_brand', ''),
                config_data.get('animal_protection_model', ''),
                config_data.get('animal_protection_product_id', 0),
                config_data.get('total_kwp', 0.0),
                config_data.get('estimated_annual_yield_kwh', 0.0)
            ))
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error saving solar configuration: {e}")
            return False
        finally:
            conn.close()

# API Endpoints für React Integration
def create_product_api_file():
    """Erstellt API-File für React Bridge"""
    api_content = """
// Solar Calculator Product API Bridge
// Diese Datei wird von Python generiert und von React importiert

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const pythonScript = path.join(process.cwd(), 'solar_calculator_bridge.py');

export interface ProductModel {
  id: number;
  model: string;
  capacity_w?: number;
  power_kw?: number;
  storage_kwh?: number;
  price?: number;
  efficiency?: number;
  warranty_years?: number;
  category: string;
  brand: string;
}

export class SolarProductAPI {
  static async getPVManufacturers(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_pv_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Error loading PV manufacturers:', error);
      return [];
    }
  }

  static async getPVModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_pv_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Error loading PV models:', error);
      return [];
    }
  }

  static async getInverterManufacturers(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_inverter_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Error loading inverter manufacturers:', error);
      return [];
    }
  }

  static async getInverterModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_inverter_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Error loading inverter models:', error);
      return [];
    }
  }

  static async getStorageManufacturers(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_storage_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Error loading storage manufacturers:', error);
      return [];
    }
  }

  static async getStorageModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_storage_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (error) {
      console.error('Error loading storage models:', error);
      return [];
    }
  }
}
"""
    
    with open("apps/renderer/src/lib/solarProductAPI.ts", "w", encoding="utf-8") as f:
        f.write(api_content)

if __name__ == "__main__":
    import sys
    
    bridge = SolarCalculatorProductBridge()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "get_pv_manufacturers":
            print(json.dumps(bridge.get_pv_manufacturers()))
        elif command == "get_pv_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_pv_models_by_manufacturer(sys.argv[2])))
        elif command == "get_inverter_manufacturers":
            print(json.dumps(bridge.get_inverter_manufacturers()))
        elif command == "get_inverter_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_inverter_models_by_manufacturer(sys.argv[2])))
        elif command == "get_storage_manufacturers":
            print(json.dumps(bridge.get_storage_manufacturers()))
        elif command == "get_storage_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_storage_models_by_manufacturer(sys.argv[2])))
        elif command == "get_wallbox_manufacturers":
            print(json.dumps(bridge.get_wallbox_manufacturers()))
        elif command == "get_wallbox_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_wallbox_models_by_manufacturer(sys.argv[2])))
        elif command == "get_ems_manufacturers":
            print(json.dumps(bridge.get_ems_manufacturers()))
        elif command == "get_ems_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_ems_models_by_manufacturer(sys.argv[2])))
        elif command == "get_optimizer_manufacturers":
            print(json.dumps(bridge.get_optimizer_manufacturers()))
        elif command == "get_optimizer_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_optimizer_models_by_manufacturer(sys.argv[2])))
        elif command == "get_carport_manufacturers":
            print(json.dumps(bridge.get_carport_manufacturers()))
        elif command == "get_carport_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_carport_models_by_manufacturer(sys.argv[2])))
        elif command == "get_emergency_power_manufacturers":
            print(json.dumps(bridge.get_emergency_power_manufacturers()))
        elif command == "get_emergency_power_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_emergency_power_models_by_manufacturer(sys.argv[2])))
        elif command == "get_animal_protection_manufacturers":
            print(json.dumps(bridge.get_animal_protection_manufacturers()))
        elif command == "get_animal_protection_models" and len(sys.argv) > 2:
            print(json.dumps(bridge.get_animal_protection_models_by_manufacturer(sys.argv[2])))
        elif command == "save_config" and len(sys.argv) > 2:
            config_json = sys.argv[2]
            config_data = json.loads(config_json)
            success = bridge.save_solar_configuration(config_data)
            print(json.dumps({"success": success}))
        else:
            print(json.dumps({"error": "Unknown command"}))
    else:
        # Test aller Funktionen
        print("=== PV Manufacturers ===")
        print(bridge.get_pv_manufacturers())
        print("\n=== Inverter Manufacturers ===")
        print(bridge.get_inverter_manufacturers())
        print("\n=== Storage Manufacturers ===")
        print(bridge.get_storage_manufacturers())
        print("\n=== Additional Components ===")
        print(f"Wallbox: {bridge.get_wallbox_manufacturers()}")
        print(f"EMS: {bridge.get_ems_manufacturers()}")
        print(f"Optimizer: {bridge.get_optimizer_manufacturers()}")
        print(f"Carport: {bridge.get_carport_manufacturers()}")
        print(f"Emergency Power: {bridge.get_emergency_power_manufacturers()}")
        print(f"Animal Protection: {bridge.get_animal_protection_manufacturers()}")
        
        # Beispiel: Erste PV Hersteller Modelle
        pv_manufacturers = bridge.get_pv_manufacturers()
        if pv_manufacturers:
            print(f"\n=== Models for {pv_manufacturers[0]} ===")
            models = bridge.get_pv_models_by_manufacturer(pv_manufacturers[0])
            for model in models[:3]:  # Erste 3
                print(f"- {model['model']}: {model['capacity_w']}W, {model['price']}€")
