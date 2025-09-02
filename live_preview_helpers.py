"""
Live Preview Helper Functions - Hilfsfunktionen für die Live-Vorschau
====================================================================

Alle notwendigen Funktionen für die Live-Vorschau der Berechnungen
"""

import streamlit as st
from typing import Dict, Any, Optional
import math

def _get_pricing_modifications_from_session() -> Dict[str, Any]:
    """Holt Preismodifikationen aus der Session"""
    return st.session_state.get('pricing_modifications', {
        'discount_percent': 0.0,
        'surcharge_percent': 0.0,
        'special_discount': 0.0,
        'additional_costs': 0.0
    })

def _calculate_final_price_with_modifications(base_price: float, modifications: Dict[str, Any]) -> tuple:
    """Berechnet finalen Preis mit Modifikationen"""
    
    final_price = base_price
    
    # Prozentuale Rabatte/Aufschläge
    discount_percent = modifications.get('discount_percent', 0.0)
    surcharge_percent = modifications.get('surcharge_percent', 0.0)
    
    final_price = final_price * (1 - discount_percent/100) * (1 + surcharge_percent/100)
    
    # Absolute Beträge
    special_discount = modifications.get('special_discount', 0.0)
    additional_costs = modifications.get('additional_costs', 0.0)
    
    final_price = final_price - special_discount + additional_costs
    
    # Gesamte Rabatte und Aufpreise berechnen
    total_rebates = (base_price * discount_percent/100) + special_discount
    total_surcharges = (base_price * surcharge_percent/100) + additional_costs
    
    return max(0, final_price), total_rebates, total_surcharges

def _calculate_electricity_costs_projection(results: Dict[str, Any], years: int, price_increase: float) -> float:
    """Berechnet Stromkosten-Projektion ohne PV"""
    
    annual_consumption = results.get('annual_consumption_kwh', 3000.0)
    current_price_per_kwh = results.get('electricity_price_ct_per_kwh', 30.0) / 100.0
    
    total_costs = 0
    for year in range(years):
        yearly_price = current_price_per_kwh * ((1 + price_increase/100) ** year)
        total_costs += annual_consumption * yearly_price
    
    return total_costs

def _calculate_electricity_costs_with_pv_projection(results: Dict[str, Any], years: int, price_increase: float) -> float:
    """Berechnet Stromkosten-Projektion mit PV"""
    
    grid_consumption = results.get('grid_bezug_kwh', 0.0)
    current_price_per_kwh = results.get('electricity_price_ct_per_kwh', 30.0) / 100.0
    annual_feed_in_revenue = results.get('annual_feedin_revenue_euro', 0.0)
    
    total_costs = 0
    for year in range(years):
        yearly_price = current_price_per_kwh * ((1 + price_increase/100) ** year)
        yearly_costs = grid_consumption * yearly_price - annual_feed_in_revenue
        total_costs += max(0, yearly_costs)  # Nie negativ
    
    return total_costs

def _calculate_amortization_time(investment: float, annual_savings: float) -> float:
    """Berechnet Amortisationszeit"""
    
    if annual_savings <= 0:
        return 0.0
    
    return investment / annual_savings

def _format_german_number(value: float, unit: str = "", decimal_places: int = 2) -> str:
    """Formatiert Zahlen im deutschen Format: 1.234,56 €"""
    if value == 0:
        return f"0,00 {unit}".strip()
    
    if decimal_places == 0:
        formatted = f"{value:,.0f}".replace(',', '.')
    else:
        formatted = f"{value:,.{decimal_places}f}"
        formatted = formatted.replace(',', 'TEMP').replace('.', ',').replace('TEMP', '.')
    
    return f"{formatted} {unit}".strip()

