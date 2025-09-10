import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Timeline } from 'primereact/timeline';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import CalculationDashboard from "../components/CalculationDashboard";
import CalculationResults from "../components/CalculationResults";
import LivePricing from "../components/LivePricing";
export default function CalculationProgress() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [calculationResults, setCalculationResults] = useState(null);
    const steps = [
        {
            id: 1,
            title: 'Konfiguration validieren',
            icon: 'pi-check-circle',
            description: 'System-Einstellungen und Daten prüfen'
        },
        {
            id: 2,
            title: 'Python-Bridge aktivieren',
            icon: 'pi-sync',
            description: 'Verbindung zu Berechnungsmodul herstellen'
        },
        {
            id: 3,
            title: 'Berechnungen durchführen',
            icon: 'pi-calculator',
            description: 'PV-Anlagen-Berechnungen und Simulationen'
        },
        {
            id: 4,
            title: 'Ergebnisse aufbereiten',
            icon: 'pi-chart-line',
            description: 'Charts und KPIs generieren'
        },
        {
            id: 5,
            title: 'Live-Pricing aktivieren',
            icon: 'pi-money-bill',
            description: 'Interaktive Preismodifikationen bereitstellen'
        }
    ];
    // Simulation des Berechnungsfortschritts
    useEffect(() => {
        if (isCalculating) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + Math.random() * 15;
                    if (newProgress >= 100) {
                        setIsCalculating(false);
                        setCurrentStep(4);
                        return 100;
                    }
                    return newProgress;
                });
                setCurrentStep(prev => {
                    const step = Math.floor(progress / 20);
                    return Math.min(step, 4);
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isCalculating, progress]);
    const startCalculation = () => {
        setIsCalculating(true);
        setProgress(0);
        setCurrentStep(0);
    };
    const timelineEvents = steps.map((step, index) => ({
        status: index <= currentStep ? 'Abgeschlossen' : index === currentStep + 1 ? 'Aktiv' : 'Ausstehend',
        date: index <= currentStep ? new Date().toLocaleTimeString() : '',
        icon: step.icon,
        color: index <= currentStep ? '#10b981' : index === currentStep + 1 ? '#3b82f6' : '#6b7280',
        title: step.title,
        description: step.description
    }));
    const customizedMarker = (item) => (_jsx("span", { className: `flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1 ${item.color === '#10b981' ? 'bg-green-500' :
            item.color === '#3b82f6' ? 'bg-blue-500' : 'bg-gray-400'}`, children: _jsx("i", { className: `pi ${item.icon}` }) }));
    const customizedContent = (item) => (_jsx(Card, { className: "mt-3 shadow-1", children: _jsxs("div", { className: "flex justify-content-between align-items-start", children: [_jsxs("div", { children: [_jsx("h6", { className: "mt-0 mb-1", children: item.title }), _jsx("p", { className: "text-600 text-sm", children: item.description })] }), _jsxs("div", { className: "text-right", children: [_jsx(Badge, { value: item.status, severity: item.status === 'Abgeschlossen' ? 'success' :
                                item.status === 'Aktiv' ? 'info' : 'secondary' }), item.date && _jsx("p", { className: "text-xs text-500 mt-1", children: item.date })] })] }) }));
    return (_jsxs("div", { className: "space-y-4 p-3", children: [_jsx(Card, { className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none", children: _jsxs("div", { className: "text-center", children: [_jsxs("h1", { className: "text-3xl font-bold mb-2 flex align-items-center justify-content-center gap-2", children: [_jsx("i", { className: "pi pi-cog pi-spin" }), "Berechnungs-Pipeline"] }), _jsx("p", { className: "text-blue-100 text-lg", children: "Verfolgen Sie den Fortschritt Ihrer PV-Berechnungen in Echtzeit" })] }) }), _jsx(Card, { title: "\uD83D\uDCCA System-Status", className: "w-full", children: _jsx(CalculationDashboard, {}) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(Card, { title: "\uD83D\uDD04 Pipeline-Status", className: "w-full", children: _jsx(Timeline, { value: timelineEvents, align: "left", className: "customized-timeline", marker: customizedMarker, content: customizedContent }) }), _jsx(Card, { title: "\u26A1 Berechnungssteuerung", className: "w-full", children: _jsxs("div", { className: "space-y-4", children: [_jsxs(Panel, { header: "Fortschritt", className: "w-full", children: [_jsxs("div", { className: "flex align-items-center gap-3 mb-3", children: [_jsx("div", { className: "flex-1", children: _jsx(ProgressBar, { value: progress, className: "h-1rem", pt: {
                                                            value: {
                                                                className: progress === 100 ? 'bg-green-400' : 'bg-blue-400'
                                                            }
                                                        } }) }), _jsx(Badge, { value: `${Math.round(progress)}%`, severity: progress === 100 ? "success" : progress >= 50 ? "info" : "warning" })] }), _jsxs("div", { className: "flex justify-content-between text-sm", children: [_jsxs("span", { className: "text-600", children: ["Schritt ", currentStep + 1, " von ", steps.length] }), _jsx(Chip, { label: steps[currentStep]?.title || 'Bereit', className: "p-chip-outlined" })] })] }), _jsx(Panel, { header: "Aktionen", className: "w-full", children: _jsxs("div", { className: "flex flex-column gap-3", children: [!isCalculating && progress < 100 && (_jsx(Button, { label: "Berechnungen starten", icon: "pi pi-play", onClick: startCalculation, className: "p-button-success" })), isCalculating && (_jsx("div", { className: "flex align-items-center gap-2", children: _jsx(Button, { label: "L\u00E4uft...", icon: "pi pi-spinner pi-spin", disabled: true, className: "flex-1" }) })), progress === 100 && (_jsxs(_Fragment, { children: [_jsx(Message, { severity: "success", text: "\u2705 Berechnungen erfolgreich abgeschlossen!" }), _jsx(Button, { label: "Ergebnisse anzeigen", icon: "pi pi-eye", className: "p-button-outlined" }), _jsx(Button, { label: "Neu berechnen", icon: "pi pi-refresh", onClick: () => {
                                                            setProgress(0);
                                                            setCurrentStep(0);
                                                        }, className: "p-button-text" })] }))] }) }), isCalculating && (_jsx(Panel, { header: "Details", className: "w-full", children: _jsx("div", { className: "space-y-2", children: steps.slice(0, currentStep + 2).map((step, index) => (_jsxs("div", { className: "flex align-items-center gap-2", children: [index <= currentStep ? (_jsx("i", { className: "pi pi-check text-green-600" })) : index === currentStep + 1 ? (_jsx("i", { className: "pi pi-spinner pi-spin text-blue-600" })) : (_jsx("i", { className: "pi pi-clock text-gray-400" })), _jsx("span", { className: `text-sm ${index <= currentStep ? 'text-green-700' :
                                                        index === currentStep + 1 ? 'text-blue-700' : 'text-gray-500'}`, children: step.title })] }, step.id))) }) }))] }) })] }), progress === 100 && calculationResults && (_jsxs(_Fragment, { children: [_jsx(Card, { title: "\uD83D\uDCC8 Berechnungsergebnisse", className: "w-full", children: _jsx(CalculationResults, { results: calculationResults }) }), _jsx(Card, { title: "\uD83D\uDCB0 Live-Preismodifikation", className: "w-full", children: _jsx(LivePricing, { baseResults: calculationResults }) })] })), progress === 100 && !calculationResults && (_jsxs(Card, { title: "\uD83D\uDCCA Berechnungen abgeschlossen", className: "w-full", children: [_jsx(Message, { severity: "info", text: "Berechnungen wurden erfolgreich durchgef\u00FChrt. Ergebnisse werden im Hauptmodul angezeigt." }), _jsx("div", { className: "mt-3", children: _jsx(Button, { label: "Zu den Ergebnissen", icon: "pi pi-arrow-right", onClick: () => window.location.href = '/results', className: "p-button-outlined" }) })] })), isCalculating && (_jsx(Card, { title: "\uD83D\uDCCA Ergebnisse werden vorbereitet...", className: "w-full", children: _jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { width: "100%", height: "4rem" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsx(Skeleton, { width: "100%", height: "8rem" }), _jsx(Skeleton, { width: "100%", height: "8rem" })] }), _jsx(Skeleton, { width: "100%", height: "6rem" })] }) }))] }));
}
