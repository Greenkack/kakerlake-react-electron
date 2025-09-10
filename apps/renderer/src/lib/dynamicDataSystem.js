/**
 * DYNAMIC DATA SYSTEM - Alle App-Daten sind individuell steuerbar
 *
 * Jedes Element in der App hat:
 * - Eindeutigen Key
 * - Byte-Größe für PDF
 * - PDF-Anzeige-Flag
 * - Wert/Daten
 * - Kategorie
 * - Beschreibung
 */
export class DynamicDataManager {
    data = new Map();
    categories = new Map();
    constructor() {
        this.initializeCategories();
    }
    initializeCategories() {
        const categories = [
            { key: 'customer', label: 'Kundendaten', description: 'Alle Kundenstammdaten und Kontaktinformationen' },
            { key: 'building', label: 'Gebäudedaten', description: 'Gebäudeeigenschaften und technische Daten' },
            { key: 'consumption', label: 'Verbrauchsdaten', description: 'Energieverbrauch und Kostenanalyse' },
            { key: 'system', label: 'Anlagendaten', description: 'PV-System und Komponenten' },
            { key: 'battery', label: 'Speichersystem', description: 'Batteriespeicher und Backup-Systeme' },
            { key: 'heatpump', label: 'Wärmepumpe', description: 'Wärmepumpensystem und -integration' },
            { key: 'wallbox', label: 'Wallbox', description: 'Ladestation und E-Mobilität' },
            { key: 'calculations', label: 'Berechnungen', description: 'Alle Kalkulationen und Szenarien' },
            { key: 'economics', label: 'Wirtschaftlichkeit', description: 'Kosten, Einsparungen und ROI' },
            { key: 'charts', label: 'Diagramme', description: 'Grafiken und Visualisierungen' },
            { key: 'scenarios', label: 'Szenarien', description: 'Vergleichsszenarien und Simulationen' },
            { key: 'options', label: 'Optionen', description: 'Zusatzoptionen und Erweiterungen' },
            { key: 'results', label: 'Ergebnisse', description: 'Endergebnisse und Empfehlungen' },
        ];
        categories.forEach(cat => {
            this.categories.set(cat.key, {
                ...cat,
                totalBytes: 0,
                items: []
            });
        });
    }
    // Daten hinzufügen oder aktualisieren
    setData(key, value, options) {
        const pdfBytes = this.calculateBytes(value, options.dataType);
        const item = {
            key,
            value,
            category: options.category,
            label: options.label,
            description: options.description,
            pdfBytes,
            includedInPdf: options.includedInPdf ?? true,
            dataType: options.dataType,
            priority: options.priority ?? 'medium',
            lastUpdated: new Date()
        };
        this.data.set(key, item);
        this.updateCategory(options.category, item);
        return item;
    }
    // Bytes berechnen basierend auf Datentyp
    calculateBytes(value, dataType) {
        switch (dataType) {
            case 'string':
                return (value?.toString().length || 0) * 2; // Unicode
            case 'number':
                return 8; // 64-bit number
            case 'boolean':
                return 1;
            case 'array':
                return JSON.stringify(value).length * 2;
            case 'object':
                return JSON.stringify(value).length * 2;
            case 'calculation':
                return 256; // Estimated for calculation results
            case 'chart':
                return 2048; // Estimated for chart data
            case 'image':
                return 10240; // Estimated for images
            default:
                return 64;
        }
    }
    // Kategorie aktualisieren
    updateCategory(categoryKey, item) {
        const category = this.categories.get(categoryKey);
        if (category) {
            // Vorhandenes Item aktualisieren oder neues hinzufügen
            const existingIndex = category.items.findIndex(i => i.key === item.key);
            if (existingIndex >= 0) {
                category.items[existingIndex] = item;
            }
            else {
                category.items.push(item);
            }
            // Bytes neu berechnen
            category.totalBytes = category.items.reduce((sum, item) => sum + item.pdfBytes, 0);
        }
    }
    // Daten abrufen
    getData(key) {
        return this.data.get(key);
    }
    // Alle Daten einer Kategorie
    getCategoryData(categoryKey) {
        return this.categories.get(categoryKey);
    }
    // Alle Kategorien
    getAllCategories() {
        return Array.from(this.categories.values());
    }
    // PDF-Einstellungen setzen
    setPdfInclusion(key, included) {
        const item = this.data.get(key);
        if (item) {
            item.includedInPdf = included;
            this.updateCategory(item.category, item);
        }
    }
    // Für PDF ausgewählte Daten
    getPdfData() {
        return Array.from(this.data.values()).filter(item => item.includedInPdf);
    }
    // Gesamte PDF-Bytes berechnen
    getTotalPdfBytes() {
        return this.getPdfData().reduce((sum, item) => sum + item.pdfBytes, 0);
    }
    // Szenarien generieren
    generateScenarios() {
        const baseData = this.getData('consumption.annual_kwh')?.value || 4000;
        const hasWallbox = this.getData('options.wallbox_interest')?.value || false;
        const hasHeatpump = this.getData('options.hp_interest')?.value || false;
        const hasBattery = this.getData('options.battery_interest')?.value || false;
        const scenarios = [
            {
                key: 'base_scenario',
                label: 'Basis-Szenario',
                consumption: baseData,
                description: 'Aktueller Verbrauch ohne Erweiterungen'
            },
            {
                key: 'optimistic_scenario',
                label: 'Optimistisches Szenario',
                consumption: baseData * 0.9,
                description: 'Mit Effizienzmaßnahmen (-10% Verbrauch)'
            },
            {
                key: 'pessimistic_scenario',
                label: 'Worst-Case Szenario',
                consumption: baseData * 1.2,
                description: 'Erhöhter Verbrauch (+20%)'
            }
        ];
        if (hasWallbox) {
            scenarios.push({
                key: 'wallbox_scenario',
                label: 'Mit E-Auto Szenario',
                consumption: baseData + 3000,
                description: 'Zusätzlich 3.000 kWh für Elektroauto'
            });
        }
        if (hasHeatpump) {
            scenarios.push({
                key: 'heatpump_scenario',
                label: 'Mit Wärmepumpe Szenario',
                consumption: baseData + 4500,
                description: 'Zusätzlich 4.500 kWh für Wärmepumpe'
            });
        }
        if (hasWallbox && hasHeatpump) {
            scenarios.push({
                key: 'full_electric_scenario',
                label: 'Voll-Elektrifizierung',
                consumption: baseData + 3000 + 4500,
                description: 'E-Auto + Wärmepumpe (maximaler Bedarf)'
            });
        }
        // Szenarien in System speichern
        scenarios.forEach(scenario => {
            this.setData(`scenario.${scenario.key}`, scenario, {
                category: 'scenarios',
                label: scenario.label,
                description: scenario.description,
                dataType: 'object',
                priority: 'high'
            });
        });
        return scenarios;
    }
    // Export für PDF/Reporting
    exportForPdf() {
        const pdfData = this.getPdfData();
        const categorized = {};
        pdfData.forEach(item => {
            if (!categorized[item.category]) {
                categorized[item.category] = [];
            }
            categorized[item.category].push({
                key: item.key,
                label: item.label,
                value: item.value,
                description: item.description,
                bytes: item.pdfBytes
            });
        });
        return {
            categories: categorized,
            totalBytes: this.getTotalPdfBytes(),
            generatedAt: new Date(),
            scenarios: this.generateScenarios()
        };
    }
    // Reset/Clear
    clear() {
        this.data.clear();
        this.initializeCategories();
    }
}
// Globale Instanz
export const dynamicData = new DynamicDataManager();
// Hook für React Components
export const useDynamicData = () => {
    return {
        setData: (key, value, options) => dynamicData.setData(key, value, options),
        getData: (key) => dynamicData.getData(key),
        getAllCategories: () => dynamicData.getAllCategories(),
        setPdfInclusion: (key, included) => dynamicData.setPdfInclusion(key, included),
        getPdfData: () => dynamicData.getPdfData(),
        getTotalPdfBytes: () => dynamicData.getTotalPdfBytes(),
        generateScenarios: () => dynamicData.generateScenarios(),
        exportForPdf: () => dynamicData.exportForPdf()
    };
};
