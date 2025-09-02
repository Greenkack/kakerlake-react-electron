"""
solar_calculator.py

Separater Menüpunkt für die Auswahl der Technik (Module, WR, Speicher, Zusatzkomponenten).
Verwendet die gleichen Keys in st.session_state.project_data['project_details'] wie data_input,
damit Analyse und PDF weiterhin funktionieren.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
import streamlit as st

# Fallback-freundliche Imports aus product_db
def _dummy_list_products(*args, **kwargs):
    return []

def _dummy_get_product_by_model_name(*args, **kwargs):
    return None

try:
    from product_db import list_products as list_products_safe, get_product_by_model_name as get_product_by_model_name_safe
except Exception:
    list_products_safe = _dummy_list_products  # type: ignore
    get_product_by_model_name_safe = _dummy_get_product_by_model_name  # type: ignore


def _get_text(texts: Dict[str, str], key: str, fallback: Optional[str] = None) -> str:
    if fallback is None:
        fallback = key.replace("_", " ").title()
    try:
        return str(texts.get(key, fallback))
    except Exception:
        return fallback


def _ensure_project_data_dicts():
    if 'project_data' not in st.session_state:
        st.session_state.project_data = {}
    pd = st.session_state.project_data
    if 'project_details' not in pd:
        pd['project_details'] = {}
    if 'customer_data' not in pd:
        pd['customer_data'] = {}
    if 'economic_data' not in pd:
        pd['economic_data'] = {}
    return pd


def _product_names_by_category(category: str, texts: Dict[str, str]) -> List[str]:
    try:
        products = list_products_safe(category=category)
        names = [p.get('model_name', f"ID:{p.get('id', 'N/A')}") for p in products]
        if not names:
            return [
                _get_text(texts, {
                    'Modul': 'no_modules_in_db',
                    'Wechselrichter': 'no_inverters_in_db',
                    'Batteriespeicher': 'no_storages_in_db',
                    'Wallbox': 'no_wallboxes_in_db',
                    'Energiemanagementsystem': 'no_ems_in_db',
                    'Leistungsoptimierer': 'no_optimizers_in_db',
                    'Carport': 'no_carports_in_db',
                    'Notstromversorgung': 'no_notstrom_in_db',
                    'Tierabwehrschutz': 'no_tierabwehr_in_db',
                }.get(category, 'no_products_in_db'), 'Keine Produkte in DB')
            ]
        return names
    except Exception:
        return []


def render_solar_calculator(texts: Dict[str, str], module_name: Optional[str] = None) -> None:
    """Rendert die Technik-Auswahl als eigenen Menüpunkt.

    - Schreibt Werte nach st.session_state.project_data['project_details']
    - Widget-Keys sind bewusst unterschiedlich zu data_input, um Kollisionen zu vermeiden
    """
    pd = _ensure_project_data_dicts()
    details: Dict[str, Any] = pd['project_details']

    please_select_text = _get_text(texts, 'please_select_option', '--- Bitte wählen ---')

    st.subheader(_get_text(texts, 'technology_selection_header', 'Auswahl der Technik'))

    # Produktlisten
    MODULES = _product_names_by_category('Modul', texts)
    INVERTERS = _product_names_by_category('Wechselrichter', texts)
    STORAGES = _product_names_by_category('Batteriespeicher', texts)

    # 1) Module
    col_qty, col_mod = st.columns([1, 2])
    with col_qty:
        details['module_quantity'] = st.number_input(
            _get_text(texts, 'module_quantity_label', 'Anzahl PV Module'),
            min_value=0,
            value=int(details.get('module_quantity', 20) or 20),
            key='module_quantity_sc_v1'
        )
    with col_mod:
        current_module = details.get('selected_module_name', please_select_text)
        module_options = [please_select_text] + MODULES
        try:
            idx_mod = module_options.index(current_module)
        except ValueError:
            idx_mod = 0
        selected_module = st.selectbox(
            _get_text(texts, 'module_model_label', 'PV Modul Modell'),
            options=module_options,
            index=idx_mod,
            key='selected_module_name_sc_v1'
        )
        details['selected_module_name'] = selected_module if selected_module != please_select_text else None
        if details.get('selected_module_name'):
            md = get_product_by_model_name_safe(details['selected_module_name'])
            if md:
                details['selected_module_id'] = md.get('id')
                details['selected_module_capacity_w'] = float(md.get('capacity_w', 0.0) or 0.0)
            else:
                details['selected_module_id'] = None
                details['selected_module_capacity_w'] = 0.0
        else:
            details['selected_module_id'] = None
            details['selected_module_capacity_w'] = 0.0

    if details.get('selected_module_capacity_w', 0.0) > 0:
        st.info(f"{_get_text(texts, 'module_capacity_label', 'Leistung pro Modul (Wp)')}: {details['selected_module_capacity_w']:.0f} Wp")

    # Anlagengröße berechnen (kWp)
    anlage_kwp = ((details.get('module_quantity', 0) or 0) * (details.get('selected_module_capacity_w', 0.0) or 0.0)) / 1000.0
    details['anlage_kwp'] = anlage_kwp
    st.info(f"{_get_text(texts, 'anlage_size_label', 'Anlagengröße (kWp)')}: {anlage_kwp:.2f} kWp")

    # 2) Wechselrichter
    col_inv_sel, col_inv_qty = st.columns([2, 1])
    with col_inv_sel:
        current_inv = details.get('selected_inverter_name', please_select_text)
        inv_options = [please_select_text] + INVERTERS
        try:
            idx_inv = inv_options.index(current_inv)
        except ValueError:
            idx_inv = 0
        selected_inv = st.selectbox(
            _get_text(texts, 'inverter_model_label', 'Wechselrichter Modell'),
            options=inv_options,
            index=idx_inv,
            key='selected_inverter_name_sc_v1'
        )
        details['selected_inverter_name'] = selected_inv if selected_inv != please_select_text else None
    with col_inv_qty:
        details['selected_inverter_quantity'] = int(st.number_input(
            _get_text(texts, 'inverter_quantity_label', 'Anzahl WR'),
            min_value=1,
            value=int(details.get('selected_inverter_quantity', 1) or 1),
            step=1,
            key='selected_inverter_quantity_sc_v1'
        ))

    # Lade WR-Details und berechne Gesamtleistung anhand der Anzahl
    base_inverter_power_kw = 0.0
    if details.get('selected_inverter_name'):
        invd = get_product_by_model_name_safe(details['selected_inverter_name'])
        if invd:
            details['selected_inverter_id'] = invd.get('id')
            base_inverter_power_kw = float(invd.get('power_kw', 0.0) or 0.0)
        else:
            details['selected_inverter_id'] = None
            base_inverter_power_kw = 0.0
    else:
        details['selected_inverter_id'] = None
        base_inverter_power_kw = 0.0

    # Speichere Single- und Gesamtleistung separat; bestehender Key hält nun die Gesamtleistung
    details['selected_inverter_power_kw_single'] = base_inverter_power_kw
    inv_qty = max(1, int(details.get('selected_inverter_quantity', 1) or 1))
    total_inverter_power_kw = base_inverter_power_kw * inv_qty
    details['selected_inverter_power_kw'] = total_inverter_power_kw

    # Schreibe Gesamtleistung zusätzlich auf Top-Level für Analysen (z. B. WR-Dimensionierung)
    try:
        st.session_state.project_data['inverter_power_kw'] = total_inverter_power_kw
    except Exception:
        pass

    if total_inverter_power_kw > 0:
        st.info(f"{_get_text(texts, 'inverter_power_label', 'Leistung WR (kW)')}: {total_inverter_power_kw:.2f} kW")
        if inv_qty > 1 and base_inverter_power_kw > 0:
            st.caption(f"{inv_qty} × {base_inverter_power_kw:.2f} kW je WR")

    # 3) Speicher (optional)
    details['include_storage'] = st.checkbox(
        _get_text(texts, 'include_storage_label', 'Batteriespeicher einplanen'),
        value=bool(details.get('include_storage', False)),
        key='include_storage_sc_v1'
    )

    if details['include_storage']:
        col_st_model, col_st_cap = st.columns(2)
        with col_st_model:
            current_storage = details.get('selected_storage_name', please_select_text)
            st_options = [please_select_text] + STORAGES
            try:
                idx_st = st_options.index(current_storage)
            except ValueError:
                idx_st = 0
            selected_storage = st.selectbox(
                _get_text(texts, 'storage_model_label', 'Speicher Modell'),
                options=st_options,
                index=idx_st,
                key='selected_storage_name_sc_v1'
            )
            details['selected_storage_name'] = selected_storage if selected_storage != please_select_text else None
        storage_capacity_from_model = 0.0
        if details.get('selected_storage_name'):
            std = get_product_by_model_name_safe(details['selected_storage_name'])
            if std:
                details['selected_storage_id'] = std.get('id')
                storage_capacity_from_model = float(std.get('storage_power_kw', 0.0) or 0.0)
                st.info(f"{_get_text(texts, 'storage_capacity_model_label', 'Kapazität Modell (kWh)')}: {storage_capacity_from_model:.2f} kWh")
            else:
                details['selected_storage_id'] = None
        else:
            details['selected_storage_id'] = None
        with col_st_cap:
            default_cap = float(details.get('selected_storage_storage_power_kw', 0.0) or 0.0)
            if default_cap == 0.0:
                default_cap = storage_capacity_from_model if storage_capacity_from_model > 0 else 5.0
            details['selected_storage_storage_power_kw'] = st.number_input(
                _get_text(texts, 'storage_capacity_manual_label', 'Gewünschte Gesamtkapazität (kWh)'),
                min_value=0.0,
                value=default_cap,
                step=0.1,
                key='selected_storage_storage_power_kw_sc_v1'
            )
    else:
        details['selected_storage_name'] = None
        details['selected_storage_id'] = None
        details['selected_storage_storage_power_kw'] = 0.0

    st.markdown("---")
    st.subheader(_get_text(texts, 'additional_components_header', 'Zusätzliche Komponenten'))

    # Zusatzkomponenten-Listen
    WALLBOXES = _product_names_by_category('Wallbox', texts)
    EMS = _product_names_by_category('Energiemanagementsystem', texts)
    OPTI = _product_names_by_category('Leistungsoptimierer', texts)
    CARPORT = _product_names_by_category('Carport', texts)
    NOTSTROM = _product_names_by_category('Notstromversorgung', texts)
    TIERABWEHR = _product_names_by_category('Tierabwehrschutz', texts)

    details['include_additional_components'] = st.checkbox(
        _get_text(texts, 'include_additional_components_label', 'Zusätzliche Komponenten einplanen'),
        value=bool(details.get('include_additional_components', False)),
        key='include_additional_components_sc_v1'
    )

    def _component_selector(label_key: str, options: List[str], name_key: str, id_key: str, widget_key: str):
        # Fallback-Labels für UI, falls in texts/de.json keine Keys vorhanden sind
        fallback_labels = {
            'wallbox_model_label': 'Wallbox | E-Ladestationen',
            'ems_model_label': 'Energiemanagementsysteme',
            'optimizer_model_label': 'Leistungsoptimierer',
            'carport_model_label': 'Solar CarPorts',
            'notstrom_model_label': 'Notstromversorgungen',
            'tierabwehr_model_label': 'Tierabwehrschutz',
        }
        current_val = details.get(name_key, please_select_text)
        opts = [please_select_text] + options
        try:
            idx = opts.index(current_val)
        except ValueError:
            idx = 0
        label_text = _get_text(texts, label_key, fallback_labels.get(label_key, label_key))
        sel = st.selectbox(label_text, options=opts, index=idx, key=widget_key)
        details[name_key] = sel if sel != please_select_text else None
        if details.get(name_key):
            comp = get_product_by_model_name_safe(details[name_key])
            details[id_key] = comp.get('id') if comp else None
        else:
            details[id_key] = None

    if details['include_additional_components']:
        _component_selector('wallbox_model_label', WALLBOXES, 'selected_wallbox_name', 'selected_wallbox_id', 'sel_wallbox_sc_v1')
        _component_selector('ems_model_label', EMS, 'selected_ems_name', 'selected_ems_id', 'sel_ems_sc_v1')
        _component_selector('optimizer_model_label', OPTI, 'selected_optimizer_name', 'selected_optimizer_id', 'sel_opti_sc_v1')
        _component_selector('carport_model_label', CARPORT, 'selected_carport_name', 'selected_carport_id', 'sel_cp_sc_v1')
        _component_selector('notstrom_model_label', NOTSTROM, 'selected_notstrom_name', 'selected_notstrom_id', 'sel_not_sc_v1')
        _component_selector('tierabwehr_model_label', TIERABWEHR, 'selected_tierabwehr_name', 'selected_tierabwehr_id', 'sel_ta_sc_v1')

    # Minimaler Abschluss-Hinweis
    st.success(_get_text(texts, 'tech_selection_saved_info', 'Technik-Auswahl übernommen. Sie können jetzt zur Analyse oder PDF wechseln.'))
