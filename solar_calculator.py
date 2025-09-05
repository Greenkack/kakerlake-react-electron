"""
solar_calculator.py

Separater Menüpunkt für die Auswahl der Technik (Module, WR, Speicher, Zusatzkomponenten).
Verwendet die gleichen Keys in st.session_state.project_data['project_details'] wie data_input,
damit Analyse und PDF weiterhin funktionieren.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime
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
    """Erweiterter Solar Calculator mit 2-Schritt Wizard.

    Schritt 1: Kerntechnik (Module, Wechselrichter, Speicher)
    Schritt 2: Zusatzkomponenten
    Abschluss: 'Berechnungen Starten' -> Navigation zurück (Standard: 'analysis')

    Wichtige Anforderungen (User Story):
    - Anzahl PV Module: freie Eingabe + separate + / - Buttons
    - Hersteller-/Modell-Filter für Module, Wechselrichter, Speicher
    - Automatische kWp Berechnung: qty * module_capacity_w / 1000
    - Automatische Anzeige WR-Leistung (W) und Speicher-Kapazität (kWh)
    - Optionaler Speicherbereich per Checkbox
    - Zusatzkomponenten als eigener Schritt mit optionaler Aktivierung
    - Freies Feld 'sonstiges'
    """
    pd = _ensure_project_data_dicts()
    details: Dict[str, Any] = pd['project_details']

    please_select_text = _get_text(texts, 'please_select_option', '--- Bitte wählen ---')

    # Wizard Step State
    if 'solar_calc_step' not in st.session_state:
        st.session_state['solar_calc_step'] = 1
    step = st.session_state['solar_calc_step']

    # Hilfsfunktionen
    def _products_by_category(category: str) -> List[Dict[str, Any]]:
        try:
            return list_products_safe(category=category)  # type: ignore
        except Exception:
            return []

    def _brands_from_products(products: List[Dict[str, Any]]) -> List[str]:
        brands = sorted({(p.get('brand') or '').strip() for p in products if p.get('brand')})
        return brands

    def _filter_models_by_brand(products: List[Dict[str, Any]], brand: Optional[str]) -> List[Dict[str, Any]]:
        if not brand:
            return products
        return [p for p in products if (p.get('brand') or '').strip().lower() == brand.strip().lower()]

    # Sichtbare Version / Build Tag zur Kontrolle, dass neue Datei wirklich geladen wurde
    VERSION_TAG = "SolarCalcWizard-2025-09-05-v1"
    st.caption(f"Solar Calculator – Schritt {step} / 2 | Build: {VERSION_TAG}")

    # Optionaler Debug-Block zur Fehlersuche falls Nutzer nur Minimal-UI sieht
    with st.expander("Debug (nur vorübergehend) ", expanded=False):
        st.write({
            'step': step,
            'module_qty_state': st.session_state.get('module_quantity_sc_v1'),
            'details_keys': sorted(list(details.keys())),
            'have_products_modul': len(list_products_safe(category='Modul')) if callable(list_products_safe) else 'n/a',
            'have_products_wr': len(list_products_safe(category='Wechselrichter')) if callable(list_products_safe) else 'n/a',
            'have_products_storage': len(list_products_safe(category='Batteriespeicher')) if callable(list_products_safe) else 'n/a',
        })
        st.info("Falls hier 0 Produkte angezeigt werden, fehlen Einträge in der Produktdatenbank (Kategorie: 'Modul', 'Wechselrichter', 'Batteriespeicher').")

    if step == 1:
        st.subheader(_get_text(texts, 'technology_selection_header', 'Auswahl der Technik'))

        # --- MODULE ---
        module_products = _products_by_category('Modul')
        module_brands = _brands_from_products(module_products)

        cols_mod_top = st.columns([1, 1, 2])
        with cols_mod_top[0]:
            # Anzahl Module mit + / - Buttons
            current_qty = int(details.get('module_quantity', 20) or 20)
            st.number_input(
                _get_text(texts, 'module_quantity_label', 'Anzahl PV Module'),
                min_value=0,
                value=current_qty,
                key='module_quantity_sc_v1'
            )
            # Buttons unterhalb
            col_btn_minus, col_btn_plus = st.columns(2)
            with col_btn_minus:
                if st.button('−', key='btn_module_qty_minus'):
                    try:
                        st.session_state['module_quantity_sc_v1'] = max(0, int(st.session_state.get('module_quantity_sc_v1', 0)) - 1)
                    except Exception:
                        st.session_state['module_quantity_sc_v1'] = 0
            with col_btn_plus:
                if st.button('+', key='btn_module_qty_plus'):
                    try:
                        st.session_state['module_quantity_sc_v1'] = int(st.session_state.get('module_quantity_sc_v1', 0)) + 1
                    except Exception:
                        st.session_state['module_quantity_sc_v1'] = 1
            details['module_quantity'] = int(st.session_state.get('module_quantity_sc_v1', 0))
        with cols_mod_top[1]:
            # Hersteller Auswahl
            current_brand = details.get('selected_module_brand') or please_select_text
            brand_options = [please_select_text] + module_brands
            try:
                idx_brand = brand_options.index(current_brand)
            except ValueError:
                idx_brand = 0
            selected_brand = st.selectbox(
                _get_text(texts, 'module_brand_label', 'PV Modul Hersteller'),
                options=brand_options,
                index=idx_brand,
                key='selected_module_brand_sc_v1'
            )
            details['selected_module_brand'] = selected_brand if selected_brand != please_select_text else None
        with cols_mod_top[2]:
            # Modelle je Hersteller
            filtered_mods = _filter_models_by_brand(module_products, details.get('selected_module_brand'))
            model_names = [p.get('model_name') for p in filtered_mods if p.get('model_name')]
            current_module = details.get('selected_module_name', please_select_text)
            module_options = [please_select_text] + model_names
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

        # Anlagengröße (kWp)
        anlage_kwp = ((details.get('module_quantity', 0) or 0) * (details.get('selected_module_capacity_w', 0.0) or 0.0)) / 1000.0
        details['anlage_kwp'] = anlage_kwp
        st.info(f"{_get_text(texts, 'anlage_size_label', 'Anlagengröße (kWp)')}: {anlage_kwp:.2f} kWp")

        # --- WECHSELRICHTER ---
        inverter_products = _products_by_category('Wechselrichter')
        inverter_brands = _brands_from_products(inverter_products)
        st.markdown('---')
        st.markdown('### Wechselrichter')
        cols_inv_top = st.columns([1, 2, 1])
        with cols_inv_top[0]:
            current_inv_brand = details.get('selected_inverter_brand') or please_select_text
            inv_brand_options = [please_select_text] + inverter_brands
            try:
                idx_inv_brand = inv_brand_options.index(current_inv_brand)
            except ValueError:
                idx_inv_brand = 0
            selected_inv_brand = st.selectbox(
                _get_text(texts, 'inverter_brand_label', 'Wechselrichter Hersteller'),
                options=inv_brand_options,
                index=idx_inv_brand,
                key='selected_inverter_brand_sc_v1'
            )
            details['selected_inverter_brand'] = selected_inv_brand if selected_inv_brand != please_select_text else None
        with cols_inv_top[1]:
            filtered_inv = _filter_models_by_brand(inverter_products, details.get('selected_inverter_brand'))
            inv_model_names = [p.get('model_name') for p in filtered_inv if p.get('model_name')]
            current_inv_model = details.get('selected_inverter_name', please_select_text)
            inv_model_options = [please_select_text] + inv_model_names
            try:
                idx_inv_model = inv_model_options.index(current_inv_model)
            except ValueError:
                idx_inv_model = 0
            selected_inv_model = st.selectbox(
                _get_text(texts, 'inverter_model_label', 'Wechselrichter Modell'),
                options=inv_model_options,
                index=idx_inv_model,
                key='selected_inverter_name_sc_v1'
            )
            details['selected_inverter_name'] = selected_inv_model if selected_inv_model != please_select_text else None
        with cols_inv_top[2]:
            details['selected_inverter_quantity'] = int(st.number_input(
                _get_text(texts, 'inverter_quantity_label', 'Anzahl WR'),
                min_value=1,
                value=int(details.get('selected_inverter_quantity', 1) or 1),
                step=1,
                key='selected_inverter_quantity_sc_v1'
            ))

        base_inverter_power_kw = 0.0
        if details.get('selected_inverter_name'):
            invd = get_product_by_model_name_safe(details['selected_inverter_name'])
            if invd:
                details['selected_inverter_id'] = invd.get('id')
                base_inverter_power_kw = float(invd.get('power_kw', 0.0) or 0.0)
            else:
                details['selected_inverter_id'] = None
        else:
            details['selected_inverter_id'] = None

        details['selected_inverter_power_kw_single'] = base_inverter_power_kw
        inv_qty = max(1, int(details.get('selected_inverter_quantity', 1) or 1))
        total_inverter_power_kw = base_inverter_power_kw * inv_qty
        details['selected_inverter_power_kw'] = total_inverter_power_kw
        details['selected_inverter_power_w_total'] = total_inverter_power_kw * 1000
        details['selected_inverter_power_w_single'] = base_inverter_power_kw * 1000

        try:
            st.session_state.project_data['inverter_power_kw'] = total_inverter_power_kw
        except Exception:
            pass

        if total_inverter_power_kw > 0:
            st.info(f"{_get_text(texts, 'inverter_power_label', 'Leistung WR gesamt')}: {details['selected_inverter_power_w_total']:.0f} W")
            if inv_qty > 1 and base_inverter_power_kw > 0:
                st.caption(f"{inv_qty} × {base_inverter_power_kw*1000:.0f} W je WR")

        # --- SPEICHER (optional) ---
        st.markdown('---')
        details['include_storage'] = st.checkbox(
            _get_text(texts, 'include_storage_label', 'Batteriespeicher einplanen'),
            value=bool(details.get('include_storage', False)),
            key='include_storage_sc_v1'
        )

        if details['include_storage']:
            storage_products = _products_by_category('Batteriespeicher')
            storage_brands = _brands_from_products(storage_products)
            cols_storage = st.columns([1, 2, 1])
            with cols_storage[0]:
                current_storage_brand = details.get('selected_storage_brand') or please_select_text
                storage_brand_options = [please_select_text] + storage_brands
                try:
                    idx_st_brand = storage_brand_options.index(current_storage_brand)
                except ValueError:
                    idx_st_brand = 0
                selected_st_brand = st.selectbox(
                    _get_text(texts, 'storage_brand_label', 'Speicher Hersteller'),
                    options=storage_brand_options,
                    index=idx_st_brand,
                    key='selected_storage_brand_sc_v1'
                )
                details['selected_storage_brand'] = selected_st_brand if selected_st_brand != please_select_text else None
            with cols_storage[1]:
                filtered_storage = _filter_models_by_brand(storage_products, details.get('selected_storage_brand'))
                storage_model_names = [p.get('model_name') for p in filtered_storage if p.get('model_name')]
                current_storage_model = details.get('selected_storage_name', please_select_text)
                storage_model_options = [please_select_text] + storage_model_names
                try:
                    idx_st_model = storage_model_options.index(current_storage_model)
                except ValueError:
                    idx_st_model = 0
                selected_storage = st.selectbox(
                    _get_text(texts, 'storage_model_label', 'Speicher Modell'),
                    options=storage_model_options,
                    index=idx_st_model,
                    key='selected_storage_name_sc_v1'
                )
                details['selected_storage_name'] = selected_storage if selected_storage != please_select_text else None
            with cols_storage[2]:
                # Wunschkapazität
                default_cap = float(details.get('selected_storage_storage_power_kw', 0.0) or 0.0)
                if details.get('selected_storage_name') and not default_cap:
                    std = get_product_by_model_name_safe(details['selected_storage_name'])
                    if std:
                        default_cap = float(std.get('storage_power_kw', 0.0) or 0.0)
                if default_cap == 0.0:
                    default_cap = 5.0
                details['selected_storage_storage_power_kw'] = st.number_input(
                    _get_text(texts, 'storage_capacity_manual_label', 'Gewünschte Gesamtkapazität (kWh)'),
                    min_value=0.0,
                    value=default_cap,
                    step=0.1,
                    key='selected_storage_storage_power_kw_sc_v1'
                )
            # Anzeige Modell Kapazität
            if details.get('selected_storage_name'):
                std = get_product_by_model_name_safe(details['selected_storage_name'])
                if std:
                    cap_model = float(std.get('storage_power_kw', 0.0) or 0.0)
                    st.info(f"{_get_text(texts, 'storage_capacity_model_label', 'Kapazität Modell (kWh)')}: {cap_model:.2f} kWh")
        else:
            details['selected_storage_name'] = None
            details['selected_storage_id'] = None
            details['selected_storage_storage_power_kw'] = 0.0

        # Navigation -> Schritt 2
        st.markdown('---')
        col_nav1, col_nav2 = st.columns([3,1])
        with col_nav2:
            if st.button(_get_text(texts, 'next_page_label', 'Nächste Seite'), key='btn_to_step2_sc_v1'):
                st.session_state['solar_calc_step'] = 2
                st.experimental_rerun()

    elif step == 2:
        st.subheader(_get_text(texts, 'additional_components_header', 'Zusätzliche Komponenten'))
        # Zusatzkomponenten Produkte
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

            # Freies Feld Sonstiges
            details['additional_other_custom'] = st.text_input(
                _get_text(texts, 'additional_other_label', 'Sonstiges (frei)') ,
                value=details.get('additional_other_custom', ''),
                max_chars=120,
                key='additional_other_custom_sc_v1'
            )

        st.markdown('---')
        col_back, col_spacer, col_finish = st.columns([1,3,1])
        with col_back:
            if st.button(_get_text(texts, 'back_label', 'Zurück'), key='btn_back_step1_sc_v1'):
                st.session_state['solar_calc_step'] = 1
                st.experimental_rerun()
        with col_finish:
            if st.button(_get_text(texts, 'start_calculations_label', 'Berechnungen Starten'), key='btn_finish_sc_v1'):
                # Navigation zurück in Analysebereich (Annahme: 'analysis')
                # Falls anderes Ziel erwünscht, Key hier ändern.
                st.success(_get_text(texts, 'tech_selection_saved_info', 'Technik-Auswahl übernommen.'))
                try:
                    st.session_state['selected_page_key'] = 'analysis'
                except Exception:
                    pass
                st.session_state['solar_calc_step'] = 1  # Reset für nächsten Aufruf
                st.experimental_rerun()

    # Abschluss Hinweis (nur Schritt 1 zeigt fortlaufend Info, Schritt 2 via Button)
    if step == 1:
        st.caption(_get_text(texts, 'tech_selection_saved_info', 'Änderungen werden automatisch gespeichert.'))
