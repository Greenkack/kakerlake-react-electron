"""
pdf_template_engine/dynamic_overlay.py

Erzeugt Text-Overlays für sieben statische Template-Seiten anhand von Koordinaten
aus coords/seite1.yml … seite7.yml und verschmilzt sie mit den Dateien
pdf_templates_static/notext/nt_nt_01.pdf … nt_nt_07.pdf.
"""

from __future__ import annotations
import io
import re
from pathlib import Path
from typing import Dict, List, Any, Optional

from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import base64
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import Color
from reportlab.lib import colors  # für add_page3_elements (colors.black)
from pypdf import PdfReader, PdfWriter, Transformation
try:
    # PageObject ist optional (ältere pypdf-Versionen können es anders exportieren)
    from pypdf import PageObject  # type: ignore
except Exception:  # pragma: no cover
    PageObject = None  # type: ignore
from pathlib import Path

from .placeholders import PLACEHOLDER_MAPPING

# Optional: Admin-Settings laden, um Overlay-Verhalten dynamisch zu steuern
try:
    from database import load_admin_setting  # type: ignore
except Exception:  # Fallback, wenn DB nicht verfügbar ist (z. B. Tests)
    def load_admin_setting(key: str, default=None):  # type: ignore
        return default


def _to_bool(val: Any, default: bool = False) -> bool:
    try:
        if isinstance(val, bool):
            return val
        if isinstance(val, (int, float)):
            return bool(val)
        if isinstance(val, str):
            return val.strip().lower() in {"1", "true", "yes", "on"}
    except Exception:
        pass
    return default


def _as_image_reader(val: Any) -> Any:
    """Erzeugt einen ImageReader aus Base64, Data-URL oder lokalem Dateipfad.
    Gibt None zurück, wenn nicht lesbar."""
    try:
        if not val:
            return None
        s = str(val).strip()
        
        # Data-URL -> Base64 extrahieren
        if ";base64," in s:
            s = s.split(";base64,", 1)[1]
        
        # Versuche Base64-Decode
        try:
            raw = base64.b64decode(s)
            
            # Prüfe Bildformat - nur PNG/JPEG unterstützt
            if raw.startswith(b'<?xml') or raw.startswith(b'<svg'):
                return None  # SVG nicht unterstützt
            
            return ImageReader(io.BytesIO(raw))
        except Exception:
            pass
        
        # Falls Dateipfad existiert, Datei laden
        try:
            p = Path(s)
            if p.exists() and p.is_file():
                with p.open("rb") as f:
                    data = f.read()
                return ImageReader(io.BytesIO(data))
        except Exception:
            pass
        
        return None
    except Exception:
        return None


def _draw_global_watermark(c: canvas.Canvas, page_width: float, page_height: float) -> None:
    """Zeichnet optional ein globales Wasserzeichen (aus Admin-Settings) diagonal über die Seite."""
    enabled = _to_bool(load_admin_setting("pdf_global_watermark_enabled", False), False)
    if not enabled:
        return
    text = load_admin_setting("pdf_global_watermark_text", "VERTRAULICH") or "VERTRAULICH"
    # Opazität optional (0..1); wenn nicht unterstützt, dann sehr helle Farbe
    opacity = load_admin_setting("pdf_global_watermark_opacity", 0.10)
    try:
        opacity = float(opacity)
    except Exception:
        opacity = 0.10

    c.saveState()
    try:
        # Sehr helle graublaue Farbe, ggf. mit Alpha
        col = Color(0.6, 0.65, 0.75)
        try:
            c.setFillAlpha(max(0.02, min(0.3, opacity)))  # ReportLab 3.6+
        except Exception:
            pass
        c.setFillColor(col)
        c.setFont("Helvetica-Bold", 64)
        # Diagonal drehen und wiederholt zeichnen
        c.translate(page_width * 0.15, page_height * 0.25)
        c.rotate(30)
        # Kacheln über die Seite verteilen
        step_x = 380
        step_y = 260
        for iy in range(0, int(page_height * 1.2), step_y):
            for ix in range(0, int(page_width * 1.2), step_x):
                try:
                    c.drawString(ix, iy, text)
                except Exception:
                    pass
    finally:
        c.restoreState()


def parse_coords_file(path: Path) -> List[Dict[str, Any]]:
    """Liest eine seiteX.yml und gibt eine Liste von Einträgen zurück.

    Einträge sind durch eine Zeile beginnend mit '-' oder '---' getrennt.
    Unterstützte Felder: Text, Position(x0,y0,x1,y1), Schriftart, Schriftgröße, Farbe
    """
    elements: List[Dict[str, Any]] = []
    current: Dict[str, Any] = {}
    if not path.exists():
        return elements
    with path.open(encoding="utf-8", errors="ignore") as f:
        for raw in f:
            line = raw.strip()
            if not line:
                continue
            # Einträge sind durch Linien aus '-' getrennt (z.B. "----------------------------------------")
            if (line.startswith("---") or (set(line) == {"-"} and len(line) >= 3)) and current:
                elements.append(current)
                current = {}
                continue
            if line.startswith("Text:"):
                current["text"] = line.split(":", 1)[1].strip()
            elif line.startswith("Position:"):
                # Zahlen extrahieren (auch mit Komma als Dezimaltrenner)
                nums = re.findall(r"[-+]?[0-9]*[\.,]?[0-9]+", line)
                nums = [n.replace(",", ".") for n in nums]
                if len(nums) >= 4:
                    current["position"] = tuple(float(n) for n in nums[:4])
            elif line.startswith("Schriftart:"):
                current["font"] = line.split(":", 1)[1].strip()
            elif line.lower().startswith("schriftgröße:") or line.lower().startswith("schriftgroesse:"):
                try:
                    val = line.split(":", 1)[1].strip().replace(",", ".")
                    current["font_size"] = float(val)
                except Exception:
                    current["font_size"] = 10.0
            elif line.startswith("Farbe:"):
                try:
                    val = line.split(":", 1)[1].strip()
                    if val.lower().startswith("0x"):
                        current["color"] = int(val, 16)
                    else:
                        current["color"] = int(val)
                except Exception:
                    current["color"] = 0
        if current:
            elements.append(current)
    return elements


