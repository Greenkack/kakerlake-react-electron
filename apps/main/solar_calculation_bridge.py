#!/usr/bin/env python3
"""
solar_calculation_bridge.py
Comprehensive bridge extracting logic from existing calculations.py and product_db.py
This script provides clean API endpoints without database stdout pollution.
"""

import sys
import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
import contextlib
from io import StringIO
import pandas as pd
import numpy as np
import math

# Add project root to Python path
project_root = Path(__file__).parent.parent.parent  # Go up from apps/main to root
sys.path.insert(0, str(project_root))

# ===== PRODUCT DATA LOGIC (extracted from product_db.py) =====

MOCK_PRODUCTS_DATA = {
    'Modul': {
        'Aiko Solar': [
            {'id': 1, 'model_name': 'A400-MAH54Mb', 'brand': 'Aiko Solar', 'category': 'Modul', 'capacity_w': 400, 'price_euro': 120.0, 'efficiency_percent': 22.1},
            {'id': 2, 'model_name': 'A405-MAH54Mb', 'brand': 'Aiko Solar', 'category': 'Modul', 'capacity_w': 405, 'price_euro': 122.5, 'efficiency_percent': 22.3},
            {'id': 3, 'model_name': 'A410-MAH54Mb', 'brand': 'Aiko Solar', 'category': 'Modul', 'capacity_w': 410, 'price_euro': 125.0, 'efficiency_percent': 22.5}
        ],
        'AikoSolarPV': [
            {'id': 4, 'model_name': 'A420-MAH54Mb', 'brand': 'AikoSolarPV', 'category': 'Modul', 'capacity_w': 420, 'price_euro': 127.5, 'efficiency_percent': 22.7}
        ],
        'SolarfabrikPV': [
            {'id': 5, 'model_name': 'SF-M430-HC', 'brand': 'SolarfabrikPV', 'category': 'Modul', 'capacity_w': 430, 'price_euro': 130.0, 'efficiency_percent': 22.9}
        ],
        'TrinaSolarPV': [
            {'id': 6, 'model_name': 'TSM-DE21M(II)-440W', 'brand': 'TrinaSolarPV', 'category': 'Modul', 'capacity_w': 440, 'price_euro': 132.5, 'efficiency_percent': 23.1},
            {'id': 7, 'model_name': 'TSM-DE21M(II)-445W', 'brand': 'TrinaSolarPV', 'category': 'Modul', 'capacity_w': 445, 'price_euro': 135.0, 'efficiency_percent': 23.3}
        ],
        'ViessmannPV': [
            {'id': 8, 'model_name': 'Vitovolt 300-DG M440HC', 'brand': 'ViessmannPV', 'category': 'Modul', 'capacity_w': 440, 'price_euro': 140.0, 'efficiency_percent': 22.8}
        ]
    },
    'Wechselrichter': {
        'SolarEdge': [
            {'id': 9, 'model_name': 'SE5K-RWS', 'brand': 'SolarEdge', 'category': 'Wechselrichter', 'power_kw': 5.0, 'price_euro': 850.0, 'efficiency_percent': 97.5},
            {'id': 10, 'model_name': 'SE6K-RWS', 'brand': 'SolarEdge', 'category': 'Wechselrichter', 'power_kw': 6.0, 'price_euro': 950.0, 'efficiency_percent': 97.6},
            {'id': 11, 'model_name': 'SE8K-RWS', 'brand': 'SolarEdge', 'category': 'Wechselrichter', 'power_kw': 8.0, 'price_euro': 1200.0, 'efficiency_percent': 97.8}
        ],
        'SMA': [
            {'id': 12, 'model_name': 'Sunny Boy 5.0', 'brand': 'SMA', 'category': 'Wechselrichter', 'power_kw': 5.0, 'price_euro': 800.0, 'efficiency_percent': 97.1},
            {'id': 13, 'model_name': 'Sunny Boy 6.0', 'brand': 'SMA', 'category': 'Wechselrichter', 'power_kw': 6.0, 'price_euro': 900.0, 'efficiency_percent': 97.2},
            {'id': 14, 'model_name': 'Sunny Tripower 8.0', 'brand': 'SMA', 'category': 'Wechselrichter', 'power_kw': 8.0, 'price_euro': 1150.0, 'efficiency_percent': 98.0}
        ],
        'Fronius': [
            {'id': 15, 'model_name': 'Symo 5.0-3-M', 'brand': 'Fronius', 'category': 'Wechselrichter', 'power_kw': 5.0, 'price_euro': 900.0, 'efficiency_percent': 97.3}
        ],
        'Huawei': [
            {'id': 16, 'model_name': 'SUN2000-5KTL-L1', 'brand': 'Huawei', 'category': 'Wechselrichter', 'power_kw': 5.0, 'price_euro': 750.0, 'efficiency_percent': 98.2}
        ]
    },
    'Batteriespeicher': {
        'Tesla': [
            {'id': 17, 'model_name': 'Powerwall 2', 'brand': 'Tesla', 'category': 'Batteriespeicher', 'capacity_w': 13500, 'price_euro': 8500.0, 'efficiency_percent': 90.0},
            {'id': 18, 'model_name': 'Powerwall 3', 'brand': 'Tesla', 'category': 'Batteriespeicher', 'capacity_w': 13500, 'price_euro': 9000.0, 'efficiency_percent': 92.0}
        ],
        'BYD': [
            {'id': 19, 'model_name': 'Battery-Box Premium HVS 10.2', 'brand': 'BYD', 'category': 'Batteriespeicher', 'capacity_w': 10200, 'price_euro': 7200.0, 'efficiency_percent': 95.0},
            {'id': 20, 'model_name': 'Battery-Box Premium HVS 12.8', 'brand': 'BYD', 'category': 'Batteriespeicher', 'capacity_w': 12800, 'price_euro': 8400.0, 'efficiency_percent': 95.0}
        ],
        'Huawei': [
            {'id': 21, 'model_name': 'LUNA2000-10-S0', 'brand': 'Huawei', 'category': 'Batteriespeicher', 'capacity_w': 10000, 'price_euro': 6800.0, 'efficiency_percent': 94.5}
        ]
    },
    'Wallbox': {
        'ABL': [
            {'id': 22, 'model_name': 'eMH1 11kW', 'brand': 'ABL', 'category': 'Wallbox', 'power_kw': 11.0, 'price_euro': 650.0},
            {'id': 23, 'model_name': 'eMH1 22kW', 'brand': 'ABL', 'category': 'Wallbox', 'power_kw': 22.0, 'price_euro': 850.0}
        ],
        'Wallbe': [
            {'id': 24, 'model_name': 'Eco 2.0s 11kW', 'brand': 'Wallbe', 'category': 'Wallbox', 'power_kw': 11.0, 'price_euro': 550.0}
        ]
    },
    'Energiemanagementsystem': {
        'SMA': [
            {'id': 25, 'model_name': 'Sunny Home Manager 2.0', 'brand': 'SMA', 'category': 'Energiemanagementsystem', 'price_euro': 380.0}
        ],
        'SolarEdge': [
            {'id': 26, 'model_name': 'SetApp Gateway', 'brand': 'SolarEdge', 'category': 'Energiemanagementsystem', 'price_euro': 420.0}
        ]
    },
    'Leistungsoptimierer': {
        'SolarEdge': [
            {'id': 27, 'model_name': 'P370-5RM4MRY', 'brand': 'SolarEdge', 'category': 'Leistungsoptimierer', 'price_euro': 45.0},
            {'id': 28, 'model_name': 'P405-5RM4MRY', 'brand': 'SolarEdge', 'category': 'Leistungsoptimierer', 'price_euro': 48.0}
        ],
        'Tigo': [
            {'id': 29, 'model_name': 'TS4-A-O', 'brand': 'Tigo', 'category': 'Leistungsoptimierer', 'price_euro': 42.0}
        ]
    },
    'Carport': {
        'Solarcarport GmbH': [
            {'id': 30, 'model_name': 'Solar Carport Standard', 'brand': 'Solarcarport GmbH', 'category': 'Carport', 'price_euro': 8500.0}
        ],
        'Solarterrassen & Carports': [
            {'id': 31, 'model_name': 'Premium Carport 5x3m', 'brand': 'Solarterrassen & Carports', 'category': 'Carport', 'price_euro': 12000.0}
        ]
    },
    'Notstromversorgung': {
        'Tesla': [
            {'id': 32, 'model_name': 'Backup Gateway 2', 'brand': 'Tesla', 'category': 'Notstromversorgung', 'price_euro': 1200.0}
        ],
        'SMA': [
            {'id': 33, 'model_name': 'Secure Power Supply', 'brand': 'SMA', 'category': 'Notstromversorgung', 'price_euro': 900.0}
        ]
    },
    'Tierabwehrschutz': {
        'SolarProtect': [
            {'id': 34, 'model_name': 'Taubenabwehr Standard', 'brand': 'SolarProtect', 'category': 'Tierabwehrschutz', 'price_euro': 15.0}
        ],
        'Photovoltaik4all': [
            {'id': 35, 'model_name': 'Marderschutz Premium', 'brand': 'Photovoltaik4all', 'category': 'Tierabwehrschutz', 'price_euro': 25.0}
        ]
    }
}

