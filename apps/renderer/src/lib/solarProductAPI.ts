// Auto-generated bridge to call Python solar_calculator_bridge.py from the renderer
// Uses child_process to execute Python commands and returns parsed JSON

// Only import child_process and util in Node.js/Electron environments
let execAsync: ((command: string) => Promise<{ stdout: string }>) | undefined;
let pythonScript: string;

if (
  typeof window !== 'undefined' &&
  (window as any).hasOwnProperty('require') &&
  typeof (window as any).require === 'function'
) {
  const path = (window as any).require('path');
  pythonScript = path.join(process.cwd(), 'solar_calculator_bridge.py');
  // Dynamically require child_process and util
  const child_process = (window as any).require('child_process');
  const util = (window as any).require('util');
  execAsync = util.promisify(child_process.exec);
} else if (typeof require !== 'undefined') {
  // Node.js context (non-Electron)
  const path = require('path');
  pythonScript = path.join(process.cwd(), 'solar_calculator_bridge.py');
  const child_process = require('child_process');
  const util = require('util');
  execAsync = util.promisify(child_process.exec);
} else {
  pythonScript = './solar_calculator_bridge.py'; // fallback for browser context
  execAsync = undefined;
}

// Standardisiertes Produktmodell (deutsche Keys)
export interface ProductModel {
  id: number;
  kategorie: string;
  produkt_modell: string;
  hersteller: string;
  preis_stück?: number;
  pv_modul_leistung?: number;
  kapazitaet_speicher_kwh?: number;
  wr_leistung_kw?: number;
  ladezyklen_speicher?: number;
  garantie_zeit?: number;
  mass_laenge?: number;
  mass_breite?: number;
  mass_gewicht_kg?: number;
  wirkungsgrad_prozent?: number;
  hersteller_land?: string;
  beschreibung_info?: string;
  eigenschaft_info?: string;
  spezial_merkmal?: string;
  rating_null_zehn?: number;
  image_base64?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export class SolarProductAPI {
  // PV
  static async getPVManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_pv_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getPVModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_pv_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getInverterManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_inverter_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getInverterModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_inverter_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getStorageManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_storage_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getStorageModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_storage_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getWallboxManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_wallbox_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getWallboxModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_wallbox_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getEMSManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_ems_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getEMSModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_ems_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getOptimizerManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_optimizer_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getOptimizerModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_optimizer_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getCarportManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_carport_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getCarportModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_carport_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getEmergencyPowerManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_emergency_power_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getEmergencyPowerModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_emergency_power_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getAnimalProtectionManufacturers(): Promise<string[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_animal_protection_manufacturers`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getAnimalProtectionModelsByManufacturer(manufacturer: string): Promise<ProductModel[]> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return [];
    }
    try {
      const { stdout } = await execAsync(`python "${pythonScript}" get_animal_protection_models "${manufacturer}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async saveConfiguration(config: Record<string, unknown>): Promise<{ success: boolean }> {
    if (!execAsync) {
      console.error('Python bridge not available in this environment.');
      return { success: false };
    }
    try {
      const payload = JSON.stringify(config).replaceAll('"', '\\"');
      const { stdout } = await execAsync(`python "${pythonScript}" save_config "${payload}"`);
      return JSON.parse(stdout.trim());
    } catch (e) {
      console.error('saveConfiguration error', e);
      return { success: false };
    }
  }
}

export default SolarProductAPI;
