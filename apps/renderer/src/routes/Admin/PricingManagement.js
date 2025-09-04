import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatGermanNumber, formatGermanCurrency } from '../../utils/germanFormat';
// Mock Data
const mockPriceMatrix = [
    {
        id: '1',
        name: 'PV-Anlage Standard bis 10 kWp',
        category: 'pv_system',
        basePrice: 1200,
        pricePerKw: 850,
        minSize: 3,
        maxSize: 10,
        region: 'Deutschland',
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        isActive: true,
        conditions: [
            'Schrägdach 15-45°',
            'Süd-/Ost-/West-Ausrichtung',
            'Gerüst inklusive'
        ],
        discounts: [
            {
                id: 'd1',
                name: 'Mengenrabatt ab 8 kWp',
                type: 'percentage',
                value: 5,
                minQuantity: 8,
                conditions: 'Ab 8 kWp Anlagengröße'
            }
        ]
    },
    {
        id: '2',
        name: 'PV-Anlage Premium 10-30 kWp',
        category: 'pv_system',
        basePrice: 2000,
        pricePerKw: 750,
        minSize: 10,
        maxSize: 30,
        region: 'Deutschland',
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        isActive: true,
        conditions: [
            'Alle Dachtypen',
            'Optimizers inklusive',
            'Monitoring inklusive',
            'Erweiterte Garantie'
        ],
        discounts: [
            {
                id: 'd2',
                name: 'Premium Rabatt ab 15 kWp',
                type: 'percentage',
                value: 8,
                minQuantity: 15,
                conditions: 'Ab 15 kWp Anlagengröße'
            },
            {
                id: 'd3',
                name: 'Großanlage ab 25 kWp',
                type: 'percentage',
                value: 12,
                minQuantity: 25,
                conditions: 'Ab 25 kWp Anlagengröße'
            }
        ]
    },
    {
        id: '3',
        name: 'Batteriespeicher Standard',
        category: 'battery',
        basePrice: 800,
        pricePerKwh: 450,
        minSize: 5,
        maxSize: 15,
        validFrom: '2024-01-01',
        isActive: true,
        conditions: [
            'LiFePO4 Technologie',
            '10 Jahre Garantie',
            'AC-gekoppelt'
        ],
        discounts: [
            {
                id: 'd4',
                name: 'Kombi-Rabatt mit PV',
                type: 'percentage',
                value: 10,
                conditions: 'Bei gleichzeitigem PV-Kauf'
            }
        ]
    },
    {
        id: '4',
        name: 'Wallbox Installation',
        category: 'wallbox',
        basePrice: 1200,
        pricePerKw: 0,
        validFrom: '2024-01-01',
        isActive: true,
        conditions: [
            '11 kW Ladeleistung',
            'RFID & App-Steuerung',
            'Installation inklusive',
            'Anmeldung beim Netzbetreiber'
        ],
        discounts: [
            {
                id: 'd5',
                name: 'Kombi mit PV-Anlage',
                type: 'fixed',
                value: 200,
                conditions: 'Bei gleichzeitigem PV-System'
            }
        ]
    }
];
const categoryLabels = {
    pv_system: 'PV-Systeme',
    battery: 'Batteriespeicher',
    wallbox: 'Wallboxen',
    heatpump: 'Wärmepumpen',
    service: 'Service & Wartung'
};
const discountTypeLabels = {
    percentage: 'Prozent',
    fixed: 'Festbetrag',
    volume: 'Mengenrabatt'
};
export default function PricingManagement() {
    const [priceMatrix, setPriceMatrix] = useState(mockPriceMatrix);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const filteredPrices = useMemo(() => {
        return priceMatrix.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = showInactive || item.isActive;
            return matchesCategory && matchesSearch && matchesStatus;
        });
    }, [priceMatrix, selectedCategory, searchTerm, showInactive]);
    const calculateTotalPrice = (item, size) => {
        const variablePrice = size * (item.pricePerKw || item.pricePerKwh || 0);
        let total = item.basePrice + variablePrice;
        // Apply discounts
        item.discounts.forEach(discount => {
            if (discount.minQuantity && size < discount.minQuantity)
                return;
            if (discount.type === 'percentage') {
                total = total * (1 - discount.value / 100);
            }
            else if (discount.type === 'fixed') {
                total = total - discount.value;
            }
        });
        return Math.max(0, total);
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Link, { to: "/admin", className: "text-slate-500 hover:text-slate-700", children: "Admin" }), _jsx("span", { className: "text-slate-400", children: "/" }), _jsx("span", { className: "text-slate-900 font-medium", children: "Preismatrix" })] }), _jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "\uD83D\uDCB0 Preismatrix-Verwaltung" }), _jsx("p", { className: "text-slate-600", children: "Verwalten Sie Ihre Preisstrukturen und Rabatte" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "+ Preisgruppe hinzuf\u00FCgen" }), _jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Preise exportieren" })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-6", children: [_jsx("div", { className: "bg-white rounded-lg border p-4 mb-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Preisgruppe suchen...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), _jsx("div", { className: "absolute left-3 top-2.5 text-slate-400", children: "\uD83D\uDD0D" })] }) }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { onClick: () => setSelectedCategory('all'), className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: "Alle" }), Object.entries(categoryLabels).map(([key, label]) => (_jsx("button", { onClick: () => setSelectedCategory(key), className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === key
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: label }, key)))] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: showInactive, onChange: (e) => setShowInactive(e.target.checked), className: "rounded border-slate-300" }), _jsx("span", { className: "text-sm text-slate-700", children: "Inaktive anzeigen" })] })] }) }), _jsx("div", { className: "space-y-4", children: filteredPrices.map(item => (_jsx(PriceMatrixCard, { item: item, isEditing: editingItem === item.id, onEdit: () => setEditingItem(editingItem === item.id ? null : item.id), onSave: () => setEditingItem(null), calculateTotalPrice: calculateTotalPrice }, item.id))) }), filteredPrices.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCB0" }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-2", children: "Keine Preisgruppen gefunden" }), _jsx("p", { className: "text-slate-600", children: searchTerm ? `Keine Preise für "${searchTerm}"` : 'Keine Preise in dieser Kategorie' })] }))] })] }));
}
// Price Matrix Card Component
function PriceMatrixCard({ item, isEditing, onEdit, onSave, calculateTotalPrice }) {
    const [exampleSize, setExampleSize] = useState(item.minSize || 5);
    const examplePrice = calculateTotalPrice(item, exampleSize);
    const pricePerUnit = item.pricePerKw || item.pricePerKwh || 0;
    const unit = item.pricePerKw ? 'kW' : item.pricePerKwh ? 'kWh' : '';
    return (_jsxs("div", { className: `bg-white rounded-lg border p-6 ${!item.isActive ? 'opacity-60' : ''}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: item.name }), _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium", children: categoryLabels[item.category] }), !item.isActive && (_jsx("span", { className: "px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium", children: "Inaktiv" }))] }), _jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "bg-slate-50 rounded-lg p-3", children: [_jsx("div", { className: "text-sm text-slate-600 mb-1", children: "Grundpreis" }), _jsx("div", { className: "text-lg font-bold text-slate-900", children: formatGermanCurrency(item.basePrice) })] }), pricePerUnit > 0 && (_jsxs("div", { className: "bg-slate-50 rounded-lg p-3", children: [_jsxs("div", { className: "text-sm text-slate-600 mb-1", children: ["Pro ", unit] }), _jsx("div", { className: "text-lg font-bold text-slate-900", children: formatGermanCurrency(pricePerUnit) })] })), item.minSize && item.maxSize && (_jsxs("div", { className: "bg-slate-50 rounded-lg p-3", children: [_jsx("div", { className: "text-sm text-slate-600 mb-1", children: "Gr\u00F6\u00DFenbereich" }), _jsxs("div", { className: "text-lg font-bold text-slate-900", children: [formatGermanNumber(item.minSize, 0), " - ", formatGermanNumber(item.maxSize, 0), " ", unit] })] })), _jsxs("div", { className: "bg-green-50 rounded-lg p-3", children: [_jsxs("div", { className: "text-sm text-green-700 mb-1", children: ["Beispiel (", exampleSize, " ", unit, ")"] }), _jsx("div", { className: "text-lg font-bold text-green-800", children: formatGermanCurrency(examplePrice) })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: onEdit, className: "px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm", children: isEditing ? 'Abbrechen' : 'Bearbeiten' }), _jsx("button", { className: "px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm", children: "Duplizieren" })] })] }), pricePerUnit > 0 && (_jsx("div", { className: "mb-4 p-3 bg-blue-50 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("label", { className: "text-sm font-medium text-blue-900", children: "Beispielrechnung:" }), _jsx("input", { type: "range", min: item.minSize || 1, max: item.maxSize || 50, value: exampleSize, onChange: (e) => setExampleSize(Number(e.target.value)), className: "flex-1" }), _jsxs("div", { className: "text-sm font-medium text-blue-900 min-w-[120px]", children: [formatGermanNumber(exampleSize, 1), " ", unit, " = ", formatGermanCurrency(examplePrice)] })] }) })), item.conditions.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-medium text-slate-900 mb-2", children: "Konditionen:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: item.conditions.map((condition, index) => (_jsx("span", { className: "px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm", children: condition }, index))) })] })), item.discounts.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-medium text-slate-900 mb-2", children: "Rabatte:" }), _jsx("div", { className: "space-y-2", children: item.discounts.map(discount => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-green-50 rounded border border-green-200", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-green-800", children: discount.name }), _jsxs("span", { className: "text-sm text-green-600 ml-2", children: ["(", discountTypeLabels[discount.type], ": ", discount.type === 'percentage'
                                                    ? `${formatGermanNumber(discount.value, 1)}%`
                                                    : formatGermanCurrency(discount.value), ")"] })] }), _jsx("div", { className: "text-sm text-green-600", children: discount.conditions })] }, discount.id))) })] })), _jsxs("div", { className: "flex justify-between text-sm text-slate-500 border-t pt-3", children: [_jsxs("span", { children: ["G\u00FCltig von: ", new Date(item.validFrom).toLocaleDateString('de-DE')] }), item.validUntil && (_jsxs("span", { children: ["bis: ", new Date(item.validUntil).toLocaleDateString('de-DE')] }))] })] }));
}