def get_manufacturers_by_category(category: str) -> List[str]:
    """Extract manufacturers for a given category"""
    return sorted(list(MOCK_PRODUCTS_DATA.get(category, {}).keys()))

def get_models_by_manufacturer(category: str, manufacturer: str) -> List[Dict[str, Any]]:
    """Get models for a manufacturer in a category"""
    return MOCK_PRODUCTS_DATA.get(category, {}).get(manufacturer, [])

# ===== CALCULATION LOGIC (extracted from calculations.py) =====

def calculate_system_capacity_kwp(modules: List[Dict[str, Any]]) -> float:
    """Calculate total system capacity in kWp"""
    total_capacity_wp = 0
    for module in modules:
        capacity_wp = module.get('capacity_w', 0) or module.get('power_wp', 0)
        count = module.get('count', 1)
        total_capacity_wp += capacity_wp * count
    return total_capacity_wp / 1000.0  # Convert to kWp

def calculate_annual_yield_kwh(system_capacity_kwp: float, specific_yield: float = 950.0) -> float:
    """Calculate annual energy yield in kWh"""
    return system_capacity_kwp * specific_yield

def calculate_self_consumption_rate(
    annual_production_kwh: float,
    annual_consumption_kwh: float,
    storage_capacity_kwh: float = 0
) -> float:
    """Calculate self-consumption rate percentage"""
    if annual_production_kwh <= 0:
        return 0.0
    
    # Base self-consumption without storage (typically 25-35%)
    base_rate = 0.30
    
    # With storage, improve self-consumption
    if storage_capacity_kwh > 0:
        # Storage factor: larger storage relative to consumption = higher rate
        storage_factor = min(storage_capacity_kwh / (annual_consumption_kwh / 365), 1.0)
        base_rate = min(base_rate + (storage_factor * 0.40), 0.85)  # Max 85%
    
    # Don't exceed what's actually possible given production vs consumption
    max_possible = min(annual_production_kwh / annual_consumption_kwh, 1.0)
    return min(base_rate, max_possible) * 100

