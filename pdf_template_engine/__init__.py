"""
pdf_template_engine

Öffentliche API zum Erzeugen der 7-seitigen Haupt-PDF mittels Templates:
- build_dynamic_data: erzeugt dynamische Werte aus App-Daten
- generate_custom_offer_pdf: erstellt Overlay, merged mit Templates, hängt optional weitere Seiten an
"""

from pathlib import Path
from typing import Dict, Any, Optional

from .placeholders import build_dynamic_data, PLACEHOLDER_MAPPING
from .dynamic_overlay import (
	generate_overlay,
	merge_with_background,
	append_additional_pages,
	generate_custom_offer_pdf,
)

__all__ = [
	"build_dynamic_data",
	"PLACEHOLDER_MAPPING",
	"generate_overlay",
	"merge_with_background",
	"append_additional_pages",
	"generate_custom_offer_pdf",
]
