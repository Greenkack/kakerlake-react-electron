// Auto-generated bridge to call Python solar_calculator_bridge.py from the renderer
// Uses child_process to execute Python commands and returns parsed JSON
// Only import child_process and util in Node.js/Electron environments
let execAsync;
let pythonScript;
if (typeof window !== 'undefined' &&
    window.hasOwnProperty('require') &&
    typeof window.require === 'function') {
    const path = window.require('path');
    pythonScript = path.join(process.cwd(), 'solar_calculator_bridge.py');
    // Dynamically require child_process and util
    const child_process = window.require('child_process');
    const util = window.require('util');
    execAsync = util.promisify(child_process.exec);
}
else if (typeof require !== 'undefined') {
    // Node.js context (non-Electron)
    const path = require('path');
    pythonScript = path.join(process.cwd(), 'solar_calculator_bridge.py');
    const child_process = require('child_process');
    const util = require('util');
    execAsync = util.promisify(child_process.exec);
}
else {
    pythonScript = './solar_calculator_bridge.py'; // fallback for browser context
    execAsync = undefined;
}
export class SolarProductAPI {
    // PV
    static async getPVManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_pv_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getPVModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_pv_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getInverterManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_inverter_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getInverterModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_inverter_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getStorageManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_storage_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getStorageModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_storage_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getWallboxManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_wallbox_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getWallboxModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_wallbox_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getEMSManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_ems_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getEMSModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_ems_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getOptimizerManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_optimizer_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getOptimizerModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_optimizer_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getCarportManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_carport_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getCarportModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_carport_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getEmergencyPowerManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_emergency_power_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getEmergencyPowerModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_emergency_power_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getAnimalProtectionManufacturers() {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_animal_protection_manufacturers`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async getAnimalProtectionModelsByManufacturer(manufacturer) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return [];
        }
        try {
            const { stdout } = await execAsync(`python "${pythonScript}" get_animal_protection_models "${manufacturer}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    static async saveConfiguration(config) {
        if (!execAsync) {
            console.error('Python bridge not available in this environment.');
            return { success: false };
        }
        try {
            const payload = JSON.stringify(config).replaceAll('"', '\\"');
            const { stdout } = await execAsync(`python "${pythonScript}" save_config "${payload}"`);
            return JSON.parse(stdout.trim());
        }
        catch (e) {
            console.error('saveConfiguration error', e);
            return { success: false };
        }
    }
}
export default SolarProductAPI;
