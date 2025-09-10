// apps/main/src/ipc/CalculationHandlers.ts
// IPC handlers for Python calculation bridge

import { ipcMain } from 'electron';
import { PythonCalculationService, SolarConfiguration, CalculationResults } from '../services/PythonCalculationService';

export class CalculationHandlers {
  private calculationService: PythonCalculationService;

  constructor() {
    this.calculationService = new PythonCalculationService();
    this.registerHandlers();
  }

  private registerHandlers(): void {
    // Main calculation handler
    ipcMain.handle('calculation:perform-calculations', async (event, configuration: SolarConfiguration) => {
      try {
        console.log('🔄 Starting PV calculations...', {
          modules: configuration.selectedModules?.length || 0,
          inverters: configuration.selectedInverters?.length || 0,
          batteries: configuration.selectedBatteries?.length || 0,
          consumption: configuration.consumptionData?.annual_consumption_kwh || 0
        });

        const result = await this.calculationService.performCalculations(configuration);

        if (result.success) {
          console.log('✅ Calculations completed successfully', {
            anlage_kwp: result.results?.anlage_kwp,
            annual_production: result.results?.annual_pv_production_kwh,
            total_investment: result.results?.total_investment_netto
          });
        } else {
          console.error('❌ Calculation failed:', result.error);
        }

        return result;
      } catch (error) {
        console.error('💥 Calculation handler error:', error);
        return {
          success: false,
          error: `Handler error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    });

    // Live pricing handler
    ipcMain.handle('calculation:live-pricing', async (event, baseResults: CalculationResults, modifications: any) => {
      try {
        console.log('🔄 Updating live pricing...', {
          base_price: baseResults.total_investment_netto,
          discount: modifications.discount_percent || 0,
          surcharge: modifications.surcharge_percent || 0
        });

        const result = await this.calculationService.calculateLivePricing(baseResults, modifications);

        if (result.success) {
          console.log('✅ Live pricing updated successfully');
        } else {
          console.error('❌ Live pricing update failed:', result.error);
        }

        return result;
      } catch (error) {
        console.error('💥 Live pricing handler error:', error);
        return {
          success: false,
          error: `Handler error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    });

    // Validate configuration handler
    ipcMain.handle('calculation:validate-configuration', async (event, configuration: SolarConfiguration) => {
      try {
        const validation = this.validateConfiguration(configuration);
        console.log('🔍 Configuration validation:', validation);
        return { success: true, validation };
      } catch (error) {
        console.error('💥 Validation handler error:', error);
        return {
          success: false,
          error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    });

    // Quick calculation (simplified/faster version)
    ipcMain.handle('calculation:quick-estimate', async (event, basicParams: {
      modules_kwp: number;
      annual_consumption_kwh: number;
      location?: { lat: number; lng: number };
    }) => {
      try {
        console.log('⚡ Quick estimate calculation...', basicParams);

        // Simplified calculation for live preview
        const estimatedProduction = basicParams.modules_kwp * 1000; // Rough estimate
        const estimatedCost = basicParams.modules_kwp * 1200; // EUR per kWp rough estimate

        const quickResults = {
          success: true,
          results: {
            anlage_kwp: basicParams.modules_kwp,
            annual_pv_production_kwh: estimatedProduction,
            total_investment_netto: estimatedCost,
            estimated_savings_year1: (estimatedProduction * 0.3 * 0.32), // Rough savings estimate
            amortization_estimate_years: estimatedCost / (estimatedProduction * 0.3 * 0.32) || 0,
            is_quick_estimate: true
          }
        };

        console.log('⚡ Quick estimate completed:', quickResults.results);
        return quickResults;
      } catch (error) {
        console.error('💥 Quick estimate error:', error);
        return {
          success: false,
          error: `Quick estimate error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    });

    console.log('🚀 Calculation handlers registered successfully');
  }

  private validateConfiguration(configuration: SolarConfiguration): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!configuration.selectedModules || configuration.selectedModules.length === 0) {
      errors.push('Keine Module ausgewählt');
    }

    if (!configuration.selectedInverters || configuration.selectedInverters.length === 0) {
      errors.push('Keine Wechselrichter ausgewählt');
    }

    if (!configuration.consumptionData?.annual_consumption_kwh || configuration.consumptionData.annual_consumption_kwh <= 0) {
      errors.push('Jährlicher Stromverbrauch muss angegeben werden');
    }

    // Technical validation
    if (configuration.selectedModules && configuration.selectedInverters) {
      const totalModulePower = configuration.selectedModules.reduce((sum, module) => 
        sum + (module.power_wp * module.count), 0) / 1000; // Convert to kW

      const totalInverterPower = configuration.selectedInverters.reduce((sum, inverter) => 
        sum + (inverter.power_kw * inverter.count), 0);

      if (totalModulePower > totalInverterPower * 1.3) {
        warnings.push('Modulleistung deutlich höher als Wechselrichterleistung (>130%)');
      }

      if (totalInverterPower > totalModulePower * 1.2) {
        warnings.push('Wechselrichterleistung deutlich höher als Modulleistung (>120%)');
      }
    }

    // Location validation
    if (!configuration.locationData?.city && !configuration.locationData?.coordinates) {
      warnings.push('Standort nicht angegeben - PVGIS-Erträge können nicht berechnet werden');
    }

    // Storage validation
    if (configuration.selectedBatteries && configuration.selectedBatteries.length > 0) {
      const totalBatteryCapacity = configuration.selectedBatteries.reduce((sum, battery) => 
        sum + (battery.capacity_kwh * battery.count), 0);

      if (configuration.consumptionData?.annual_consumption_kwh) {
        const dailyConsumption = configuration.consumptionData.annual_consumption_kwh / 365;
        if (totalBatteryCapacity < dailyConsumption * 0.3) {
          warnings.push('Speicherkapazität sehr gering im Verhältnis zum Verbrauch (<30% Tagesverbrauch)');
        }
        if (totalBatteryCapacity > dailyConsumption * 2) {
          warnings.push('Speicherkapazität sehr hoch im Verhältnis zum Verbrauch (>200% Tagesverbrauch)');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