def calculate_autarky_rate(
    annual_production_kwh: float,
    annual_consumption_kwh: float,
    self_consumption_rate: float,
    storage_capacity_kwh: float = 0
) -> float:
    """Calculate autarky rate (energy independence) percentage"""
    if annual_consumption_kwh <= 0:
        return 0.0
    
    # Self-consumed energy
    self_consumed_kwh = annual_production_kwh * (self_consumption_rate / 100)
    
    # Autarky rate is how much of consumption is covered by PV
    autarky_rate = (self_consumed_kwh / annual_consumption_kwh) * 100
    
    return min(autarky_rate, 100.0)

def calculate_feed_in_revenue(
    annual_production_kwh: float,
    self_consumption_rate: float,
    feed_in_tariff_eur_per_kwh: float = 0.0792
) -> float:
    """Calculate annual feed-in revenue"""
    grid_feed_kwh = annual_production_kwh * (1 - self_consumption_rate / 100)
    return grid_feed_kwh * feed_in_tariff_eur_per_kwh

def calculate_electricity_cost_savings(
    annual_production_kwh: float,
    self_consumption_rate: float,
    electricity_price_eur_per_kwh: float = 0.35
) -> float:
    """Calculate annual electricity cost savings"""
    self_consumed_kwh = annual_production_kwh * (self_consumption_rate / 100)
    return self_consumed_kwh * electricity_price_eur_per_kwh

