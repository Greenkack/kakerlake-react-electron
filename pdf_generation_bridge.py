#!/usr/bin/env python3
# pdf_generation_bridge.py
# Bridge script for Electron to call Python PDF generation pipeline
# Maintains exact compatibility with pdf_generator.py:generate_offer_pdf

import sys
import json
import traceback
import os
from typing import Dict, Any, Optional

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def generate_pdf_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Bridge function to call Python PDF generation with Electron data"""
    try:
        # Import Python PDF generation functions
        from pdf_generator import generate_offer_pdf
        
        project_data = payload.get('project_data', {})
        analysis_results = payload.get('analysis_results', {})
        options = payload.get('options', {})
        
        # Map Electron options to Python PDF generation parameters
        pdf_options = {
            'include_extended_pages': options.get('extended_pages', False),
            'include_wp_additional_pages': options.get('wp_additional_pages', False),
            'include_charts': options.get('include_charts', True),
            'include_company_docs': options.get('include_company_docs', False),
        }
        
        # Call Python PDF generation - mirrors pdf_ui.py checkbox handling
        result = generate_offer_pdf(
            project_data=project_data,
            analysis_results=analysis_results,
            **pdf_options
        )
        
        if result and isinstance(result, str):  # File path returned
            return {
                'success': True,
                'output_path': result,
                'message': 'PDF generated successfully'
            }
        elif result is True:  # Boolean success
            return {
                'success': True,
                'output_path': None,
                'message': 'PDF generated successfully (no file path returned)'
            }
        else:
            return {
                'success': False,
                'error': 'PDF generation returned no result'
            }
            
    except ImportError as e:
        return {
            'success': False,
            'error': f'Import error: {str(e)}. Make sure pdf_generator.py is available.'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'PDF generation error: {str(e)}',
            'traceback': traceback.format_exc()
        }

def main():
    """Main bridge function called from Electron"""
    if len(sys.argv) < 2:
        result = {
            'success': False,
            'error': 'Usage: python pdf_generation_bridge.py <payload_file.json>'
        }
        print(json.dumps(result))
        sys.exit(1)
    
    payload_file = sys.argv[1]
    
    try:
        # Read payload from temp file
        with open(payload_file, 'r', encoding='utf-8') as f:
            payload = json.load(f)
        
        # Validate payload
        if not isinstance(payload, dict):
            raise ValueError('Payload must be a JSON object')
            
        command = payload.get('command')
        if command != 'generate_pdf':
            raise ValueError(f'Unknown command: {command}')
        
        # Generate PDF
        result = generate_pdf_from_payload(payload)
        
        # Return result as JSON
        print(json.dumps(result))
        sys.exit(0 if result.get('success') else 1)
        
    except FileNotFoundError:
        result = {
            'success': False,
            'error': f'Payload file not found: {payload_file}'
        }
        print(json.dumps(result))
        sys.exit(1)
        
    except json.JSONDecodeError as e:
        result = {
            'success': False,
            'error': f'Invalid JSON in payload file: {str(e)}'
        }
        print(json.dumps(result))
        sys.exit(1)
        
    except Exception as e:
        result = {
            'success': False,
            'error': f'Unexpected error: {str(e)}',
            'traceback': traceback.format_exc()
        }
        print(json.dumps(result))
        sys.exit(1)

if __name__ == '__main__':
    main()
