import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatGermanNumber, formatGermanCurrency } from '../../utils/germanFormat';
// Mock Data
const mockProducts = [
    {
        id: '1',
        name: 'Ja Solar JAM72S30 540/MR',
        brand: 'Ja Solar',
        category: 'module',
        type: 'Mono PERC',
        power: 540,
        efficiency: 20.9,
        price: 189.50,
        availability: 'in_stock',
        warranty: 25,
        certifications: ['IEC 61215', 'IEC 61730', 'CE'],
        dimensions: {
            length: 2279,
            width: 1134,
            height: 30,
            weight: 27.5
        },
        specifications: {
            'Zelltyp': 'Mono PERC',
            'Anzahl Zellen': 144,
            'Vmp': '41,88 V',
            'Imp': '12,90 A',
            'Voc': '50,15 V',
            'Isc': '13,64 A'
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-08-20',
        isActive: true
    },
    {
        id: '2',
        name: 'SMA Sunny Boy 5.0',
        brand: 'SMA',
        category: 'inverter',
        type: 'String-Wechselrichter',
        power: 5000,
        efficiency: 97.1,
        price: 1245.00,
        availability: 'in_stock',
        warranty: 10,
        certifications: ['VDE-AR-N 4105', 'CE', 'RCM'],
        specifications: {
            'AC Nennleistung': '5000 W',
            'DC Eingänge': '2',
            'Max DC Spannung': '1000 V',
            'MPPT Bereiche': '2',
            'Schutzart': 'IP65'
        },
        createdAt: '2024-02-10',
        updatedAt: '2024-09-01',
        isActive: true
    },
    {
        id: '3',
        name: 'BYD Battery-Box Premium HVS 7.7',
        brand: 'BYD',
        category: 'battery',
        type: 'LiFePO4 Hochvolt',
        power: 7.68, // kWh
        efficiency: 96.0,
        price: 3890.00,
        availability: 'limited',
        warranty: 10,
        certifications: ['CE', 'UN38.3', 'IEC 62619'],
        specifications: {
            'Kapazität': '7,68 kWh',
            'Spannung': '51,2 V',
            'Zyklen': '6000+',
            'Temperaturbereich': '-10°C bis +50°C'
        },
        createdAt: '2024-01-20',
        updatedAt: '2024-08-15',
        isActive: true
    }
];
const categoryLabels = {
    module: 'PV-Module',
    inverter: 'Wechselrichter',
    battery: 'Batteriespeicher',
    wallbox: 'Wallboxen',
    mounting: 'Montagesysteme',
    cable: 'Kabel & Zubehör'
};
const availabilityLabels = {
    in_stock: 'Auf Lager',
    limited: 'Begrenzt',
    out_of_stock: 'Nicht verfügbar',
    discontinued: 'Eingestellt'
};
const availabilityColors = {
    in_stock: 'bg-green-100 text-green-800',
    limited: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
    discontinued: 'bg-gray-100 text-gray-800'
};
export default function ProductManagement() {
    const [products] = useState(mockProducts);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.type.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch && product.isActive;
        });
        return filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            if (sortBy === 'name' || sortBy === 'brand') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            if (aValue < bValue)
                return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue)
                return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [products, selectedCategory, searchTerm, sortBy, sortOrder]);
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Link, { to: "/admin", className: "text-slate-500 hover:text-slate-700", children: "Admin" }), _jsx("span", { className: "text-slate-400", children: "/" }), _jsx("span", { className: "text-slate-900 font-medium", children: "Produktverwaltung" })] }), _jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "\uD83D\uDCE6 Produktverwaltung" }), _jsx("p", { className: "text-slate-600", children: "Verwalten Sie Ihre Produktkataloge und Preise" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "+ Produkt hinzuf\u00FCgen" }), _jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Import/Export" })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-6", children: [_jsx("div", { className: "bg-white rounded-lg border p-4 mb-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Produkt suchen...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), _jsx("div", { className: "absolute left-3 top-2.5 text-slate-400", children: "\uD83D\uDD0D" })] }) }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs("button", { onClick: () => setSelectedCategory('all'), className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: ["Alle (", products.length, ")"] }), Object.entries(categoryLabels).map(([key, label]) => {
                                            const count = products.filter(p => p.category === key && p.isActive).length;
                                            return (_jsxs("button", { onClick: () => setSelectedCategory(key), className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === key
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`, children: [label, " (", count, ")"] }, key));
                                        })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: `${sortBy}-${sortOrder}`, onChange: (e) => {
                                                const [field, order] = e.target.value.split('-');
                                                setSortBy(field);
                                                setSortOrder(order);
                                            }, className: "px-3 py-2 border border-slate-300 rounded-lg text-sm", children: [_jsx("option", { value: "name-asc", children: "Name A-Z" }), _jsx("option", { value: "name-desc", children: "Name Z-A" }), _jsx("option", { value: "brand-asc", children: "Marke A-Z" }), _jsx("option", { value: "price-asc", children: "Preis niedrig-hoch" }), _jsx("option", { value: "price-desc", children: "Preis hoch-niedrig" }), _jsx("option", { value: "power-desc", children: "Leistung hoch-niedrig" })] }), _jsxs("div", { className: "flex bg-slate-100 rounded-lg p-1", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: `px-3 py-1 rounded text-sm transition-colors ${viewMode === 'grid'
                                                        ? 'bg-white text-slate-900 shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900'}`, children: "\uD83D\uDCCB" }), _jsx("button", { onClick: () => setViewMode('table'), className: `px-3 py-1 rounded text-sm transition-colors ${viewMode === 'table'
                                                        ? 'bg-white text-slate-900 shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900'}`, children: "\uD83D\uDCCA" })] })] })] }) }), viewMode === 'grid' ? (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredAndSortedProducts.map(product => (_jsx(ProductCard, { product: product }, product.id))) })) : (_jsx(ProductTable, { products: filteredAndSortedProducts })), filteredAndSortedProducts.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCE6" }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-2", children: "Keine Produkte gefunden" }), _jsx("p", { className: "text-slate-600", children: searchTerm ? `Keine Produkte für "${searchTerm}"` : 'Keine Produkte in dieser Kategorie' })] }))] })] }));
}
// Product Card Component
function ProductCard({ product }) {
    const getPowerDisplay = () => {
        if (product.category === 'module')
            return `${product.power} Wp`;
        if (product.category === 'inverter')
            return `${formatGermanNumber(product.power / 1000, 1)} kW`;
        if (product.category === 'battery')
            return `${formatGermanNumber(product.power, 1)} kWh`;
        return '';
    };
    return (_jsxs("div", { className: "bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "text-2xl", children: [product.category === 'module' && '⚡', product.category === 'inverter' && '🔄', product.category === 'battery' && '🔋', product.category === 'wallbox' && '🚗', product.category === 'mounting' && '🔧', product.category === 'cable' && '🔌'] }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${availabilityColors[product.availability]}`, children: availabilityLabels[product.availability] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("h3", { className: "font-semibold text-slate-900 text-sm mb-1 leading-tight", children: product.name }), _jsxs("p", { className: "text-slate-600 text-xs", children: [product.brand, " \u2022 ", product.type] })] }), _jsxs("div", { className: "space-y-1 mb-3", children: [product.power && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-600", children: "Leistung:" }), _jsx("span", { className: "font-medium", children: getPowerDisplay() })] })), product.efficiency && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-600", children: "Effizienz:" }), _jsxs("span", { className: "font-medium", children: [formatGermanNumber(product.efficiency, 1), "%"] })] })), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-600", children: "Garantie:" }), _jsxs("span", { className: "font-medium", children: [product.warranty, " Jahre"] })] })] }), _jsxs("div", { className: "flex justify-between items-center pt-3 border-t", children: [_jsx("div", { className: "text-lg font-bold text-green-600", children: formatGermanCurrency(product.price) }), _jsx("div", { className: "text-xs text-slate-500", children: "netto" })] })] }), _jsxs("div", { className: "px-4 py-3 bg-slate-50 border-t flex gap-2", children: [_jsx("button", { className: "flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors", children: "Bearbeiten" }), _jsx("button", { className: "px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-100 transition-colors", children: "Details" })] })] }));
}
// Product Table Component  
function ProductTable({ products }) {
    return (_jsx("div", { className: "bg-white rounded-lg border overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-4 font-medium text-slate-900", children: "Produkt" }), _jsx("th", { className: "text-left py-3 px-4 font-medium text-slate-900", children: "Kategorie" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-slate-900", children: "Leistung" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-slate-900", children: "Effizienz" }), _jsx("th", { className: "text-right py-3 px-4 font-medium text-slate-900", children: "Preis" }), _jsx("th", { className: "text-center py-3 px-4 font-medium text-slate-900", children: "Status" }), _jsx("th", { className: "text-center py-3 px-4 font-medium text-slate-900", children: "Aktionen" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200", children: products.map(product => (_jsxs("tr", { className: "hover:bg-slate-50", children: [_jsx("td", { className: "py-3 px-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium text-slate-900", children: product.name }), _jsxs("div", { className: "text-sm text-slate-600", children: [product.brand, " \u2022 ", product.type] })] }) }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: "px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm", children: categoryLabels[product.category] }) }), _jsx("td", { className: "py-3 px-4 text-right", children: product.power && (product.category === 'module' ? `${product.power} Wp` :
                                        product.category === 'inverter' ? `${formatGermanNumber(product.power / 1000, 1)} kW` :
                                            product.category === 'battery' ? `${formatGermanNumber(product.power, 1)} kWh` : '') }), _jsx("td", { className: "py-3 px-4 text-right", children: product.efficiency ? `${formatGermanNumber(product.efficiency, 1)}%` : '-' }), _jsx("td", { className: "py-3 px-4 text-right font-medium", children: formatGermanCurrency(product.price) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${availabilityColors[product.availability]}`, children: availabilityLabels[product.availability] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsxs("div", { className: "flex justify-center gap-1", children: [_jsx("button", { className: "p-1 text-blue-600 hover:bg-blue-50 rounded", children: "\u270F\uFE0F" }), _jsx("button", { className: "p-1 text-slate-600 hover:bg-slate-50 rounded", children: "\uD83D\uDC41\uFE0F" }), _jsx("button", { className: "p-1 text-red-600 hover:bg-red-50 rounded", children: "\uD83D\uDDD1\uFE0F" })] }) })] }, product.id))) })] }) }) }));
}
