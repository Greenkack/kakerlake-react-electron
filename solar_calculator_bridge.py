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
    
    def get_product_details(self, product_id: int, category: str) -> Optional[Dict]:
        """Detaillierte Produktinformationen"""
        conn = self.get_connection()
        try:
            cursor = conn.cursor()
            
            try:
                cursor.execute("""
                    SELECT * FROM products_complete WHERE id = ? AND kategorie = ?
                """, [product_id, category])
                
                result = cursor.fetchone()
                if result:
                    columns = [description[0] for description in cursor.description]
                    return dict(zip(columns, result))
            except:
                pass
            
            # Fallback
            cursor.execute("SELECT * FROM products WHERE id = ?", [product_id])
            result = cursor.fetchone()
            if result:
                columns = [description[0] for description in cursor.description]
                return dict(zip(columns, result))
            
            return None
            
        except Exception as e:
            print(f"Error loading product details: {e}")
            return None
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
        
        # Beispiel: Erste PV Hersteller Modelle
        pv_manufacturers = bridge.get_pv_manufacturers()
        if pv_manufacturers:
            print(f"\n=== Models for {pv_manufacturers[0]} ===")
            models = bridge.get_pv_models_by_manufacturer(pv_manufacturers[0])
            for model in models[:3]:  # Erste 3
                print(f"- {model['model']}: {model['capacity_w']}W, {model['price']}€")
