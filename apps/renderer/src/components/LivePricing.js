import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// apps/renderer/src/components/LivePricing.tsx
// Live pricing component for real-time cost calculations
import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
const LivePricingComponent = ({ baseResults, onPricingUpdate }) => {
    const [modifications, setModifications] = useState({
        discount_percent: 0,
        surcharge_percent: 0,
        additional_costs: 0,
        custom_prices: {}
    });
    const [pricingResults, setPricingResults] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };
    // Format percentage
    const formatPercent = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'percent',
            maximumFractionDigits: 1
        }).format(value / 100);
    };
    // Update pricing calculations
    const updatePricing = async () => {
        setIsUpdating(true);
        try {
            const calculationAPI = window.calculationAPI;
            if (!calculationAPI) {
                throw new Error('Calculation API not available');
            }
            const result = await calculationAPI.livePricing(baseResults, modifications);
            if (result.success) {
                setPricingResults(result.results);
                onPricingUpdate?.(result.results);
            }
            else {
                throw new Error(result.error || 'Pricing update failed');
            }
        }
        catch (error) {
            console.error('Live pricing error:', error);
        }
        finally {
            setIsUpdating(false);
        }
    };
    // Update pricing whenever modifications change
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            updatePricing();
        }, 300); // 300ms debounce
        return () => clearTimeout(debounceTimer);
    }, [modifications]);
    // Calculate preview values locally for immediate feedback
    const previewCalculations = () => {
        const basePrice = baseResults.total_investment_netto;
        const discountAmount = basePrice * (modifications.discount_percent / 100);
        const surchargeAmount = basePrice * (modifications.surcharge_percent / 100);
        const finalPrice = basePrice - discountAmount + surchargeAmount + modifications.additional_costs;
        return {
            finalPrice,
            discountAmount,
            surchargeAmount,
            priceChange: ((finalPrice - basePrice) / basePrice) * 100
        };
    };
    const preview = previewCalculations();
    // Pricing scenarios for quick selection
    const pricingScenarios = [
        { name: 'Standard', discount: 0, surcharge: 0, additional: 0 },
        { name: '5% Rabatt', discount: 5, surcharge: 0, additional: 0 },
        { name: '10% Rabatt', discount: 10, surcharge: 0, additional: 0 },
        { name: '15% Rabatt', discount: 15, surcharge: 0, additional: 0 },
        { name: 'Premium (+5%)', discount: 0, surcharge: 5, additional: 0 },
        { name: 'Zusatzkosten +2k€', discount: 0, surcharge: 0, additional: 2000 },
    ];
    return (_jsx("div", { className: "live-pricing", children: _jsxs(Card, { title: "\uD83D\uDCB0 Live-Preiskalkulation", className: "mb-4", children: [_jsxs("div", { className: "grid", children: [_jsx("div", { className: "col-12 md:col-6", children: _jsx(Panel, { header: "Preisanpassungen", className: "h-full", children: _jsxs("div", { className: "flex flex-column gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Rabatt: ", modifications.discount_percent, "%"] }), _jsx(Slider, { value: modifications.discount_percent, onChange: (e) => setModifications(prev => ({
                                                        ...prev,
                                                        discount_percent: e.value
                                                    })), min: 0, max: 50, step: 0.5, className: "w-full" }), _jsxs("div", { className: "text-sm text-500 mt-1", children: ["Ersparnis: ", formatCurrency(preview.discountAmount)] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Aufschlag: ", modifications.surcharge_percent, "%"] }), _jsx(Slider, { value: modifications.surcharge_percent, onChange: (e) => setModifications(prev => ({
                                                        ...prev,
                                                        surcharge_percent: e.value
                                                    })), min: 0, max: 30, step: 0.5, className: "w-full" }), _jsxs("div", { className: "text-sm text-500 mt-1", children: ["Mehrkosten: ", formatCurrency(preview.surchargeAmount)] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Zus\u00E4tzliche Kosten" }), _jsx(InputNumber, { value: modifications.additional_costs, onValueChange: (e) => setModifications(prev => ({
                                                        ...prev,
                                                        additional_costs: e.value || 0
                                                    })), mode: "currency", currency: "EUR", locale: "de-DE", className: "w-full", min: 0, max: 50000 })] }), _jsx(Divider, {}), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Schnell-Szenarien" }), _jsx("div", { className: "grid gap-2", children: pricingScenarios.map((scenario, index) => (_jsx("div", { className: "col-6 md:col-4", children: _jsx(Button, { label: scenario.name, size: "small", className: "w-full p-button-outlined", onClick: () => setModifications({
                                                                discount_percent: scenario.discount,
                                                                surcharge_percent: scenario.surcharge,
                                                                additional_costs: scenario.additional,
                                                                custom_prices: {}
                                                            }) }) }, index))) })] })] }) }) }), _jsx("div", { className: "col-12 md:col-6", children: _jsx(Panel, { header: "Aktualisierte Kalkulation", className: "h-full", children: _jsxs("div", { className: "flex flex-column gap-3", children: [_jsxs("div", { className: "p-3 border-round surface-card", children: [_jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "text-sm", children: "Ursprungspreis (netto):" }), _jsx("span", { className: "font-medium", children: formatCurrency(baseResults.total_investment_netto) })] }), modifications.discount_percent > 0 && (_jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsxs("span", { className: "text-sm text-green-600", children: ["Rabatt (", modifications.discount_percent, "%):"] }), _jsxs("span", { className: "font-medium text-green-600", children: ["-", formatCurrency(preview.discountAmount)] })] })), modifications.surcharge_percent > 0 && (_jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsxs("span", { className: "text-sm text-orange-600", children: ["Aufschlag (", modifications.surcharge_percent, "%):"] }), _jsxs("span", { className: "font-medium text-orange-600", children: ["+", formatCurrency(preview.surchargeAmount)] })] })), modifications.additional_costs > 0 && (_jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "text-sm text-red-600", children: "Zusatzkosten:" }), _jsxs("span", { className: "font-medium text-red-600", children: ["+", formatCurrency(modifications.additional_costs)] })] })), _jsx(Divider, { className: "my-2" }), _jsxs("div", { className: "flex justify-content-between align-items-center", children: [_jsx("span", { className: "font-bold", children: "Neuer Preis (netto):" }), _jsx("span", { className: "font-bold text-xl text-primary", children: formatCurrency(preview.finalPrice) })] }), _jsxs("div", { className: "flex justify-content-between align-items-center mt-2", children: [_jsx("span", { className: "text-sm", children: "Inkl. MwSt. (19%):" }), _jsx("span", { className: "font-medium", children: formatCurrency(preview.finalPrice * 1.19) })] }), preview.priceChange !== 0 && (_jsx("div", { className: "text-center mt-3", children: _jsx(Badge, { value: `${preview.priceChange > 0 ? '+' : ''}${formatPercent(preview.priceChange)}`, severity: preview.priceChange > 0 ? 'danger' : 'success', size: "large" }) }))] }), pricingResults && (_jsxs("div", { className: "p-3 border-round surface-card", children: [_jsx("h4", { className: "mt-0 mb-3", children: "Aktualisierte Kennzahlen" }), _jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "text-sm", children: "Neue Amortisation:" }), _jsx(Badge, { value: `${pricingResults.new_amortization_years.toFixed(1)} Jahre`, severity: pricingResults.new_amortization_years <= 12 ? 'success' : 'warning' })] }), _jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "text-sm", children: "Neue Rendite (ROI):" }), _jsx(Badge, { value: formatPercent(pricingResults.new_roi_percent), severity: pricingResults.new_roi_percent >= 8 ? 'success' : 'warning' })] }), _jsxs("div", { className: "text-xs text-500 mt-2", children: ["Aktualisiert: ", new Date(pricingResults.updated_at).toLocaleString('de-DE')] })] })), isUpdating && (_jsxs("div", { className: "text-center", children: [_jsx(ProgressBar, { mode: "indeterminate", className: "mb-2", style: { height: '6px' } }), _jsx("div", { className: "text-sm text-500", children: "Kalkulation wird aktualisiert..." })] }))] }) }) })] }), _jsxs("div", { className: "text-center mt-4", children: [_jsx(Button, { label: "Kalkulation zur\u00FCcksetzen", icon: "pi pi-refresh", className: "p-button-outlined mr-2", onClick: () => setModifications({
                                discount_percent: 0,
                                surcharge_percent: 0,
                                additional_costs: 0,
                                custom_prices: {}
                            }) }), _jsx(Button, { label: "Neue Kalkulation als PDF", icon: "pi pi-file-pdf", severity: "success", onClick: () => {
                                // TODO: Generate PDF with updated pricing
                                console.log('Generate PDF with pricing:', pricingResults);
                            } })] })] }) }));
};
export default LivePricingComponent;