def int_to_color(value: int) -> Color:
    """Wandelt einen Integer (0xRRGGBB) in reportlab Color um."""
    r = ((value >> 16) & 0xFF) / 255.0
    g = ((value >> 8) & 0xFF) / 255.0
    b = (value & 0xFF) / 255.0
    return Color(r, g, b)


def _draw_company_logo(c: canvas.Canvas, dynamic_data: Dict[str, str], page_width: float, page_height: float) -> None:
    """Zeichnet das Firmenlogo links oben, wenn company_logo_b64 vorhanden ist."""
    b64 = dynamic_data.get("company_logo_b64") or ""
    if not b64:
        return
    try:
        img_bytes = base64.b64decode(b64)
        img = ImageReader(io.BytesIO(img_bytes))
        # Zielfläche: max Breite/Höhe
        max_w, max_h = 120, 50  # Punkte
        c.saveState()
        # Hintergrund-Logo-Bereich abdecken (weißes Rechteck), um falsche Logos aus Templates zu maskieren
        try:
            c.setFillColorRGB(1, 1, 1)
            c.setStrokeColorRGB(1, 1, 1)
            c.rect(15, page_height - 20 - max_h - 5, max_w + 20, max_h + 10, stroke=0, fill=1)
        except Exception:
            pass
        c.drawImage(img, 20, page_height - 20 - max_h, width=max_w, height=max_h, preserveAspectRatio=True, mask='auto')
        c.restoreState()
    except Exception:
        return

def _parse_percent(value: str | float | int) -> float:
    try:
        if isinstance(value, (int, float)):
            return max(0.0, min(100.0, float(value)))
        s = str(value).strip().replace('%', '').replace(',', '.').replace(' ', '')
        return max(0.0, min(100.0, float(s)))
    except Exception:
        return 0.0

def _first_valid_percent(dynamic_data: Dict[str, str], keys: list[str]) -> float:
    for k in keys:
        if k in dynamic_data and dynamic_data.get(k) not in (None, ""):
            v = _parse_percent(dynamic_data.get(k))
            if v > 0:
                return v
    return 0.0

def _draw_donut(c: canvas.Canvas, cx: float, cy: float, pct: float, outer_r: float, inner_r: float,
                color_fg: Color, color_bg: Color) -> None:
    """Zeichnet einen Donut (Ring) mit farbigem Anteil pct in % (0-100)."""
    from reportlab.lib.colors import white
    # Voller Hintergrund-Ring
    c.saveState()
    # Hintergrund-Kreis (voll)
    c.setFillColor(color_bg)
    c.circle(cx, cy, outer_r, stroke=0, fill=1)
    # Vordergrund-Wedge (Anteil)
    extent = -360.0 * (pct / 100.0)  # im Uhrzeigersinn
    try:
        c.setFillColor(color_fg)
        c.wedge(cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r, 90, extent, stroke=0, fill=1)
    except Exception:
        pass
    # Loch stanzen
    c.setFillColor(white)
    c.circle(cx, cy, inner_r, stroke=0, fill=1)
    c.restoreState()

def _draw_page1_kpi_donuts(c: canvas.Canvas, dynamic_data: Dict[str, str], page_width: float, page_height: float) -> None:
    """Zeichnet zwei Donut-Diagramme (Unabhängigkeit, Eigenverbrauch) auf Seite 1 unterhalb der KPI-Überschrift."""
    # Werte aus dynamic_data ziehen (formatiert wie "54%" / "42%")
    # Robuste Ermittlung mit Fallback-Keys
    pct_autark = _first_valid_percent(dynamic_data, [
        "self_supply_rate_percent",
        "self_sufficiency_percent",
        "autarky_percent",
    ])
    pct_ev = _first_valid_percent(dynamic_data, [
        "self_consumption_percent",
        # Seite 2 abgeleiteter Wert (nur Zahl): direkter Deckungsanteil am Verbrauch
        "direct_cover_consumption_percent_number",
    ])
    if pct_autark <= 0 and pct_ev <= 0:
        return
    c.saveState()
    # Positionen grob unter "KENNZAHLEN IHRES PV-SYSTEMS" (YAML liegt bei ~494pt Höhe)
    # Position: weiter links und etwas nach unten, größer
    cy = 440.0
    left_cx = 95.0
    # Rechtsen Donut weiter nach rechts, zentriert über "EIGENVERBRAUCH"
    right_cx = 210.0
    outer_r = 40.0
    inner_r = 26.0
    # Farben (beide Donuts in Blau, Hintergrund hellgrau)
    from reportlab.lib.colors import Color
    bg = Color(0.85, 0.88, 0.90)
    fg_blue = Color(0.07, 0.34, 0.60)
    if pct_autark > 0:
        _draw_donut(c, left_cx, cy, pct_autark, outer_r, inner_r, fg_blue, bg)
        # Zentrumstext
        txt = dynamic_data.get("self_supply_rate_percent", f"{int(round(pct_autark))}%")
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(fg_blue)
        tw = c.stringWidth(txt, "Helvetica-Bold", 12)
        c.drawString(left_cx - tw/2, cy - 6, txt)
    if pct_ev > 0:
        _draw_donut(c, right_cx, cy, pct_ev, outer_r, inner_r, fg_blue, bg)
        txt = dynamic_data.get("self_consumption_percent", f"{int(round(pct_ev))}%")
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(fg_blue)
        tw = c.stringWidth(txt, "Helvetica-Bold", 12)
        c.drawString(right_cx - tw/2, cy - 6, txt)
    c.restoreState()

