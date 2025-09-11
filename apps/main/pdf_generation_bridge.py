#!/usr/bin/env python3
"""
pdf_generation_bridge.py
Comprehensive PDF generation bridge extracting logic from all PDF-related Python files.
Supports 3 PDF systems:
1. PV PDFs: nt_nt_01.pdf to nt_nt_07.pdf with coords/seite1-7.yml
2. Heat Pump PDFs: hp_nt_01.pdf to hp_nt_16.pdf with coords_wp/wp_seite1-7.yml  
3. Multi-PDF: Batch generation for multiple companies
"""

import sys
import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any, Union, Tuple
import io
import base64
import tempfile
import zipfile
from datetime import datetime
import math
import re
import yaml

# Add project root to Python path
project_root = Path(__file__).parent.parent.parent  # Go up from apps/main to root
sys.path.insert(0, str(project_root))

# ===== PDF GENERATION IMPORTS AND SETUP =====
try:
    from reportlab.lib.colors import HexColor, Color
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import cm, mm
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfgen import canvas
    from reportlab.platypus import (Frame, Image, PageBreak, PageTemplate,
        Paragraph, SimpleDocTemplate, Spacer, Table,
        TableStyle, Flowable, KeepInFrame, KeepTogether)
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

try:
    from pypdf import PdfReader, PdfWriter, Transformation
    try:
        from pypdf import PageObject
    except ImportError:
        PageObject = None
    PYPDF_AVAILABLE = True
except ImportError:
    try:
        from PyPDF2 import PdfReader, PdfWriter
        PageObject = None
        PYPDF_AVAILABLE = True
    except ImportError:
        PYPDF_AVAILABLE = False

# ===== TEMPLATE PATHS AND CONFIGURATIONS =====