def format_kpi_value(value: Any, unit: str = "", precision: int = 2, texts_dict: Optional[Dict[str, str]] = None) -> str:
    """Formatiert KPI-Werte"""
    if value is None:
        return "k.A."
    if isinstance(value, (float, int)) and (math.isnan(value) or math.isinf(value)):
        return "k.A."
    if isinstance(value, str):
        try:
            value = float(value.replace(",", "."))
        except (ValueError, AttributeError):
            return value
    
    if isinstance(value, (int, float)):
        if unit == "Jahre":
            return f"{value:.1f} Jahre"
        return _format_german_number(value, unit, precision)
    
    return str(value)

def _get_emoji(emoji: str) -> str:
    """Gibt Emoji zurück oder leeren String je nach Einstellung"""
    return emoji if st.session_state.get('show_emojis', True) else ""

def render_live_cost_preview(results_for_display: Dict[str, Any] = None):
    """Rendert die Live-Kostenvorschau in der Seitenleiste"""
    
    if results_for_display is None:
        results_for_display = st.session_state.get('calculation_results', {})
    
    st.sidebar.markdown("---")
    st.sidebar.subheader("Live-Fakten-Vorschau")
    
    if results_for_display:
        pricing_modifications_preview = _get_pricing_modifications_from_session()
        netto_betrag_preview = results_for_display.get('total_investment_netto', 0.0)
        
        if netto_betrag_preview > 0:
            final_price_preview, total_rebates_preview, total_surcharges_preview = _calculate_final_price_with_modifications(
                netto_betrag_preview, pricing_modifications_preview
            )
            
            # Erweiterte KPIs für Live-Vorschau
            annual_production_kwh = results_for_display.get('annual_pv_production_kwh', 0.0)
            battery_capacity_kwh = results_for_display.get('battery_capacity_kwh', 0.0)
            autarkie_grad = results_for_display.get('autarkie_grad', 0.0) * 100 if results_for_display.get('autarkie_grad', 0.0) <= 1 else results_for_display.get('autarkie_grad', 0.0)
            annual_feed_in_revenue = results_for_display.get('annual_feed_in_revenue_euro', 0.0)
            
            # Anlagengröße in kWp berechnen (Anzahl Module × Leistung pro Modul)
            module_quantity = results_for_display.get('module_quantity', 0)
            module_power_wp = results_for_display.get('module_power_wp', 0)
            if module_quantity > 0 and module_power_wp > 0:
                anlage_kwp = (module_quantity * module_power_wp) / 1000.0  # Wp zu kWp
            else:
                # Fallback: aus kWp direkt oder aus Jahresproduktion schätzen
                anlage_kwp = results_for_display.get('anlage_kwp', 0.0)
                if anlage_kwp == 0 and annual_production_kwh > 0:
                    anlage_kwp = annual_production_kwh / 1000.0  # Grobe Schätzung: 1000 kWh/kWp
            
            # Amortisationszeit berechnen
            annual_savings = results_for_display.get('annual_savings_total_euro', 0.0)
            if annual_savings <= 0:
                electricity_costs_without_pv = _calculate_electricity_costs_projection(results_for_display, 1, 0.0)
                electricity_costs_with_pv = _calculate_electricity_costs_with_pv_projection(results_for_display, 1, 0.0)
                annual_savings = electricity_costs_without_pv - electricity_costs_with_pv + annual_feed_in_revenue
            
            amortization_years = _calculate_amortization_time(final_price_preview, annual_savings)
            
            # Dynamische Stromkostenberechnung
            price_increase = st.session_state.get('sim_price_increase_user_input', 3.0)
            duration_years = st.session_state.get('sim_duration_user_input', 20)
            
            electricity_costs_without_pv_total = _calculate_electricity_costs_projection(results_for_display, int(duration_years), price_increase)
            electricity_costs_with_pv_total = _calculate_electricity_costs_with_pv_projection(results_for_display, int(duration_years), price_increase)
            
            # Live-Vorschau mit kleinerer, einheitlicher Schriftgröße
            st.sidebar.write(f" **Jährliche Stromproduktion:** {annual_production_kwh:,.0f} kWh".replace(',', '.'))
            st.sidebar.write(f" **Nettobetrag:** {netto_betrag_preview:,.2f}€".replace(',', '.'))
            st.sidebar.write(f" **Finaler Preis:** {final_price_preview:,.2f}€".replace(',', '.'))
            
            if total_surcharges_preview > 0:
                st.sidebar.write(f"{_get_emoji('')} **Summe Aufpreise:** +{_format_german_number(total_surcharges_preview, '€')}")
            if total_rebates_preview > 0:
                st.sidebar.write(f"{_get_emoji('🟢')} **Summe Nachlässe:** -{_format_german_number(total_rebates_preview, '€')}")
            
            if amortization_years > 0 and amortization_years < 100:
                st.sidebar.write(f"{_get_emoji('⏱')} **Amortisationszeit:** {_format_german_number(amortization_years, 'Jahre')}")
            else:
                st.sidebar.write(f"{_get_emoji('⏱')} **Amortisationszeit:** n/a")
            
            # Korrekte Werte aus Berechnungsergebnissen verwenden
            autarkie_grad_correct = results_for_display.get('self_supply_rate_percent', 0.0)
            annual_feed_in_revenue_correct = results_for_display.get('annual_feedin_revenue_euro', 0.0)
            
            st.sidebar.write(f"{_get_emoji('')} **Jährliche Einspeisevergütung:** {format_kpi_value(annual_feed_in_revenue_correct, '€')}")
            st.sidebar.write(f"{_get_emoji('')} **Autarkiegrad:** {format_kpi_value(autarkie_grad_correct, '%')}")
            
            # Batteriegröße aus Produktdatenbank holen - priorisiere selected_storage_storage_power_kw
            battery_capacity_kwh_correct = 0.0
            
            # Erste Priorität: selected_storage_storage_power_kw aus Berechnungsergebnissen
            battery_capacity_kwh_correct = results_for_display.get('selected_storage_storage_power_kw', 0.0)
            
            # Zweite Priorität: selected_storage_storage_power_kw aus project_data
            if battery_capacity_kwh_correct == 0:
                project_data = st.session_state.get('project_data', {})
                project_details = project_data.get('project_details', {})
                battery_capacity_kwh_correct = project_details.get('selected_storage_storage_power_kw', 0.0)
            
            # Dritte Priorität: battery_capacity_kwh als Fallback
            if battery_capacity_kwh_correct == 0:
                battery_capacity_kwh_correct = results_for_display.get('battery_capacity_kwh', 0.0)
            
            if battery_capacity_kwh_correct > 0:
                st.sidebar.write(f"{_get_emoji('')} **Batteriegröße:** {format_kpi_value(battery_capacity_kwh_correct, 'kWh')}")
            else:
                st.sidebar.write(f"{_get_emoji('')} **Batteriegröße:** Keine Batterie")
            
            st.sidebar.markdown("**Dynamische Stromkostenkalkulation:**")
            st.sidebar.write(f"{_get_emoji('')} **Simulationsdauer:** {format_kpi_value(duration_years, 'Jahre', 0)}")
            st.sidebar.write(f"{_get_emoji('')} **Strompreissteigerung:** {format_kpi_value(price_increase, '% p.a.')}")
            st.sidebar.write(f"{_get_emoji('')} **Stromkosten OHNE PV:** {format_kpi_value(electricity_costs_without_pv_total, '€', 0)}")
            st.sidebar.write(f"{_get_emoji('')} **Stromkosten MIT PV:** {format_kpi_value(electricity_costs_with_pv_total, '€', 0)}")
            st.sidebar.write(f"{_get_emoji('')} **Gesamtersparnis:** {format_kpi_value(electricity_costs_without_pv_total - electricity_costs_with_pv_total, '€', 0)}")
            
        else:
            st.sidebar.info("Keine Berechnungsdaten für Vorschau verfügbar")
    else:
        st.sidebar.info("Keine Berechnungsergebnisse verfügbar")
    
    st.sidebar.markdown("---")
