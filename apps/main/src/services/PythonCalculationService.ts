// apps/main/src/services/PythonCalculationService.ts
// Bridge to Python calculation pipeline - mirrors calculations.py:perform_calculations

import { spawn, spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export interface SolarConfiguration {
  // Module Configuration
  selectedModules: {
    id: string;
    name: string;
    manufacturer: string;
    power_wp: number;
    price_netto: number;
    count: number;
  }[];

  // Wechselrichter Configuration  
  selectedInverters: {
    id: string;
    name: string;
    manufacturer: string;
    power_kw: number;
    price_netto: number;
    count: number;
  }[];

  // Speicher Configuration
  selectedBatteries: {
    id: string;
    name: string;
    manufacturer: string;
    capacity_kwh: number;
    price_netto: number;
    count: number;
  }[];

  // Additional Components
  additionalComponents: {
    id: string;
    name: string;
    category: string;
    price_netto: number;
    count: number;
  }[];

  // Location & Consumption Data
  locationData: {
    street?: string;
    city?: string;
    zipCode?: string;
    coordinates?: { lat: number; lng: number };
  };

  consumptionData: {
    annual_consumption_kwh: number;
    peak_consumption_kw?: number;
    consumption_profile?: 'residential' | 'business' | 'custom';
  };

  // Technical Parameters
  technicalParams: {
    roof_azimuth?: number;
    roof_inclination?: number;
    shading_factor?: number;
    installation_type?: 'roof' | 'ground' | 'facade';
  };
}

export interface CalculationResults {
  // Basic System Data
  anlage_kwp: number;
  annual_pv_production_kwh: number;
  module_count_total: number;
  
  // Financial Core Data
  base_matrix_price_netto: number;
  total_additional_costs_netto: number;
  subtotal_netto: number;
  total_investment_netto: number;
  total_investment_brutto: number;
  
  // Performance Metrics
  self_supply_rate_percent: number;
  autarky_rate_percent: number;
  specific_yield_kwh_per_kwp: number;
  
  // Economic Analysis
  annual_financial_benefit_year1: number;
  amortization_time_years: number;
  simple_roi_percent: number;
  npv_value: number;
  
  // Environmental Impact
  annual_co2_savings_kg: number;
  co2_savings_25_years_kg: number;
  
  // Advanced Analysis
  einspeiseverguetung_euro_per_kwh: number;
  stromkostenersparnis_year1: number;
  feed_in_revenue_year1: number;
  
  // Storage Analysis (if applicable)
  storage_capacity_kwh?: number;
  storage_efficiency_percent?: number;
  battery_cycles_per_year?: number;
  
  // Chart Data
  monthly_production_data: number[];
  monthly_consumption_data: number[];
  monthly_self_consumption_data: number[];
  cash_flow_25_years: number[];
  
  // Breakdown Details
  cost_breakdown: {
    modules_cost: number;
    inverters_cost: number;
    batteries_cost: number;
    additional_components_cost: number;
    installation_cost: number;
    planning_cost: number;
  };
  
  // Error Handling
  calculation_warnings?: string[];
  calculation_errors?: string[];
}

export class PythonCalculationService {
  private pythonExecutable: string;

  constructor() {
    this.pythonExecutable = this.detectPython();
  }

  private detectPython(): string {
    const candidates = [
      'python',
      'python3', 
      'py',
      'python.exe',
      'python3.exe'
    ];

    for (const candidate of candidates) {
      try {
        const result = spawnSync(candidate, ['--version'], { encoding: 'utf-8', timeout: 5000 });
        if (result.status === 0 && result.stdout.includes('Python')) {
          console.log(`Calculation Service: Using Python executable: ${candidate}`);
          return candidate;
        }
      } catch (error) {
        continue;
      }
    }

    console.warn('Calculation Service: No Python executable found, using "python" as fallback');
    return 'python';
  }

  // Main calculation method - mirrors calculations.py:perform_calculations
  async performCalculations(
    configuration: SolarConfiguration
  ): Promise<{ success: boolean; results?: CalculationResults; error?: string }> {
    try {
      // Prepare payload for Python CLI
      const payload = {
        command: 'perform_calculations',
        configuration: configuration,
        options: {
          include_charts: true,
          include_financial_analysis: true,
          include_environmental_analysis: true,
          pvgis_api_enabled: true,
        }
      };

      // Write payload to temp file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const payloadFile = path.join(tempDir, `calc_request_${Date.now()}.json`);
      fs.writeFileSync(payloadFile, JSON.stringify(payload, null, 2), 'utf-8');

      // Call Python CLI
      const pythonScript = path.join(process.cwd(), 'calculation_bridge.py');
      
      return new Promise((resolve) => {
        const pythonProcess = spawn(this.pythonExecutable, [pythonScript, payloadFile], {
          cwd: process.cwd(),
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
          // Cleanup temp file
          try {
            fs.unlinkSync(payloadFile);
          } catch (e) {
            console.warn('Could not clean up temp file:', payloadFile);
          }

          if (code === 0) {
            try {
              const result = JSON.parse(stdout);
              resolve({
                success: true,
                results: result.calculation_results,
                error: undefined
              });
            } catch (parseError) {
              resolve({
                success: false,
                error: `Failed to parse Python response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}\nStdout: ${stdout}\nStderr: ${stderr}`
              });
            }
          } else {
            resolve({
              success: false,
              error: `Python process exited with code ${code}\nStderr: ${stderr}\nStdout: ${stdout}`
            });
          }
        });

        pythonProcess.on('error', (error) => {
          resolve({
            success: false,
            error: `Failed to start Python process: ${error.message}`
          });
        });

        // Set timeout for calculations (longer than PDF generation)
        setTimeout(() => {
          pythonProcess.kill();
          resolve({
            success: false,
            error: 'Calculation timed out after 120 seconds'
          });
        }, 120000);
      });

    } catch (error) {
      return {
        success: false,
        error: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Live pricing calculations - mirrors analysis.py live pricing logic
  async calculateLivePricing(
    baseResults: CalculationResults,
    modifications: {
      discount_percent?: number;
      surcharge_percent?: number;
      additional_costs?: number;
      custom_prices?: { [key: string]: number };
    }
  ): Promise<{ success: boolean; results?: any; error?: string }> {
    try {
      const payload = {
        command: 'calculate_live_pricing',
        base_results: baseResults,
        modifications: modifications
      };

      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const payloadFile = path.join(tempDir, `pricing_request_${Date.now()}.json`);
      fs.writeFileSync(payloadFile, JSON.stringify(payload, null, 2), 'utf-8');

      const pythonScript = path.join(process.cwd(), 'calculation_bridge.py');
      
      return new Promise((resolve) => {
        const pythonProcess = spawn(this.pythonExecutable, [pythonScript, payloadFile], {
          cwd: process.cwd(),
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
          try {
            fs.unlinkSync(payloadFile);
          } catch (e) {
            console.warn('Could not clean up temp file:', payloadFile);
          }

          if (code === 0) {
            try {
              const result = JSON.parse(stdout);
              resolve({
                success: true,
                results: result.pricing_results,
                error: undefined
              });
            } catch (parseError) {
              resolve({
                success: false,
                error: `Failed to parse Python response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
              });
            }
          } else {
            resolve({
              success: false,
              error: `Python process exited with code ${code}\nStderr: ${stderr}`
            });
          }
        });

        pythonProcess.on('error', (error) => {
          resolve({
            success: false,
            error: `Failed to start Python process: ${error.message}`
          });
        });

        setTimeout(() => {
          pythonProcess.kill();
          resolve({
            success: false,
            error: 'Live pricing calculation timed out after 30 seconds'
          });
        }, 30000);
      });

    } catch (error) {
      return {
        success: false,
        error: `Live pricing error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
