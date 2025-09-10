// apps/main/src/handlers/calculation.ts
// Python Calculation Bridge für Electron IPC

import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ProjectConfiguration {
  module_quantity: number;
  selected_module_id?: number;
  selected_inverter_id?: number;
  include_storage: boolean;
  selected_storage_id?: number;
  selected_storage_storage_power_kw?: number;
  annual_consumption_kwh?: number;
  roof_orientation?: string;
  roof_inclination_deg?: number;
  latitude?: number;
  longitude?: number;
  // Weitere Felder nach Bedarf
  [key: string]: any;
}

export interface CalculationResults {
  anlage_kwp: number;
  total_investment_netto: number;
  total_investment_brutto: number;
  annual_pv_production_kwh: number;
  annual_savings: number;
  payback_years: number;
  roi_percent: number;
  co2_savings_annual: number;
  einspeiseverguetung_annual: number;
  eigenverbrauch_percent: number;
  autarkie_grad: number;
  base_matrix_price_netto: number;
  monthly_production?: number[];
  yearly_cashflow?: number[];
  cost_breakdown?: any[];
  [key: string]: any;
}

export class CalculationHandler {
  private pythonScriptPath: string;

  constructor() {
    // Pfad zur Python CLI Bridge - angepasst für Electron App Struktur
    this.pythonScriptPath = path.join(__dirname, '../../../../calculations_cli.py');
    console.log('🐍 Python script path set to:', this.pythonScriptPath);
    this.registerHandlers();
  }

  private registerHandlers() {
    // Hauptberechnung Handler
    ipcMain.handle('perform-calculations', async (event, projectData: ProjectConfiguration) => {
      try {
        console.log('🔧 Performing calculations with data:', projectData);
        const results = await this.performCalculations(projectData);
        console.log('✅ Calculation results:', results);
        return results;
      } catch (error) {
        console.error('❌ Calculation error:', error);
        throw error;
      }
    });

    // Live-Preview Handler für schnelle Berechnungen
    ipcMain.handle('live-calculation-preview', async (event, config: Partial<ProjectConfiguration>) => {
      try {
        return await this.getLivePreview(config);
      } catch (error) {
        console.error('❌ Live preview error:', error);
        throw error;
      }
    });

    // Pricing Calculations Handler
    ipcMain.handle('calculate-live-pricing', async (event, data: {
      baseCost: number;
      discountPercent: number;
      surchargePercent: number;
      additionalCosts: number;
    }) => {
      try {
        return this.calculateLivePricing(data);
      } catch (error) {
        console.error('❌ Live pricing error:', error);
        throw error;
      }
    });
  }

  /**
   * Führt vollständige PV-Berechnung über Python calculations.py aus
   */
  async performCalculations(projectData: ProjectConfiguration): Promise<CalculationResults> {
    return new Promise((resolve, reject) => {
      // Python-Prozess starten
      const pythonProcess = spawn('python', [this.pythonScriptPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Input-Payload für Python erstellen
      const inputPayload = {
        project_data: this.convertToNativeFormat(projectData),
        texts: {},
        errors_list: [],
        simulation_duration_user: null,
        electricity_price_increase_user: null
      };

      let stdout = '';
      let stderr = '';

      // Daten sammeln
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Prozess beendet
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${stderr}`));
          return;
        }

        try {
          // JSON-Antwort parsen
          const results = JSON.parse(stdout);
          resolve(this.convertResultsToTypeScript(results));
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError}`));
        }
      });

