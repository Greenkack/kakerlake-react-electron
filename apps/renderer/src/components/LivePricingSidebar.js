import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/renderer/src/components/LivePricingSidebar.tsx
// Sidebar-Komponente für Live-Preisberechnung mit AppContext Integration
import { useEffect } from 'react';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { usePricing, useCalculationResults } from '../context/AppContext';
/**
 * Sidebar-Komponente für die Live-Preisberechnung.
 *
 * Diese Komponente stellt Eingabefelder für Rabatt und Aufschlag bereit und
 * berechnet den finalen Preis basierend auf dem Basispreis aus dem Context.
 */
export const LivePricingSidebar = ({ className = '', showTitle = true, compact = false }) => {
    const { pricing, updatePricing } = usePricing();
    const { results } = useCalculationResults();
    // Aktualisiere Basispreis aus Calculation Results
    useEffect(() => {
        if (results?.total_investment_netto && results.total_investment_netto !== pricing.baseCost) {
            updatePricing({ baseCost: results.total_investment_netto });
        }
    }, [results?.total_investment_netto, pricing.baseCost, updatePricing]);
    const handleDiscountChange = (value) => {
        updatePricing({ discountPercent: value || 0 });
    };
    const handleSurchargeChange = (value) => {
        updatePricing({ surchargePercent: value || 0 });
    };
    const handleAdditionalCostsChange = (value) => {
        updatePricing({ additionalCosts: value || 0 });
    };
    const resetPricing = () => {
        updatePricing({
            discountPercent: 0,
            surchargePercent: 0,
            additionalCosts: 0
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };
    const priceChangePercent = pricing.baseCost > 0
        ? ((pricing.finalPrice - pricing.baseCost) / pricing.baseCost) * 100
        : 0;
    const content = (_jsxs("div", { className: "pricing-sidebar-content", children: [_jsxs("div", { className: "field mb-4", children: [_jsx("label", { className: "font-semibold text-sm mb-2 block", children: "Basispreis (Netto)" }), _jsx("div", { className: "bg-gray-50 p-3 border-round", children: _jsx("span", { className: "text-xl font-bold text-primary", children: formatCurrency(pricing.baseCost) }) })] }), _jsxs("div", { className: "field mb-4", children: [_jsx("label", { htmlFor: "discount", className: "font-semibold text-sm mb-2 block", children: "Rabatt (%)" }), _jsx("div", { className: "p-inputgroup", children: _jsx(InputNumber, { id: "discount", value: pricing.discountPercent, min: 0, max: 50, maxFractionDigits: 1, onValueChange: (e) => handleDiscountChange(e.value), suffix: "%", showButtons: !compact, buttonLayout: "horizontal", incrementButtonIcon: "pi pi-plus", decrementButtonIcon: "pi pi-minus", className: "w-full" }) }), !compact && (_jsx(Slider, { value: pricing.discountPercent, onChange: (e) => handleDiscountChange(Array.isArray(e.value) ? e.value[0] : e.value), min: 0, max: 50, step: 0.5, className: "mt-2" }))] }), _jsxs("div", { className: "field mb-4", children: [_jsx("label", { htmlFor: "surcharge", className: "font-semibold text-sm mb-2 block", children: "Aufschlag (%)" }), _jsx("div", { className: "p-inputgroup", children: _jsx(InputNumber, { id: "surcharge", value: pricing.surchargePercent, min: 0, max: 50, maxFractionDigits: 1, onValueChange: (e) => handleSurchargeChange(e.value), suffix: "%", showButtons: !compact, buttonLayout: "horizontal", incrementButtonIcon: "pi pi-plus", decrementButtonIcon: "pi pi-minus", className: "w-full" }) }), !compact && (_jsx(Slider, { value: pricing.surchargePercent, onChange: (e) => handleSurchargeChange(Array.isArray(e.value) ? e.value[0] : e.value), min: 0, max: 50, step: 0.5, className: "mt-2" }))] }), _jsxs("div", { className: "field mb-4", children: [_jsx("label", { htmlFor: "additional", className: "font-semibold text-sm mb-2 block", children: "Zusatzkosten (\u20AC)" }), _jsx(InputNumber, { id: "additional", value: pricing.additionalCosts, min: 0, maxFractionDigits: 2, onValueChange: (e) => handleAdditionalCostsChange(e.value), mode: "currency", currency: "EUR", locale: "de-DE", showButtons: !compact, buttonLayout: "horizontal", incrementButtonIcon: "pi pi-plus", decrementButtonIcon: "pi pi-minus", className: "w-full" })] }), _jsx(Divider, {}), _jsxs("div", { className: "pricing-result", children: [_jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "font-semibold", children: "Endpreis (Netto):" }), _jsx("span", { className: "text-xl font-bold text-primary", children: formatCurrency(pricing.finalPrice) })] }), _jsxs("div", { className: "flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "font-semibold", children: "Endpreis (Brutto):" }), _jsx("span", { className: "text-lg font-semibold", children: formatCurrency(pricing.finalPriceBrutto || 0) })] }), priceChangePercent !== 0 && (_jsxs("div", { className: "flex justify-content-between align-items-center mb-3", children: [_jsx("span", { className: "text-sm", children: "Preis\u00E4nderung:" }), _jsx(Badge, { value: `${priceChangePercent > 0 ? '+' : ''}${priceChangePercent.toFixed(1)}%`, severity: priceChangePercent > 0 ? 'danger' : 'success' })] })), _jsx(Button, { label: "Zur\u00FCcksetzen", icon: "pi pi-refresh", onClick: resetPricing, className: "w-full", outlined: true, size: "small", disabled: pricing.discountPercent === 0 && pricing.surchargePercent === 0 && pricing.additionalCosts === 0 })] })] }));
    if (compact) {
        return (_jsxs("div", { className: `live-pricing-sidebar-compact ${className}`, children: [showTitle && (_jsxs("h4", { className: "mb-3 text-center", children: [_jsx("i", { className: "pi pi-calculator mr-2" }), "Live-Preisberechnung"] })), content] }));
    }
    return (_jsxs(Card, { className: `live-pricing-sidebar ${className}`, pt: {
            body: { className: 'p-3' },
            content: { className: 'p-0' }
        }, children: [showTitle && (_jsxs("div", { className: "flex align-items-center mb-4", children: [_jsx("i", { className: "pi pi-calculator text-primary mr-2 text-xl" }), _jsx("h3", { className: "m-0 text-primary", children: "Live-Preisberechnung" })] })), content] }));
};
export default LivePricingSidebar;