def calculate_system_costs(
    modules: List[Dict[str, Any]],
    inverters: List[Dict[str, Any]],
    batteries: List[Dict[str, Any]],
    additional_components: List[Dict[str, Any]],
    installation_factor: float = 1.5
) -> Dict[str, float]:
    """Calculate total system costs breakdown"""
    
    # Module costs
    modules_cost = sum(
        (item.get('price_euro', 0) or item.get('price_netto', 0)) * item.get('count', 1)
        for item in modules
    )
    
    # Inverter costs
    inverters_cost = sum(
        (item.get('price_euro', 0) or item.get('price_netto', 0)) * item.get('count', 1)
        for item in inverters
    )
    
    # Battery costs
    batteries_cost = sum(
        (item.get('price_euro', 0) or item.get('price_netto', 0)) * item.get('count', 1)
        for item in batteries
    )
    
    # Additional components
    additional_cost = sum(
        (item.get('price_euro', 0) or item.get('price_netto', 0)) * item.get('count', 1)
        for item in additional_components
    )
    
    # Calculate installation cost based on component costs
    component_total = modules_cost + inverters_cost + batteries_cost
    installation_cost = component_total * (installation_factor - 1.0)
    
    return {
        'modules_cost': modules_cost,
        'inverters_cost': inverters_cost,
        'batteries_cost': batteries_cost,
        'additional_components_cost': additional_cost,
        'installation_cost': installation_cost,
        'total_netto': modules_cost + inverters_cost + batteries_cost + additional_cost + installation_cost
    }

def calculate_payback_period_simple(
    total_investment: float,
    annual_savings: float
) -> float:
    """Calculate simple payback period in years"""
    if annual_savings <= 0:
        return 999.0  # No payback
    return total_investment / annual_savings

def calculate_roi_simple(
    total_investment: float,
    annual_benefit: float,
    years: int = 20
) -> float:
    """Calculate simple ROI percentage"""
    if total_investment <= 0:
        return 0.0
    total_benefit = annual_benefit * years
    return ((total_benefit - total_investment) / total_investment) * 100

def calculate_co2_savings_annual(annual_production_kwh: float, co2_factor: float = 0.474) -> float:
    """Calculate annual CO2 savings in kg"""
    return annual_production_kwh * co2_factor

# ===== MAIN CALCULATION FUNCTION =====

