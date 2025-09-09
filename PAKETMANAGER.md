# Kakerlake - Paketmanager-Dokumentation

## Paketmanager-Standardisierung (9. September 2025)

Dieses Projekt wurde auf pnpm als standardmäßigen Paketmanager umgestellt. Bitte verwenden Sie **ausschließlich pnpm** für die Installation und Verwaltung von Abhängigkeiten.

## Installation

1. Globale pnpm-Installation (falls noch nicht vorhanden):

   ```bash
   npm install -g pnpm
   ```

2. Abhängigkeiten installieren:

   ```bash
   pnpm install
   ```

## Entwicklung starten

Verwenden Sie die folgenden Befehle, um die Anwendung zu starten:

```bash
pnpm dev        # Startet sowohl Renderer als auch Main-Anwendung
pnpm dev:renderer  # Startet nur die Frontend-Anwendung
pnpm dev:main     # Startet nur die Electron-Hauptanwendung
```

## Anmerkungen zur Migration

Die vorherigen `package-lock.json` und `yarn.lock` wurden entfernt, um Konflikte zu vermeiden. Das Projekt verwendet jetzt die `pnpm-lock.yaml` als zentrale Lock-Datei.

Falls Sie Probleme mit der pnpm-Installation haben:

- Schließen Sie VS Code und alle laufenden Node-Prozesse
- Führen Sie das mitgelieferte Migrationsskript aus:

  ```powershell
  ./migrate-to-pnpm.ps1
  ```

## Projektstruktur

Das Projekt ist als Monorepo mit Workspaces organisiert:

- `apps/main`: Electron-Hauptanwendung
- `apps/renderer`: Frontend-Anwendung (React)
- `packages/`: Gemeinsame Pakete