      // Input an Python senden
      pythonProcess.stdin.write(JSON.stringify(inputPayload));
      pythonProcess.stdin.end();
    });
  }

  /**
   * Schnelle Live-Vorschau für UI-Updates
   */
  async getLivePreview(config: Partial<ProjectConfiguration>): Promise<Partial<CalculationResults>> {
    // Vereinfachte Berechnung für Live-Updates
    const moduleQuantity = config.module_quantity || 20;
    const moduleCapacity = 0.4; // Standard 400W Module
    const anlageKwp = (moduleQuantity * moduleCapacity);
    
    const estimatedAnnualProduction = anlageKwp * 1000; // Grobe Schätzung: 1000 kWh pro kWp
    const estimatedCost = anlageKwp * 1500; // Grobe Schätzung: 1500€ pro kWp

    return {
      anlage_kwp: anlageKwp,
      annual_pv_production_kwh: estimatedAnnualProduction,
      total_investment_netto: estimatedCost,
      total_investment_brutto: estimatedCost * 1.19
    };
  }

  /**
   * Live-Preisberechnung mit Rabatten/Aufschlägen
   */
  calculateLivePricing(data: {
    baseCost: number;
    discountPercent: number;
    surchargePercent: number;
    additionalCosts: number;
  }) {
    const { baseCost, discountPercent, surchargePercent, additionalCosts } = data;
    
    const discountAmount = baseCost * (discountPercent / 100);
    const priceAfterDiscount = baseCost - discountAmount;
    const surchargeAmount = priceAfterDiscount * (surchargePercent / 100);
    const finalPriceNetto = priceAfterDiscount + surchargeAmount + additionalCosts;
    const finalPriceBrutto = finalPriceNetto * 1.19;
    
    const priceChangePercent = ((finalPriceNetto - baseCost) / baseCost) * 100;

    return {
      base_cost: baseCost,
      discount_amount: discountAmount,
      surcharge_amount: surchargeAmount,
      additional_costs: additionalCosts,
      final_price_netto: finalPriceNetto,
      final_price_brutto: finalPriceBrutto,
      price_change_percent: priceChangePercent,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Konvertiert TypeScript ProjectConfiguration zu Python Format
   */
  private convertToNativeFormat(projectData: ProjectConfiguration): any {
    return {
      // Direkte Übertragung der wichtigsten Felder
      module_quantity: projectData.module_quantity,
      selected_module_id: projectData.selected_module_id,
      selected_inverter_id: projectData.selected_inverter_id,
      include_storage: projectData.include_storage,
      selected_storage_id: projectData.selected_storage_id,
      selected_storage_storage_power_kw: projectData.selected_storage_storage_power_kw || 5.0,
      annual_consumption_kwh: projectData.annual_consumption_kwh || 4000,
      roof_orientation: projectData.roof_orientation || 'Süd',
      roof_inclination_deg: projectData.roof_inclination_deg || 30,
      latitude: projectData.latitude || 50.0,
      longitude: projectData.longitude || 10.0,
      // Weitere Python-spezifische Felder
      anlage_type: 'Aufdach',
      feed_in_type: 'Volleinspeisung',
      electricity_price_kwh: 0.32,
      feed_in_tariff_kwh: 0.082
    };
  }

  /**
   * Konvertiert Python-Ergebnisse zu TypeScript Format
   */
  private convertResultsToTypeScript(pythonResults: any): CalculationResults {
    return {
      anlage_kwp: pythonResults.anlage_kwp || 0,
      total_investment_netto: pythonResults.total_investment_netto || 0,
      total_investment_brutto: pythonResults.total_investment_brutto || 0,
      annual_pv_production_kwh: pythonResults.annual_pv_production_kwh || 0,
      annual_savings: pythonResults.annual_financial_benefit_year1 || 0,
      payback_years: pythonResults.amortization_time_years || 0,
      roi_percent: pythonResults.simple_roi_percent || 0,
      co2_savings_annual: pythonResults.annual_co2_savings_kg || 0,
      einspeiseverguetung_annual: pythonResults.einspeiseverguetung_total_euro || 0,
      eigenverbrauch_percent: pythonResults.self_consumption_rate_percent || 0,
      autarkie_grad: pythonResults.self_supply_rate_percent || 0,
      base_matrix_price_netto: pythonResults.base_matrix_price_netto || 0,
      monthly_production: pythonResults.monthly_production || [],
      yearly_cashflow: pythonResults.yearly_cashflow || [],
      cost_breakdown: pythonResults.cost_breakdown || [],
      // Alle weiteren Felder übernehmen
      ...pythonResults
    };
  }
}

// Handler-Instanz erstellen und exportieren
export const calculationHandler = new CalculationHandler();
