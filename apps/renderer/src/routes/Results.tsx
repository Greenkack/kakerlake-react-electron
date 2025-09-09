import React, { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Chip } from 'primereact/chip';
import { useProject } from '../state/project';
import { Link } from 'react-router-dom';
import WizardNav from '../components/WizardNav';
import SmartRecommendations from '../components/SmartRecommendations';
import InteractiveCalculator from '../components/InteractiveCalculator';
import { calculatePVSystem } from '../utils/calculations';
import { usePvCalculations } from '../utils/pvCalculations';
import { formatGermanNumber, formatGermanCurrency, formatGermanInteger, formatGermanKWh, formatGermanKWp, formatGermanPercent } from '../utils/germanFormat';

// KPI Component für PrimeReact
function Kpi({ label, value, icon = '', color = 'primary' }: { label: string; value: React.ReactNode; icon?: string; color?: string }) {
    return (
        <Card className={`text-center surface-${color === 'primary' ? '100' : color}`}>
            <div className="flex flex-column align-items-center">
                <i className={`${icon} text-3xl text-${color} mb-2`}></i>
                <div className="text-2xl font-bold text-900 mb-2">{value}</div>
                <div className="text-sm text-600">{label}</div>
            </div>
        </Card>
    );
}

export default function Results() {
    const { state } = useProject();
    const { mode, customer: c, building, consumption, options } = state;
    
    // DIREKTER localStorage Zugriff für Berechnungen
    const savedCalculations = React.useMemo(() => {
        try {
            const stored = localStorage.getItem('kakerlake_solar_calculations');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Error loading calculations:', e);
            return null;
        }
    }, []);

    // Results aus gespeicherten Berechnungen oder Fallback
    const results = savedCalculations?.results || {
        anlage_kwp: 10.0,
        annual_pv_production_kwh: 12000,
        self_consumption_rate_percent: 70,
        autarky_rate_percent: 80,
        annual_savings_euro: 2400,
        payback_time_years: 8,
        total_investment_brutto: 24000,
        total_investment_netto: 20168,
        autarkiegrad_prozent: 80,
        jahres_ersparnis_eur: 2400,
        break_even_jahr: 8,
        pv_strompreis_ct_kwh: 12.5,
        speichergrad_prozent: 60,
        notstrom_kapazitaet_kwh_tag: 15.2
    };

    // Live-Berechnungen basierend auf gespeicherten Daten ODER Fallback-Daten
    const calculations = useMemo(() => {
        // Berechnungsparameter aus echten Formulardaten zusammenstellen
        const params = {
            // System-Parameter aus Building Data
            systemSize: building.roofArea ? Math.min(building.roofArea * 0.15, 20) : 10, // kWp basierend auf Dachfläche
            modulePower: 440, // Wp
            orientation: building.roofOrientation || "Süd",
            tilt: building.roofTilt || 30,
            location: c.bundesland || "Deutschland",
            // Verbrauchsdaten aus Consumption Analysis
            annualConsumption: consumption.annualKWhHousehold || 4000, // kWh
            daytimeConsumption: consumption.homeOfficeHours ?
                Math.min(0.6, 0.3 + (consumption.homeOfficeHours / 8) * 0.3) : 0.4,
            // Speicher aus Options
            hasBattery: options.battery_interest || false,
            batterySize: options.battery_size_preference === "small" ? 5 :
                options.battery_size_preference === "medium" ? 10 :
                    options.battery_size_preference === "large" ? 15 :
                        options.battery_size_preference === "very_large" ? 20 : 10,
            // Wärmepumpe aus Options
            hasHeatPump: options.hp_interest || false,
            heatingDemand: consumption.annualKWhHeating || 0,
            // Wirtschaftliche Parameter
            electricityPrice: 0.35,
            feedInTariff: 0.08
        };
        return calculatePVSystem(params);
    }, [c.bundesland, building, consumption, options]);

    const systemOverviewHeader = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-bolt text-primary"></i>
            <span>System-Übersicht</span>
        </div>
    );

    const energyYieldHeader = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-chart-line text-green-500"></i>
            <span>Energieerträge</span>
        </div>
    );

    const economicsHeader = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-money-bill text-primary"></i>
            <span>Wirtschaftlichkeit</span>
        </div>
    );

    const environmentalHeader = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-globe text-green-500"></i>
            <span>Umweltbeitrag</span>
        </div>
    );

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-900 mb-2">
                    <i className="pi pi-chart-bar mr-2"></i>
                    Projektergebnisse
                </h1>
                <p className="text-600 text-lg">
                    {savedCalculations ? 
                        `Berechnung vom ${new Date(savedCalculations.timestamp).toLocaleString('de-DE')}` : 
                        'Demo-Daten (keine Berechnungen gefunden)'
                    }
                </p>
                
                {!savedCalculations && (
                    <div className="mb-4">
                        <Card className="bg-orange-100 border-orange-300">
                            <div className="flex align-items-center gap-2 text-orange-800">
                                <i className="pi pi-exclamation-triangle"></i>
                                <span>Keine Berechnungen gefunden. Gehen Sie zum Solar-Kalkulator und führen Sie eine Berechnung durch.</span>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* System-Übersicht */}
            <Card title={systemOverviewHeader} className="mb-4 surface-100">
                <div className="grid">
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Anlagengröße" 
                            value={formatGermanKWp(calculations.finalSystemSize)}
                            icon="pi pi-cog"
                            color="primary"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Module (440Wp)" 
                            value={formatGermanInteger(calculations.moduleCount)}
                            icon="pi pi-th-large"
                            color="green-500"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Dachnutzung" 
                            value={formatGermanPercent(calculations.roofUtilization)}
                            icon="pi pi-percentage"
                            color="orange-500"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Investition" 
                            value={formatGermanCurrency(calculations.systemCost, 0)}
                            icon="pi pi-euro"
                            color="purple-500"
                        />
                    </div>
                </div>
            </Card>

            {/* Energieerträge */}
            <Card title={energyYieldHeader} className="mb-4">
                <div className="grid mb-4">
                    <div className="col-12 md:col-4">
                        <Card className="text-center surface-green-100 h-full">
                            <i className="pi pi-calendar text-4xl text-green-500 mb-3"></i>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {formatGermanKWh(calculations.annualYield)}
                            </div>
                            <div className="text-600">pro Jahr</div>
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card className="text-center surface-blue-100 h-full">
                            <i className="pi pi-chart-pie text-4xl text-blue-500 mb-3"></i>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {formatGermanKWh(calculations.monthlyYield)}
                            </div>
                            <div className="text-600">pro Monat</div>
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card className="text-center surface-orange-100 h-full">
                            <i className="pi pi-sun text-4xl text-orange-500 mb-3"></i>
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {formatGermanKWh(calculations.dailyYield)}
                            </div>
                            <div className="text-600">pro Tag</div>
                        </Card>
                    </div>
                </div>

                {/* Erweiterte Kennzahlen */}
                <h3 className="text-xl font-semibold mb-3">Erweiterte Wirtschaftlichkeits-Kennzahlen</h3>
                <div className="grid">
                    <div className="col-12 md:col-4 lg:col-3">
                        <Kpi label="Autarkiegrad" value={formatGermanPercent(results.autarkiegrad_prozent ?? 0)} icon="pi pi-chart-line" />
                    </div>
                    <div className="col-12 md:col-4 lg:col-3">
                        <Kpi label="Jährliche Ersparnis" value={formatGermanCurrency(results.jahres_ersparnis_eur ?? 0)} icon="pi pi-money-bill" />
                    </div>
                    <div className="col-12 md:col-4 lg:col-3">
                        <Kpi label="Break-Even (Jahr)" value={results.break_even_jahr ?? "—"} icon="pi pi-clock" />
                    </div>
                    <div className="col-12 md:col-4 lg:col-3">
                        <Kpi label="PV-Strompreis" value={formatGermanNumber(results.pv_strompreis_ct_kwh ?? 0, 2) + " ct/kWh"} icon="pi pi-bolt" />
                    </div>
                    <div className="col-12 md:col-4 lg:col-3">
                        <Kpi label="Speichergrad" value={formatGermanPercent(results.speichergrad_prozent ?? 0)} icon="pi pi-battery" />
                    </div>
                    <div className="col-12 md:col-4 lg:col-3">
                        <Kpi label="Notstrom Kapazität / Tag" value={formatGermanNumber(results.notstrom_kapazitaet_kwh_tag ?? 0, 2) + " kWh"} icon="pi pi-shield" />
                    </div>
                </div>

                <Divider />

                {/* Verbrauchs-Breakdown */}
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <Card title="🏠 Eigenverbrauch" className="h-full">
                            <div className="space-y-3">
                                <div className="flex justify-content-between align-items-center">
                                    <span>Direkt verbraucht:</span>
                                    <Chip label={`${calculations.breakdown.directConsumption.toLocaleString('de-DE')} kWh`} className="bg-green-100 text-green-800" />
                                </div>
                                <div className="flex justify-content-between align-items-center">
                                    <span>Aus Speicher:</span>
                                    <Chip label={`${calculations.breakdown.fromBattery.toLocaleString('de-DE')} kWh`} className="bg-blue-100 text-blue-800" />
                                </div>
                                <Divider />
                                <div className="flex justify-content-between align-items-center font-bold">
                                    <span>Gesamt ({calculations.selfConsumptionRate.toFixed(1)}%):</span>
                                    <Badge value={`${calculations.selfConsumption.toLocaleString('de-DE')} kWh`} severity="success" size="large" />
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 md:col-6">
                        <Card title="🌐 Netzinteraktion" className="h-full">
                            <div className="space-y-3">
                                <div className="flex justify-content-between align-items-center">
                                    <span>Einspeisung:</span>
                                    <Chip label={`${calculations.feedIn.toLocaleString('de-DE')} kWh`} className="bg-orange-100 text-orange-800" />
                                </div>
                                <div className="flex justify-content-between align-items-center">
                                    <span>Netzbezug:</span>
                                    <Chip label={`${calculations.breakdown.fromGrid.toLocaleString('de-DE')} kWh`} className="bg-red-100 text-red-800" />
                                </div>
                                <Divider />
                                <div className="flex justify-content-between align-items-center font-bold">
                                    <span>Autarkie:</span>
                                    <Badge value={`${calculations.autarkyRate?.toFixed(1)}%`} severity="info" size="large" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>

            {/* Wirtschaftlichkeit */}
            <Card title={economicsHeader} className="mb-4 surface-green-50">
                <div className="grid">
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Ersparnis/Jahr" 
                            value={`${calculations.annualSavings.toLocaleString('de-DE')} €`}
                            icon="pi pi-money-bill"
                            color="green-500"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Jahre Amortisation" 
                            value={calculations.paybackTime.toFixed(1)}
                            icon="pi pi-clock"
                            color="blue-500"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="Gewinn 20 Jahre" 
                            value={`${calculations.roi20Years.toLocaleString('de-DE')} €`}
                            icon="pi pi-trending-up"
                            color="purple-500"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Kpi 
                            label="ROI 20 Jahre" 
                            value={`${(calculations.roi20Years / calculations.systemCost * 100).toFixed(0)}%`}
                            icon="pi pi-percentage"
                            color="orange-500"
                        />
                    </div>
                </div>
            </Card>

            {/* Umweltbeitrag */}
            <Card title={environmentalHeader} className="mb-4 surface-green-50">
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <Kpi 
                            label="CO₂-Einsparung/Jahr" 
                            value={`${calculations.co2SavingsAnnual.toLocaleString('de-DE')} kg`}
                            icon="pi pi-globe"
                            color="green-500"
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <Kpi 
                            label="CO₂-Einsparung 20 Jahre" 
                            value={`${(calculations.co2Savings20Years / 1000).toFixed(1)} t`}
                            icon="pi pi-heart"
                            color="teal-500"
                        />
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="text-600">
                        Das entspricht ca. <strong>{Math.round(calculations.co2SavingsAnnual / 2300)} Bäumen</strong> pro Jahr oder{' '}
                        <strong>{Math.round(calculations.co2SavingsAnnual / 140)} weniger Autokilometern</strong>
                    </p>
                </div>
            </Card>

            {/* Komponenten temporär entfernt für bessere Debugging */}
            <div className="text-center p-4">
                <Button 
                    label="Zurück zum Solar-Kalkulator" 
                    icon="pi pi-arrow-left"
                    className="p-button-success"
                    onClick={() => window.location.href = '/solar-calculator'}
                />
            </div>
            
            <WizardNav />
        </div>
    );
}