class PDFSystemConfig:
    """Configuration for the three PDF systems"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        
        # PV System
        self.pv_templates_dir = project_root / "pdf_templates_static" / "notext"
        self.pv_coords_dir = project_root / "coords"
        self.pv_template_files = [f"nt_nt_{i:02d}.pdf" for i in range(1, 8)]  # 01-07
        self.pv_coord_files = [f"seite{i}.yml" for i in range(1, 8)]  # seite1-seite7
        
        # Heat Pump System 
        self.hp_templates_dir = project_root / "pdf_templates_static" / "notext"
        self.hp_coords_dir = project_root / "coords_wp"
        self.hp_template_files = [f"hp_nt_{i:02d}.pdf" for i in range(1, 17)]  # 01-16
        self.hp_coord_files = [f"wp_seite{i}.yml" for i in range(1, 8)]  # wp_seite1-wp_seite7
        
        # Output directory
        self.output_dir = project_root / "data" / "pdf_output"
        self.output_dir.mkdir(parents=True, exist_ok=True)

config = PDFSystemConfig(project_root)

# ===== COORDINATE PARSING (extracted from coords/*.yml logic) =====

def parse_coordinates_yml(yml_path: Path) -> List[Dict[str, Any]]:
    """Parse coordinate YML files to extract text positions and formatting"""
    if not yml_path.exists():
        return []
    
    try:
        with yml_path.open('r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse the custom format used in coords files
        elements = []
        sections = content.split('----------------------------------------')
        
        for section in sections:
            section = section.strip()
            if not section:
                continue
                
            lines = section.split('\n')
            element = {}
            
            for line in lines:
                line = line.strip()
                if line.startswith('Text:'):
                    element['text'] = line.replace('Text:', '').strip()
                elif line.startswith('Position:'):
                    # Parse position tuple (x1, y1, x2, y2)
                    pos_str = line.replace('Position:', '').strip()
                    pos_match = re.search(r'\(([^)]+)\)', pos_str)
                    if pos_match:
                        coords = [float(x.strip()) for x in pos_match.group(1).split(',')]
                        if len(coords) == 4:
                            element['position'] = coords
                elif line.startswith('Schriftart:'):
                    element['font'] = line.replace('Schriftart:', '').strip()
                elif line.startswith('Schriftgröße:'):
                    size_str = line.replace('Schriftgröße:', '').strip()
                    try:
                        element['font_size'] = float(size_str)
                    except ValueError:
                        element['font_size'] = 10.0
                elif line.startswith('Farbe:'):
                    color_str = line.replace('Farbe:', '').strip()
                    try:
                        element['color'] = int(color_str)
                    except ValueError:
                        element['color'] = 0  # Black
            
            if 'text' in element and 'position' in element:
                elements.append(element)
        
        return elements
        
    except Exception as e:
        print(f"Error parsing YML file {yml_path}: {e}")
        return []

# ===== PLACEHOLDER MAPPING (extracted from placeholders.py) =====

PLACEHOLDER_MAPPING = {
    # Customer Data
    "{{customer_name}}": "customer_name",
    "{{customer_street}}": "customer_street", 
    "{{customer_city}}": "customer_city",
    "{{customer_zip}}": "customer_zip",
    "{{customer_email}}": "customer_email",
    "{{customer_phone}}": "customer_phone",
    
    # Company Data
    "{{company_name}}": "company_name",
    "{{company_street}}": "company_street",
    "{{company_city}}": "company_city", 
    "{{company_zip}}": "company_zip",
    "{{company_phone}}": "company_phone",
    "{{company_email}}": "company_email",
    
    # PV System Data
    "{{pv_power_kWp}}": "anlage_kwp",
    "{{annual_yield_kwh}}": "annual_pv_production_kwh",
    "{{module_count}}": "module_count_total",
    "{{investment_total}}": "total_investment_netto",
    "{{investment_brutto}}": "total_investment_brutto",
    "{{self_consumption_rate}}": "self_supply_rate_percent",
    "{{autarky_rate}}": "autarky_rate_percent",
    "{{payback_period}}": "amortization_time_years",
    "{{annual_savings}}": "annual_financial_benefit_year1",
    "{{co2_savings_annual}}": "annual_co2_savings_kg",
    "{{co2_savings_25y}}": "co2_savings_25_years_kg",
    "{{feed_in_tariff}}": "einspeiseverguetung_euro_per_kwh",
    "{{electricity_savings}}": "stromkostenersparnis_year1",
    
    # Heat Pump Data
    "{{hp_title}}": "hp_system_title",
    "{{hp_power_kw}}": "hp_heating_capacity_kw", 
    "{{hp_cop}}": "hp_cop_factor",
    "{{hp_annual_savings}}": "hp_annual_cost_savings",
    "{{hp_investment}}": "hp_total_investment",
    "{{hp_payback}}": "hp_payback_period_years",
    
    # Economic Data
    "{{roi_percent}}": "simple_roi_percent",
    "{{npv_value}}": "npv_value",
    
    # Dates
    "{{offer_date}}": "current_date",
    "{{valid_until}}": "offer_valid_until"
}

def build_dynamic_data(project_data: Dict[str, Any], calculation_results: Dict[str, Any], 
                      company_info: Dict[str, Any]) -> Dict[str, Any]:
    """Build dynamic data dictionary for placeholder replacement"""
    
    # Extract customer data
    customer_data = project_data.get("customer_data", {})
    
    # Build data dictionary
    data = {
        # Customer information
        "customer_name": f"{customer_data.get('first_name', '')} {customer_data.get('last_name', '')}".strip(),
        "customer_street": customer_data.get("street", ""),
        "customer_city": customer_data.get("city", ""),
        "customer_zip": customer_data.get("zip_code", ""),
        "customer_email": customer_data.get("email", ""),
        "customer_phone": customer_data.get("phone", ""),
        
        # Company information
        "company_name": company_info.get("name", ""),
        "company_street": company_info.get("street", ""),
        "company_city": company_info.get("city", ""),
        "company_zip": company_info.get("zip_code", ""),
        "company_phone": company_info.get("phone", ""),
        "company_email": company_info.get("email", ""),
        
        # System data from calculations
        **calculation_results,
        
        # Dates
        "current_date": datetime.now().strftime("%d.%m.%Y"),
        "offer_valid_until": (datetime.now().replace(day=1, month=datetime.now().month+1) if datetime.now().month < 12 
                             else datetime.now().replace(year=datetime.now().year+1, month=1, day=1)).strftime("%d.%m.%Y")
    }
    
    return data

def replace_placeholders_in_text(text: str, dynamic_data: Dict[str, Any]) -> str:
    """Replace placeholders in text with dynamic data"""
    if not text:
        return text
        
    result = text
    for placeholder, data_key in PLACEHOLDER_MAPPING.items():
        if placeholder in result:
            value = dynamic_data.get(data_key, "")
            # Format numbers appropriately
            if isinstance(value, (int, float)):
                if data_key in ["anlage_kwp", "amortization_time_years"]:
                    result = result.replace(placeholder, f"{value:.1f}")
                elif "percent" in data_key or "rate" in data_key:
                    result = result.replace(placeholder, f"{value:.1f}%")
                elif "euro" in data_key.lower() or "investment" in data_key or "savings" in data_key:
                    result = result.replace(placeholder, f"{value:,.0f} €")
                else:
                    result = result.replace(placeholder, str(value))
            else:
                result = result.replace(placeholder, str(value))
    
    return result

# ===== PDF OVERLAY GENERATION (extracted from dynamic_overlay.py) =====

def create_text_overlay(elements: List[Dict[str, Any]], dynamic_data: Dict[str, Any], 
                       page_size: Tuple[float, float] = A4) -> io.BytesIO:
    """Create a text overlay PDF with positioned text elements"""
    
    if not REPORTLAB_AVAILABLE:
        raise ImportError("ReportLab is required for PDF generation")
    
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=page_size)
    
    for element in elements:
        text = element.get('text', '')
        position = element.get('position', [0, 0, 100, 20])  # x1, y1, x2, y2
        font = element.get('font', 'Helvetica')
        font_size = element.get('font_size', 10.0)
        color_int = element.get('color', 0)
        
        # Replace placeholders
        text = replace_placeholders_in_text(text, dynamic_data)
        
        if not text or text.strip() == "":
            continue
            
        # Convert color integer to RGB
        try:
            if color_int == 0:
                color = colors.black
            else:
                # Convert from integer color to RGB
                r = (color_int >> 16) & 255
                g = (color_int >> 8) & 255  
                b = color_int & 255
                color = Color(r/255.0, g/255.0, b/255.0)
        except:
            color = colors.black
        
        # Set font and color - normalize font names
        try:
            normalized_font = font
            if font == 'Helvetica-Regular':
                normalized_font = 'Helvetica'
            elif font == 'Helvetica-Bold':
                normalized_font = 'Helvetica-Bold'
            elif font == 'Arial-Regular':
                normalized_font = 'Helvetica'
            elif font == 'Arial-Bold':
                normalized_font = 'Helvetica-Bold'
                
            c.setFont(normalized_font, font_size)
        except:
            # Fallback to Helvetica if font not found
            c.setFont('Helvetica', font_size)
            
        c.setFillColor(color)
        
        # Draw text at position (x1, y1 from bottom-left)
        # Note: PDF coordinates are from bottom-left, YML might be from top-left
        page_height = page_size[1]
        x = position[0] 
        y = page_height - position[1]  # Flip Y coordinate
        
        c.drawString(x, y, text)
    
    c.save()
    buffer.seek(0)
    # Return a copy of the buffer to avoid closed file issues
    content = buffer.getvalue()
    new_buffer = io.BytesIO(content)
    buffer.close()
    return new_buffer

def merge_overlay_with_template(template_path: Path, overlay_buffer: io.BytesIO) -> io.BytesIO:
    """Merge text overlay with template PDF"""
    
    if not PYPDF_AVAILABLE:
        raise ImportError("pypdf/PyPDF2 is required for PDF merging")
    
    try:
        # Read template
        with template_path.open('rb') as template_file:
            template_reader = PdfReader(template_file)
            if len(template_reader.pages) == 0:
                raise ValueError(f"Template PDF {template_path} has no pages")
            template_page = template_reader.pages[0]
        
        # Read overlay
        overlay_buffer.seek(0)
        overlay_content = overlay_buffer.read()
        overlay_reader = PdfReader(io.BytesIO(overlay_content))
        
        if len(overlay_reader.pages) == 0:
            # No overlay content, return template only
            output_buffer = io.BytesIO()
            writer = PdfWriter()
            writer.add_page(template_page)
            writer.write(output_buffer)
            output_buffer.seek(0)
            return output_buffer
            
        overlay_page = overlay_reader.pages[0]
        
        # Merge overlay onto template
        template_page.merge_page(overlay_page)
        
        # Write result
        output_buffer = io.BytesIO()
        writer = PdfWriter()
        writer.add_page(template_page)
        writer.write(output_buffer)
        
        output_buffer.seek(0)
        return output_buffer
        
    except Exception as e:
        # If merging fails, return template only
        print(f"Warning: PDF merge failed for {template_path}: {e}")
        output_buffer = io.BytesIO()
        with template_path.open('rb') as template_file:
            template_reader = PdfReader(template_file)
            writer = PdfWriter()
            writer.add_page(template_reader.pages[0])
            writer.write(output_buffer)
            output_buffer.seek(0)
            return output_buffer

# ===== MAIN PDF GENERATION FUNCTIONS =====

def generate_pv_pdf(project_data: Dict[str, Any], calculation_results: Dict[str, Any], 
                   company_info: Dict[str, Any]) -> io.BytesIO:
    """Generate complete PV system PDF (7 pages)"""
    
    dynamic_data = build_dynamic_data(project_data, calculation_results, company_info)
    
    writer = PdfWriter()
    
    # Generate each page
    for i in range(7):
        page_num = i + 1
        template_file = config.pv_templates_dir / f"nt_nt_{page_num:02d}.pdf"
        coord_file = config.pv_coords_dir / f"seite{page_num}.yml"
        
        if not template_file.exists():
            print(f"Warning: Template file {template_file} not found")
            continue
            
        if not coord_file.exists():
            print(f"Warning: Coordinate file {coord_file} not found")
            continue
        
        # Parse coordinates
        elements = parse_coordinates_yml(coord_file)
        
        # Create overlay
        overlay_buffer = create_text_overlay(elements, dynamic_data)
        
        # Merge with template
        merged_page_buffer = merge_overlay_with_template(template_file, overlay_buffer)
        
        # Add to final PDF
        merged_reader = PdfReader(merged_page_buffer)
        writer.add_page(merged_reader.pages[0])
    
    # Write final PDF
    output_buffer = io.BytesIO()
    writer.write(output_buffer)
    output_buffer.seek(0)
    
    return output_buffer

def generate_heatpump_pdf(project_data: Dict[str, Any], calculation_results: Dict[str, Any], 
                         company_info: Dict[str, Any], page_count: int = 7) -> io.BytesIO:
    """Generate heat pump PDF (up to 16 pages available)"""
    
    dynamic_data = build_dynamic_data(project_data, calculation_results, company_info)
    
    writer = PdfWriter()
    
    # Generate requested pages (limited by available coord files)
    available_coord_pages = min(page_count, 7)  # Only 7 coord files available
    
    for i in range(available_coord_pages):
        page_num = i + 1
        template_file = config.hp_templates_dir / f"hp_nt_{page_num:02d}.pdf"
        coord_file = config.hp_coords_dir / f"wp_seite{page_num}.yml"
        
        if not template_file.exists():
            print(f"Warning: HP template file {template_file} not found")
            continue
            
        if not coord_file.exists():
            print(f"Warning: HP coordinate file {coord_file} not found")
            continue
        
        # Parse coordinates
        elements = parse_coordinates_yml(coord_file)
        
        # Create overlay
        overlay_buffer = create_text_overlay(elements, dynamic_data)
        
        # Merge with template 
        merged_page_buffer = merge_overlay_with_template(template_file, overlay_buffer)
        
        # Add to final PDF
        merged_reader = PdfReader(merged_page_buffer)
        writer.add_page(merged_reader.pages[0])
    
    # Write final PDF
    output_buffer = io.BytesIO()
    writer.write(output_buffer)
    output_buffer.seek(0)
    
    return output_buffer

def generate_multi_company_pdfs(project_data: Dict[str, Any], calculation_results: Dict[str, Any], 
                               companies: List[Dict[str, Any]], pdf_type: str = "pv") -> io.BytesIO:
    """Generate PDFs for multiple companies and return as ZIP"""
    
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        
        for company in companies:
            company_name = company.get("name", "Unknown Company")
            safe_name = re.sub(r'[^\w\s-]', '', company_name).replace(' ', '_')
            
            try:
                if pdf_type == "pv":
                    pdf_buffer = generate_pv_pdf(project_data, calculation_results, company)
                    filename = f"PV_Angebot_{safe_name}.pdf"
                elif pdf_type == "heatpump":
                    pdf_buffer = generate_heatpump_pdf(project_data, calculation_results, company)
                    filename = f"Waermepumpe_Angebot_{safe_name}.pdf"
                else:
                    continue
                
                zip_file.writestr(filename, pdf_buffer.getvalue())
                
            except Exception as e:
                print(f"Error generating PDF for company {company_name}: {e}")
                continue
    
    zip_buffer.seek(0)
    return zip_buffer

# ===== CLI INTERFACE =====

def main():
    """Main CLI interface"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({'error': 'No command provided'}))
            return
            
        command = sys.argv[1]
        
        if command == 'generate_pv_pdf':
            if len(sys.argv) < 3:
                print(json.dumps({'error': 'Configuration file path required'}))
                return
                
            config_file = sys.argv[2]
            with open(config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            
            project_data = config_data.get('project_data', {})
            calculation_results = config_data.get('calculation_results', {})
            company_info = config_data.get('company_info', {})
            
            pdf_buffer = generate_pv_pdf(project_data, calculation_results, company_info)
            
            # Save to file
            output_file = config_data.get('output_file', 'pv_angebot.pdf')
            with open(output_file, 'wb') as f:
                f.write(pdf_buffer.getvalue())
            
            result = {'success': True, 'output_file': output_file}
            
        elif command == 'generate_heatpump_pdf':
            if len(sys.argv) < 3:
                print(json.dumps({'error': 'Configuration file path required'}))
                return
                
            config_file = sys.argv[2]
            with open(config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            
            project_data = config_data.get('project_data', {})
            calculation_results = config_data.get('calculation_results', {})
            company_info = config_data.get('company_info', {})
            page_count = config_data.get('page_count', 7)
            
            pdf_buffer = generate_heatpump_pdf(project_data, calculation_results, company_info, page_count)
            
            # Save to file
            output_file = config_data.get('output_file', 'waermepumpe_angebot.pdf')
            with open(output_file, 'wb') as f:
                f.write(pdf_buffer.getvalue())
            
            result = {'success': True, 'output_file': output_file}
            
        elif command == 'generate_multi_pdfs':
            if len(sys.argv) < 3:
                print(json.dumps({'error': 'Configuration file path required'}))
                return
                
            config_file = sys.argv[2]
            with open(config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            
            project_data = config_data.get('project_data', {})
            calculation_results = config_data.get('calculation_results', {})
            companies = config_data.get('companies', [])
            pdf_type = config_data.get('pdf_type', 'pv')
            
            zip_buffer = generate_multi_company_pdfs(project_data, calculation_results, companies, pdf_type)
            
            # Save to file
            output_file = config_data.get('output_file', f'multi_angebote_{pdf_type}.zip')
            with open(output_file, 'wb') as f:
                f.write(zip_buffer.getvalue())
            
            result = {'success': True, 'output_file': output_file}
            
        elif command == 'test_coordinates':
            # Test coordinate parsing
            coord_file = sys.argv[2] if len(sys.argv) > 2 else 'coords/seite1.yml'
            coord_path = project_root / coord_file
            
            elements = parse_coordinates_yml(coord_path)
            result = {'success': True, 'elements_count': len(elements), 'elements': elements[:5]}  # Show first 5
            
        else:
            result = {'error': f'Unknown command: {command}'}
        
        # Output clean JSON
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        error_result = {'error': f'PDF Bridge error: {str(e)}', 'traceback': str(e)}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