def perform_full_calculations(configuration: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main calculation function that mirrors calculations.py:perform_calculations
    but adapted for the React/TypeScript interface
    """
    
    try:
        # Extract configuration data
        selected_modules = configuration.get('selectedModules', [])
        selected_inverters = configuration.get('selectedInverters', [])
        selected_batteries = configuration.get('selectedBatteries', [])
        additional_components = configuration.get('additionalComponents', [])
        consumption_data = configuration.get('consumptionData', {})
        technical_params = configuration.get('technicalParams', {})
        
        # Basic system metrics
        system_capacity_kwp = calculate_system_capacity_kwp(selected_modules)
        module_count_total = sum(module.get('count', 1) for module in selected_modules)
        
        # Energy calculations
        specific_yield = technical_params.get('specific_yield_kwh_per_kwp', 950.0)
        annual_pv_production_kwh = calculate_annual_yield_kwh(system_capacity_kwp, specific_yield)
        
        annual_consumption_kwh = consumption_data.get('annual_consumption_kwh', 4000.0)
        
        # Storage capacity
        storage_capacity_kwh = sum(
            (battery.get('capacity_kwh', 0) or battery.get('capacity_w', 0) / 1000) * battery.get('count', 1)
            for battery in selected_batteries
        )
        
        # Performance calculations
        self_consumption_rate = calculate_self_consumption_rate(
            annual_pv_production_kwh, annual_consumption_kwh, storage_capacity_kwh
        )
        
        autarky_rate = calculate_autarky_rate(
            annual_pv_production_kwh, annual_consumption_kwh, self_consumption_rate, storage_capacity_kwh
        )
        
        # Financial calculations
        cost_breakdown = calculate_system_costs(
            selected_modules, selected_inverters, selected_batteries, additional_components
        )
        
        # Revenue and savings
        electricity_price = 0.35  # €/kWh
        feed_in_tariff = 0.0792   # €/kWh
        
        annual_electricity_savings = calculate_electricity_cost_savings(
            annual_pv_production_kwh, self_consumption_rate, electricity_price
        )
        
        annual_feed_in_revenue = calculate_feed_in_revenue(
            annual_pv_production_kwh, self_consumption_rate, feed_in_tariff
        )
        
        annual_total_benefit = annual_electricity_savings + annual_feed_in_revenue
        
        # Economic analysis
        payback_period = calculate_payback_period_simple(cost_breakdown['total_netto'], annual_total_benefit)
        roi_20_years = calculate_roi_simple(cost_breakdown['total_netto'], annual_total_benefit, 20)
        
        # Environmental impact
        co2_savings_annual = calculate_co2_savings_annual(annual_pv_production_kwh)
        co2_savings_25_years = co2_savings_annual * 25
        
        # Generate monthly data (simplified)
        monthly_production = [annual_pv_production_kwh / 12] * 12  # Simplified
        monthly_consumption = [annual_consumption_kwh / 12] * 12
        monthly_self_consumption = [
            prod * (self_consumption_rate / 100) for prod in monthly_production
        ]
        
        # Cash flow projection (simplified)
        cash_flow_25_years = []
        for year in range(25):
            if year == 0:
                cash_flow_25_years.append(-cost_breakdown['total_netto'])
            else:
                # Account for electricity price increase
                escalated_benefit = annual_total_benefit * (1.03 ** year)  # 3% annual increase
                cash_flow_25_years.append(escalated_benefit)
        
        # NPV calculation (simplified)
        discount_rate = 0.05  # 5%
        npv = sum(
            cf / ((1 + discount_rate) ** year) for year, cf in enumerate(cash_flow_25_years)
        )
        
        return {
            'success': True,
            'calculation_results': {
                # Basic System Data
                'anlage_kwp': round(system_capacity_kwp, 2),
                'annual_pv_production_kwh': round(annual_pv_production_kwh, 0),
                'module_count_total': module_count_total,
                
                # Financial Core Data
                'base_matrix_price_netto': cost_breakdown['modules_cost'],
                'total_additional_costs_netto': cost_breakdown['additional_components_cost'],
                'subtotal_netto': cost_breakdown['total_netto'],
                'total_investment_netto': cost_breakdown['total_netto'],
                'total_investment_brutto': cost_breakdown['total_netto'] * 1.19,  # 19% VAT
                
                # Performance Metrics
                'self_supply_rate_percent': round(self_consumption_rate, 1),
                'autarky_rate_percent': round(autarky_rate, 1),
                'specific_yield_kwh_per_kwp': specific_yield,
                
                # Economic Analysis
                'annual_financial_benefit_year1': round(annual_total_benefit, 0),
                'amortization_time_years': round(payback_period, 1),
                'simple_roi_percent': round(roi_20_years, 1),
                'npv_value': round(npv, 0),
                
                # Environmental Impact
                'annual_co2_savings_kg': round(co2_savings_annual, 0),
                'co2_savings_25_years_kg': round(co2_savings_25_years, 0),
                
                # Advanced Analysis
                'einspeiseverguetung_euro_per_kwh': feed_in_tariff,
                'stromkostenersparnis_year1': round(annual_electricity_savings, 0),
                'feed_in_revenue_year1': round(annual_feed_in_revenue, 0),
                
                # Storage Analysis
                'storage_capacity_kwh': storage_capacity_kwh,
                'storage_efficiency_percent': 90.0,
                'battery_cycles_per_year': 250,
                
                # Chart Data
                'monthly_production_data': [round(x, 0) for x in monthly_production],
                'monthly_consumption_data': [round(x, 0) for x in monthly_consumption],
                'monthly_self_consumption_data': [round(x, 0) for x in monthly_self_consumption],
                'cash_flow_25_years': [round(x, 0) for x in cash_flow_25_years],
                
                # Cost Breakdown
                'cost_breakdown': {
                    'modules_cost': round(cost_breakdown['modules_cost'], 2),
                    'inverters_cost': round(cost_breakdown['inverters_cost'], 2),
                    'batteries_cost': round(cost_breakdown['batteries_cost'], 2),
                    'additional_components_cost': round(cost_breakdown['additional_components_cost'], 2),
                    'installation_cost': round(cost_breakdown['installation_cost'], 2),
                }
            }
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': f'Calculation error: {str(e)}',
            'calculation_results': None
        }

# ===== CLI INTERFACE =====

def main():
    """Main CLI interface"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({'error': 'No command provided'}))
            return
            
        command = sys.argv[1]
        
        # Product API commands
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
            
        # Calculation commands
        elif command == 'perform_calculations':
            if len(sys.argv) >= 3:
                # Load configuration from file
                config_file = sys.argv[2]
                with open(config_file, 'r', encoding='utf-8') as f:
                    config_data = json.load(f)
                result = perform_full_calculations(config_data.get('configuration', {}))
            else:
                result = {'error': 'Configuration file path required for calculations'}
                
        else:
            result = {'error': f'Unknown command: {command}'}
        
        # Output clean JSON
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        error_result = {'error': f'Bridge error: {str(e)}'}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