def _draw_top_right_triangle(c: canvas.Canvas, page_width: float, page_height: float, size: float = 36.0) -> None:
    """Zeichnet ein kleines, gefülltes Dreieck oben rechts (nur Seite 1).

    Farbe: identisch zum Blau der Fußzeilen/Charts (dezentes Dunkelblau).
    Das Dreieck wird vor den Texten gezeichnet, damit Beschriftungen nicht verdeckt werden.
    """
    # Akzentfarbe wie in Fußzeilen (#1B3670)
    accent = Color(27/255.0, 54/255.0, 112/255.0)
    c.saveState()
    try:
        # Punkte: Ecke oben rechts und zwei Katheten entlang der Ränder
        x0, y0 = page_width, page_height
        path = c.beginPath()
        path.moveTo(x0, y0)  # oben rechts
        path.lineTo(x0 - size, y0)  # nach links
        path.lineTo(x0, y0 - size)  # nach unten
        path.close()
        c.setFillColor(accent)
        c.setStrokeColor(accent)
        c.drawPath(path, stroke=0, fill=1)
    finally:
        c.restoreState()

# pdf_template_engine/dynamic_overlay.py

def generate_overlay(coords_dir: Path, dynamic_data: Dict[str, str], total_pages: int = 7) -> bytes:
    """Erzeugt ein Overlay-PDF für sieben Seiten anhand der coords-Dateien.

    total_pages steuert die Fußzeilen-Nummerierung als "Seite x von XX".
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    page_width, page_height = A4
    for i in range(1, 8):
        yml_path = coords_dir / f"seite{i}.yml"
        elements = parse_coords_file(yml_path)
        # Firmenlogo zuerst
        _draw_company_logo(c, dynamic_data, page_width, page_height)
        # Dreieck
        _draw_top_right_triangle(c, page_width, page_height, size=36.0)
        # Seite 1 Sonderdiagramme
        if i == 1:
            _draw_page1_kpi_donuts(c, dynamic_data, page_width, page_height)
        # Seite 3 rechter Chart
        if i == 3:
            try:
                c.saveState()
                try:
                    c.setFillColorRGB(1, 1, 1)
                    c.rect(350, page_height - 170 - 230, 260, 250, stroke=0, fill=1)
                finally:
                    c.restoreState()
                _draw_page3_right_chart_and_separator(c, elements, dynamic_data, page_width, page_height)
            except Exception:
                pass
        # Seite 4 Produktbilder
        if i == 4:
            _draw_page4_component_images(c, dynamic_data, page_width, page_height)

    	# Keys für horizontale Zentrierung innerhalb Box
        # Keys für horizontale Zentrierung innerhalb Box
        center_keys = {
            "direct_consumption_quote_prod_percent",
            "battery_use_quote_prod_percent",
            "feed_in_quote_prod_percent_number",
            "battery_cover_consumption_percent",
            "grid_consumption_rate_percent",
            "direct_cover_consumption_percent_number",
        }

        # Seite 1: bestimmte dynamische Werte rechtsbündig ausrichten
        right_align_tokens_s1 = {
            "36.958,00 EUR*",        # anlage_kwp (tatsächlicher Beispieltext!)
            "8.251,92 kWh/Jahr",     # annual_pv_production_kwh  
            "29.150,00 EUR*",        # amortization_time
        }

        # Seite 3: bestimmte Werte rechtsbündig an der rechten Boxkante (x1) ausrichten
        right_align_tokens_s3 = {
            "NOSW",
            "Deckung",
            "Verbrauch 32 Cent",
            "Kredit",
            "Neigung",
            "Art",
            "EEG",
            # Berechnungswerte rechtsbündig ausrichten
            "Direkt",
            "Einspeisung", 
            "Speichernutzung",
            "Überschuss",
            "Gesamt",
        }


        # Seite 3: Positionen der (entfernten) statischen 10-Jahres-Kosten einsammeln
        page3_cost_tokens: dict[str, dict[str, Any]] = {}
        if i == 3:
            _cost_token_map = {
                "46.296,00 €": "cost_10y_no_increase_number",
                "58.230,61 €": "cost_10y_with_increase_number",
            }
            for elem in elements:
                ttxt = (elem.get("text") or "").strip()
                if ttxt in _cost_token_map and isinstance(elem.get("position"), tuple) and len(elem.get("position")) == 4:
                    # Speichere Position + Font-Infos und referenzierten dynamischen Key
                    page3_cost_tokens[_cost_token_map[ttxt]] = {
                        "position": elem.get("position"),
                        "font": elem.get("font", "Helvetica-Bold"),
                        "font_size": float(elem.get("font_size", 10.49)),
                        "original_text": ttxt,
                    }

        for elem in elements:
            text = elem.get("text", "")
            key = PLACEHOLDER_MAPPING.get(text)
            
            # Spezielle Behandlung für Logo-Platzhalter (als Bilder rendern)
            if text in ["Logomodul", "Logoricht", "Logoakkus"]:
                print(f"DEBUG: Logo-Platzhalter gefunden: {text}")
                logo_b64 = dynamic_data.get(key, "") if key else ""
                print(f"DEBUG: Logo-Key: {key}, Logo-Daten vorhanden: {bool(logo_b64)}")
                if logo_b64:
                    img = _as_image_reader(logo_b64)
                    print(f"DEBUG: Image Reader erfolgreich: {img is not None}")
                    if img is not None:
                        pos = elem.get("position", (0, 0, 0, 0))
                        if len(pos) == 4:
                            x0, y0, x1, y1 = pos
                            logo_width = x1 - x0
                            logo_height = y1 - y0
                            logo_x = x0
                            logo_y = page_height - y1
                            
                            print(f"DEBUG: Logo {text} wird gerendert an Position ({logo_x}, {logo_y}) mit Größe ({logo_width}, {logo_height})")
                            
                            c.saveState()
                            try:
                                c.drawImage(img, logo_x, logo_y, width=logo_width, height=logo_height, 
                                          preserveAspectRatio=True, mask='auto')
                                print(f"DEBUG: Logo {text} erfolgreich gerendert!")
                            except Exception as e:
                                print(f"Fehler beim Rendern von {text}: {e}")
                            finally:
                                c.restoreState()
                else:
                    print(f"DEBUG: Kein Logo-Data für {text} (Key: {key})")
                continue  # Logo ist gerendert, nicht als Text behandeln
            
            # Normale Text-Behandlung
            draw_text = (dynamic_data.get(key, "") if key else text)
            pos = elem.get("position", (0, 0, 0, 0))
            if len(pos) == 4:
                x0, y0, x1, y1 = pos
                draw_x = x0
                draw_y = page_height - y1
            else:
                draw_x = 0
                draw_y = 0
            font_name = elem.get("font", "Helvetica")
            font_size = float(elem.get("font_size", 10.0))
            try:
                c.setFont(font_name, font_size)
            except Exception:
                c.setFont("Helvetica", font_size)
            color_int = int(elem.get("color", 0))
            c.setFillColor(int_to_color(color_int))

            # Seite 3: Ersetzte / entfernte statische 10-Jahres-Kosten NICHT erneut zeichnen
            if i == 3 and text in {"46.296,00 €", "58.230,61 €"}:
                continue

            # ========================================================================
            # START DER KORREKTUR: Die fehlerhafte Logik wird hier entfernt
            # ========================================================================
            if i == 3 and (text or "").strip() == "EUR" and pos[0] >= 100.0:
                 continue # Spezifische "EUR" Texte ignorieren, falls nötig
            # ========================================================================
            # ENDE DER KORREKTUR
            # ========================================================================

            # Normale Text-Rendering

            if i == 3 and key == "battery_usage_savings_eur":
                c.saveState()
                c.setStrokeColor(Color(0.7, 0.7, 0.7))
                c.setLineWidth(0.5)
                separator_y = draw_y - 15
                try:
                    c.line(x0, separator_y, x1, separator_y)
                finally:
                    c.restoreState()

            if i == 1 and key in {"self_supply_rate_percent", "self_consumption_percent"}:
                continue

            if i == 3 and text and "JAHRE SIMULATION" in text and len(pos) == 4:
                c.saveState()
                try:
                    c.setFillColorRGB(1, 1, 1)
                    c.setStrokeColorRGB(1, 1, 1)
                    rect_y = page_height - pos[3] - 2
                    rect_height = pos[3] - pos[1] + 4
                    c.rect(pos[0] - 2, rect_y, (pos[2] - pos[0]) + 4, rect_height, stroke=0, fill=1)
                finally:
                    c.restoreState()

            try:
                raw = (text or "").strip()
                is_footer_num = (
                    not key and raw.isdigit() and int(raw) == i and
                    len(pos) == 4 and (pos[3] >= 780.0) and
                    (pos[0] >= 520.0) and
                    color_int == 0xFFFFFF
                )
            except Exception:
                is_footer_num = False

            if is_footer_num:
                page_num_text = f"Seite {i} von {int(total_pages) if isinstance(total_pages, (int, float)) else total_pages}"
                try:
                    c.drawRightString(x1, draw_y, page_num_text)
                except Exception:
                    c.drawString(draw_x, draw_y, page_num_text)
            else:
                if key in center_keys and len(pos) == 4:
                    try:
                        tw = c.stringWidth(str(draw_text), font_name, font_size)
                        mid_x = (x0 + x1) / 2.0
                        c.drawString(mid_x - tw / 2.0, draw_y, str(draw_text))
                    except Exception:
                        c.drawString(draw_x, draw_y, str(draw_text))
                elif i == 1 and (text in right_align_tokens_s1) and len(pos) == 4:
                    # Seite 1: Rechtsbündig für dynamische Werte, 17 Punkte nach rechts verschoben
                    try:
                        c.drawRightString(x1 + 17, draw_y, str(draw_text))
                    except Exception:
                        c.drawString(draw_x, draw_y, str(draw_text))
                elif i == 3 and (text in right_align_tokens_s3) and len(pos) == 4:
                    # Seite 3: Rechtsbündig für Berechnungswerte und Bedarfsanalyse
                    try:
                        c.drawRightString(x1, draw_y, str(draw_text))
                    except Exception:
                        c.drawString(draw_x, draw_y, str(draw_text))
                else:
                    c.drawString(draw_x, draw_y, str(draw_text))

        
        if i == 3 and page3_cost_tokens:
            c.saveState()
            try:
                from reportlab.lib.colors import Color as _Color
                dark_blue = _Color(0.07, 0.34, 0.60)
                for dyn_key, meta in page3_cost_tokens.items():
                    pos = meta.get("position")
                    if not (isinstance(pos, tuple) and len(pos) == 4):
                        continue
                    x0, y0, x1, y1 = pos
                    draw_y = page_height - y1
                    val = dynamic_data.get(dyn_key) or meta.get("original_text") or ""
                    font_name = meta.get("font", "Helvetica-Bold")
                    font_size = float(meta.get("font_size", 10.49))
                    c.setFont(font_name, font_size)
                    bw = c.stringWidth(str(val), font_name, font_size)
                    pad_x = 2.0
                    pad_y = 1.5
                    c.saveState()
                    c.setFillColorRGB(1, 1, 1)
                    c.rect(x0 - pad_x, draw_y - pad_y, bw + 2 * pad_x, font_size + 2 * pad_y, stroke=0, fill=1)
                    c.restoreState()
                    c.setFillColor(colors.black)
                    c.drawString(x0, draw_y, str(val))
            finally:
                c.restoreState()

        c.showPage()
    c.save()
    return buffer.getvalue()

def _draw_page3_right_chart_and_separator(c: canvas.Canvas, elements: List[Dict[str, Any]], dynamic_data: Dict[str, str], page_width: float, page_height: float) -> None:
    """Seite 3: Rechts NUR die 20-Jahres-Gesamtergebnisse als Text + vertikale Trennlinie.

    - Linke Diagrammhöhe (aus Tick-Positionen) wird genutzt, um die Text-Vertikalmitte zu bestimmen.
    - Ausgegeben werden: cost_20y_no_increase_number, cost_20y_with_increase_number
    - Trennlinie: fest platziert (template-stabil) rechts neben dem linken Diagramm.
    """
    # Canvas-Zustand sichern, um Farben nicht zu überschreiben
    c.saveState()
    try:
        # 1) Linke Diagramm-Vertikalrange aus den Tick-Elementen entnehmen
        top_label_y1 = None
        bottom_label_y1 = None
        for el in elements:
            t = (el.get("text") or "").strip()
            if t == "25.000" and isinstance(el.get("position"), tuple) and len(el.get("position")) == 4:
                top_label_y1 = el["position"][3]
            if t == "0" and isinstance(el.get("position"), tuple) and len(el.get("position")) == 4:
                bottom_label_y1 = el["position"][3]
        # Fallbacks, falls tokens bereits dynamisch ersetzt wurden und oben nicht gefunden wurden
        if top_label_y1 is None or bottom_label_y1 is None:
            # Suche nach kleinster/größter y1 bei numerischen Tick-Labels im Bereich der linken Achse
            candidates = []
            for el in elements:
                t = (el.get("text") or "").strip().replace(".", "").replace(",", ".")
                if re.fullmatch(r"[0-9]+(\.[0-9]+)?", t):
                    pos = el.get("position")
                    if isinstance(pos, tuple) and len(pos) == 4 and pos[0] < 100.0:
                        candidates.append(pos[3])
            if candidates:
                top_label_y1 = min(candidates)
                bottom_label_y1 = max(candidates)
        # Umrechnen in Canvas-Koordinaten
        if top_label_y1 is None or bottom_label_y1 is None:
            # Plausible Defaults aus der Vorlage (aus seite3.yml abgelesen)
            top_label_y1 = 192.7
            bottom_label_y1 = 326.1
        axis_top_y = page_height - float(top_label_y1)
        axis_bottom_y = page_height - float(bottom_label_y1)
        axis_height = max(10.0, axis_top_y - axis_bottom_y)

        # 2) Separator-Linie fest rechts vom linken Diagramm platzieren (template-stabil)
        # Fixe Position hat sich bewährt: ~300 pt liegt rechts neben dem linken Diagramm und lässt genug Platz rechts
        sep_x = 299.0
        c.saveState()
        c.setStrokeColor(int_to_color(0x1B3670))
        c.setLineWidth(0.6)
        # Linie über die Diagrammhöhe ziehen (mit kleiner Überlappung)
        c.line(sep_x, axis_bottom_y - .0, sep_x, axis_top_y + 8.0)
        c.restoreState()

        # 3) Rechte Diagrammfläche definieren – nur ZWEI Balken (Totals 20J)
        chart_left_x = sep_x + 42.0  # weiter nach rechts verschoben
        chart_width = 230.0
        chart_right_x = chart_left_x + chart_width
        y0 = axis_bottom_y
        y1 = axis_top_y
        from reportlab.lib.colors import Color
        axis_color = int_to_color(0xB0B0B0)  # Achse in Hellgrau
        dark_blue = Color(0.07, 0.34, 0.60)
        light_blue = Color(0.63, 0.78, 0.90)

        # Totals aus Platzhaltern holen
        def _parse_money(s: str) -> float:
            try:
                ss = re.sub(r"[^0-9,\.]", "", (s or "")).replace(".", "").replace(",", ".")
                return float(ss or 0.0)
            except Exception:
                return 0.0

        v_no_inc_total = _parse_money(dynamic_data.get("cost_20y_no_increase_number") or "0")
        v_with_inc_total = _parse_money(dynamic_data.get("cost_20y_with_increase_number") or "0")

        # Dynamische Obergrenze bestimmen
        import math
        max_val = max(v_no_inc_total, v_with_inc_total, 0.0)
        if max_val > 0:
            top = math.ceil(max_val / 1000.0) * 1000.0
            if top <= max_val:
                top = max(max_val + 0.02 * max_val, top + 1000.0)
            cap = max_val * 1.2
            if top > cap:
                top = cap
        else:
            top = 25000.0

        # Y-Achse und Ticks + gepunktete Gridlines
        y_axis_x = chart_left_x + 4.0
        c.saveState()
        c.setStrokeColor(axis_color)
        c.setLineWidth(1.0)
        c.line(y_axis_x, y0, y_axis_x, y1)
        try:
            c.setFont("Helvetica", 6.0)
        except Exception:
            c.setFont("Helvetica", 6)
        for i_tick in range(5, -1, -1):
            tv = top * i_tick / 5.0
            py = y0 + (y1 - y0) * (tv / top if top > 0 else 0.0)
            c.setLineWidth(0.6)
            # Tick an der Y-Achse
            c.line(y_axis_x - 3.0, py, y_axis_x, py)
            # Gepunktete horizontale Linie
            c.saveState()
            c.setDash(1, 3)
            c.setStrokeColor(int_to_color(0xC9D4E5))
            c.line(y_axis_x, py, chart_right_x, py)
            c.restoreState()
            lbl = f"{tv:,.2f}".replace(",", "#").replace(".", ",").replace("#", ".")
            try:
                tw = c.stringWidth(lbl, "Helvetica", 6.0)
            except Exception:
                tw = c.stringWidth(lbl, "Helvetica", 6)
            c.setFillColor(colors.black)  # Schwarz statt Dunkelblau
            c.drawString(y_axis_x - 6.0 - tw, py - 2.0, lbl)
        c.restoreState()

        # Balken zeichnen
        def _h(val: float) -> float:
            return 0.0 if top <= 0 else (max(0.0, min(1.0, val / top)) * (y1 - y0))
        bar_w = 16.0  # halb so breit
        gap = 40.0
        # Balken leicht nach rechts verschieben
        bar_shift = 14.0  # etwas weiter rechts als zuvor
        bar1_x = y_axis_x + 22.0 + bar_shift
        # Zweiter Balken so verschieben, dass der Abstand doppelt so groß ist wie vorher
        bar2_x = bar1_x + bar_w + (2 * gap)
        h1 = _h(v_no_inc_total)
        h2 = _h(v_with_inc_total)
        c.saveState()
        c.setFillColor(light_blue)
        c.rect(bar1_x, y0, bar_w, h1, stroke=0, fill=1)
        c.setFillColor(dark_blue)
        c.rect(bar2_x, y0, bar_w, h2, stroke=0, fill=1)
        c.restoreState()

        # Bodenlinie des Diagramms in Grau (keine obere Linie)
        c.saveState()
        c.setStrokeColor(int_to_color(0xB0B0B0))
        c.setLineWidth(1.0)
        c.line(y_axis_x, y0, chart_right_x, y0)
        c.restoreState()

        # Werte über den Balken anzeigen (als Orientierung)
        try:
            c.setFont("Helvetica-Bold", 10.49)
        except Exception:
            c.setFont("Helvetica-Bold", 10.49)
        c.setFillColor(colors.black)  # Schwarz statt Dunkelblau
        val1 = dynamic_data.get("cost_20y_no_increase_number") or "0,00 €"
        val2 = dynamic_data.get("cost_20y_with_increase_number") or "0,00 €"
        c.drawCentredString(bar1_x + bar_w / 2.0, y0 + h1 + 12.0, val1)
        c.drawCentredString(bar2_x + bar_w / 2.0, y0 + h2 + 12.0, val2)

        # Legende dynamisch aus YAML übernehmen (Texte mit 'strompreis' rechts der Seite)
        legend_x = chart_left_x + 12.0  # Start X für Quadrate
        square_size = 6.0
        label_gap = 4.0
        
        try:
            c.setFont("Helvetica", 7.98)
        except Exception:
            c.setFont("Helvetica", 8)
        # Kandidaten suchen
        legend_texts: list[str] = []
        for el in elements:
            try:
                pos = el.get("position")
                if not (isinstance(pos, tuple) and len(pos) == 4):
                    continue
                if pos[0] < 300:  # nur rechter Bereich
                    continue
                t = (el.get("text") or "").strip()
                if not t:
                    continue
                if "strompreis" in t.lower():
                    if t not in legend_texts:
                        legend_texts.append(t)
            except Exception:
                continue
        # Fallback auf korrekte Legendentexte falls nichts im YAML gefunden
        if len(legend_texts) < 2:
            # Verwende die korrekten, gewünschten Texte
            legend_texts = ["", ""]
        # Höhen (an bestehende Vorlage angelehnt)
        legend1_base_y = page_height - 356.6169
        legend2_base_y = page_height - 368.60684
        # Text-Position - 2 Pixel nach rechts und 1 Pixel nach oben
        text_offset_x = 2.0
        text_offset_y = 1.0
        
        # Eintrag 1 (hellblau) - Quadrat an ursprünglicher Position
        c.saveState(); c.setFillColor(light_blue); c.rect(legend_x, legend1_base_y, square_size, square_size, stroke=0, fill=1); c.restoreState()
        c.setFillColor(colors.black)  # Schwarz statt Dunkelblau
        c.drawString(legend_x + square_size + label_gap + text_offset_x, legend1_base_y - 1.0 + text_offset_y, legend_texts[0])
        # Eintrag 2 (dunkelblau) - Quadrat an ursprünglicher Position
        c.saveState(); c.setFillColor(dark_blue); c.rect(legend_x, legend2_base_y, square_size, square_size, stroke=0, fill=1); c.restoreState()
        c.setFillColor(colors.black)  # Schwarz statt Dunkelblau
        c.drawString(legend_x + square_size + label_gap + text_offset_x, legend2_base_y - 1.0 + text_offset_y, legend_texts[1] if len(legend_texts) > 1 else "")
    
    finally:
        # Canvas-Zustand wiederherstellen, damit nachfolgende Texte nicht beeinflusst werden
        c.restoreState()


def _draw_page4_component_images(c: canvas.Canvas, dynamic_data: Dict[str, str], page_width: float, page_height: float) -> None:
    """Zeigt bis zu drei Produktbilder (Module, WR, Speicher) auf Seite 4 an.

    Erwartet Base64 in Keys: module_image_b64, inverter_image_b64, storage_image_b64.
    Positionierung: linke Spalte Bilderblöcke oberhalb/links der jeweiligen Textblöcke,
    sodass die bestehenden Textfelder (aus seite4.yml) nicht überlagert werden.
    """
    try:
        images = [
            (dynamic_data.get("module_image_b64"), {
                "x": 50.0, "y_top": page_height - 250.0, "max_w": 140.0, "max_h": 90.0
            }),
            (dynamic_data.get("inverter_image_b64"), {
                "x": 50.0, "y_top": page_height - 440.0, "max_w": 140.0, "max_h": 90.0
            }),
            (dynamic_data.get("storage_image_b64"), {
                "x": 50.0, "y_top": page_height - 630.0, "max_w": 140.0, "max_h": 90.0
            }),
        ]
        for img_b64, pos in images:
            img = _as_image_reader(img_b64)
            if img is None:
                continue
            max_w = float(pos.get("max_w", 140.0))
            max_h = float(pos.get("max_h", 90.0))
            x = float(pos.get("x", 50.0))
            y_top = float(pos.get("y_top", page_height - 250.0))
            try:
                iw, ih = img.getSize()  # type: ignore
                scale = min(max_w / iw, max_h / ih)
                dw, dh = iw * scale, ih * scale
            except Exception:
                dw, dh = max_w, max_h
            y = y_top - dh
            c.saveState()
            try:
                c.drawImage(img, x, y, width=dw, height=dh, preserveAspectRatio=True, mask='auto')
            finally:
                c.restoreState()
    except Exception:
        return


def _remove_text_from_page(page, texts_to_remove: list[str]):
    """Entfernt spezifische Texte aus dem Content-Stream einer PDF-Seite."""
    try:
        if not hasattr(page, 'get_contents') or not texts_to_remove:
            return
            
        content = page.get_contents()
        if content is None:
            return
            
        # Content-Stream als String laden
        if hasattr(content, 'get_data'):
            content_data = content.get_data()
        else:
            content_data = content.read()
            
        if isinstance(content_data, bytes):
            try:
                content_str = content_data.decode('latin-1', errors='ignore')
            except Exception:
                return
        else:
            content_str = str(content_data)
            
        # Jeden zu entfernenden Text suchen und entfernen
        modified = False
        for text_to_remove in texts_to_remove:
            # Verschiedene PDF-Text-Encoding-Muster versuchen
            patterns = [
                f"({text_to_remove})Tj",
                f"({text_to_remove}) Tj",
                f"[{text_to_remove}]TJ",
                f"[{text_to_remove}] TJ",
            ]
            
            for pattern in patterns:
                if pattern in content_str:
                    # Text durch Leerzeichen ersetzen (gleiche Länge beibehalten)
                    replacement = "(" + " " * len(text_to_remove) + ")Tj"
                    content_str = content_str.replace(pattern, replacement)
                    modified = True
                    
        if modified:
            # Modifizierten Content zurückschreiben
            new_content = io.BytesIO(content_str.encode('latin-1', errors='ignore'))
            if hasattr(page, '_contents'):
                page._contents = new_content
                
    except Exception:
        pass  # Bei Fehlern einfach ignorieren


def merge_with_background(overlay_bytes: bytes, bg_dir: Path) -> bytes:
    """Verschmilzt das Overlay mit nt_nt_01.pdf … nt_nt_07.pdf aus bg_dir."""
    overlay_reader = PdfReader(io.BytesIO(overlay_bytes))
    writer = PdfWriter()
    for page_num in range(1, 8):
        # Unterstütze beide Muster: nt_nt_XX.pdf und nt_XX.pdf
        candidates = [bg_dir / f"nt_nt_{page_num:02d}.pdf", bg_dir / f"nt_{page_num:02d}.pdf"]
        bg_page = None
        for cand in candidates:
            if cand.exists():
                try:
                    bg_reader = PdfReader(str(cand))
                    bg_page = bg_reader.pages[0]
                    break
                except Exception:
                    continue
        # Fallback: Wenn kein Hintergrund vorhanden/lesbar ist, füge nur Overlay-Seite ein
        ov_page = overlay_reader.pages[page_num - 1]

        # Optional: Auf Seite 1 zusätzlich eine weitere statische PDF (haus.pdf) mergen
        # Reihenfolge: Basis (nt_nt_01.pdf) -> haus.pdf -> Overlay
        extra_bg_page = None
        if page_num == 1:
            haus_path = bg_dir / "haus.pdf"
            if haus_path.exists():
                try:
                    haus_reader = PdfReader(str(haus_path))
                    extra_bg_page = haus_reader.pages[0]
                except Exception:
                    extra_bg_page = None

        # Falls kein Standard-Hintergrund vorhanden ist, aber haus.pdf existiert, nutze diese als Basis
        base_page = bg_page
        if base_page is None and extra_bg_page is not None:
            base_page = extra_bg_page
            extra_bg_page = None  # bereits als Basis gesetzt

        if base_page is not None:
            # Seite 3: Problematische Legendentexte aus dem Hintergrund entfernen
            if page_num == 3:
                texts_to_remove = [
                    "",
                    "", 
                    "",
                    "",
                    ""
                ]
                _remove_text_from_page(base_page, texts_to_remove)
                
            # Falls eine zusätzliche Haus-Seite vorhanden ist, zuerst darüber legen (skaliert 30% und zentriert)
            if extra_bg_page is not None:
                try:
                    bw = float(base_page.mediabox.width)
                    bh = float(base_page.mediabox.height)
                    hw = float(extra_bg_page.mediabox.width)
                    hh = float(extra_bg_page.mediabox.height)
                    scale = 0.3  # 70% kleiner
                    tx = (bw - hw * scale) / 2.0
                    ty = (bh - hh * scale) / 2.0
                    t = Transformation().scale(scale, scale).translate(tx, ty)
                    base_page.merge_transformed_page(extra_bg_page, t)
                except Exception:
                    # Fallback: unskaliert mergen
                    try:
                        base_page.merge_page(extra_bg_page)
                    except Exception:
                        pass
            # Overlay über den zusammengesetzten Hintergrund legen
            base_page.merge_page(ov_page)
            writer.add_page(base_page)
        else:
            # Kein Standard-Hintergrund: nur haus.pdf (falls vorhanden) als Basis, skaliert, dann Overlay
            if extra_bg_page is not None and PageObject is not None:
                try:
                    # Erzeuge leere Basis-Seite in A4 (oder Größe des Overlay)
                    try:
                        bw = float(ov_page.mediabox.width)
                        bh = float(ov_page.mediabox.height)
                    except Exception:
                        bw, bh = A4
                    base = PageObject.create_blank_page(width=bw, height=bh)  # type: ignore
                    hw = float(extra_bg_page.mediabox.width)
                    hh = float(extra_bg_page.mediabox.height)
                    scale = 0.3
                    tx = (bw - hw * scale) / 2.0
                    ty = (bh - hh * scale) / 2.0
                    t = Transformation().scale(scale, scale).translate(tx, ty)
                    base.merge_transformed_page(extra_bg_page, t)
                    base.merge_page(ov_page)
                    writer.add_page(base)
                    continue
                except Exception:
                    pass
            # Fallback: nur Overlay
            writer.add_page(ov_page)
    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()


def append_additional_pages(base_pdf: bytes, additional_pdf: Optional[bytes]) -> bytes:
    """Hängt optional weitere Seiten hinten an."""
    if not additional_pdf:
        return base_pdf
    base_reader = PdfReader(io.BytesIO(base_pdf))
    add_reader = PdfReader(io.BytesIO(additional_pdf))
    writer = PdfWriter()
    for p in base_reader.pages:
        writer.add_page(p)
    for p in add_reader.pages:
        writer.add_page(p)
    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()


def generate_custom_offer_pdf(
    coords_dir: Path,
    bg_dir: Path,
    dynamic_data: Dict[str, str],
    additional_pdf: Optional[bytes] = None,
) -> bytes:
    """End-to-End-Erzeugung des Angebots: Overlay -> Merge -> Optional anhängen."""
    # Bestimme Gesamtseiten für Fußzeile (7 + ggf. Zusatzseiten)
    total_pages = 7
    if additional_pdf:
        try:
            add_reader = PdfReader(io.BytesIO(additional_pdf))
            total_pages = 7 + len(add_reader.pages)
        except Exception:
            total_pages = 7

    

