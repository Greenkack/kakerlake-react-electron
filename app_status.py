# Zentrale Sammelstelle für Import-/Start-Fehler
# Von locales.py optional importiert, um Warnungen/Fehler global zu sammeln.

from typing import List

# Liste, in die Module ihre Importfehler eintragen können
import_errors: List[str] = []

# Optional: Hilfsfunktion zum Hinzufügen

def add_error(msg: str) -> None:
    try:
        import_errors.append(str(msg))
    except Exception:
        pass
