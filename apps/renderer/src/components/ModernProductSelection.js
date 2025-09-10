import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';
import { ProgressBar } from 'primereact/progressbar';
// Import der neuen ModernUI Komponenten
import { ModernCard, ModernButton } from '../components/ModernUI_PrimeReact';
export function ModernProductSelection({ products, selectedProduct, onProductSelect, category, quantity = 1, onQuantityChange }) {
    const [selectedBrand, setSelectedBrand] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showComparison, setShowComparison] = useState(false);
    const [comparisonProducts, setComparisonProducts] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [detailProduct, setDetailProduct] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('name');
    // Kategorie-spezifische Konfiguration
    const categoryConfig = {
        module: {
            title: 'PV Module',
            icon: 'pi-th-large',
            powerKey: 'pv_modul_leistung',
            powerUnit: 'Wp',
            quantityLabel: 'Anzahl Module',
            features: ['Leistung (Wp)', 'Effizienz (%)', 'Garantie', 'Preis']
        },
        inverter: {
            title: 'Wechselrichter',
            icon: 'pi-cog',
            powerKey: 'wr_leistung_kw',
            powerUnit: 'kW',
            quantityLabel: 'Anzahl WR',
            features: ['Leistung (kW)', 'Effizienz (%)', 'Garantie', 'Preis']
        },
        storage: {
            title: 'Batteriespeicher',
            icon: 'pi-battery-3',
            powerKey: 'kapazitaet_speicher_kwh',
            powerUnit: 'kWh',
            quantityLabel: 'Anzahl Speicher',
            features: ['Kapazität (kWh)', 'Effizienz (%)', 'Garantie', 'Preis']
        }
    };
    const config = categoryConfig[category];
    // Hersteller-Liste generieren
    const brands = useMemo(() => {
        const uniqueBrands = Array.from(new Set(products.map(p => p.hersteller).filter(Boolean)));
        return [
            { label: 'Alle Hersteller', value: '' },
            ...uniqueBrands.map(brand => ({ label: brand, value: brand }))
        ];
    }, [products]);
    // Gefilterte Produkte
    const filteredProducts = useMemo(() => {
        let filtered = products;
        // Brand-Filter
        if (selectedBrand) {
            filtered = filtered.filter(p => p.hersteller === selectedBrand);
        }
        // Such-Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.produkt_modell.toLowerCase().includes(term) ||
                p.hersteller.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term));
        }
        // Preis-Filter
        filtered = filtered.filter(p => {
            const price = p.price_euro || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });
        // Sortierung
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.produkt_modell.localeCompare(b.produkt_modell);
                case 'brand':
                    return a.hersteller.localeCompare(b.hersteller);
                case 'price':
                    return (a.price_euro || 0) - (b.price_euro || 0);
                case 'power':
                    const aPower = a[config.powerKey] || 0;
                    const bPower = b[config.powerKey] || 0;
                    return bPower - aPower; // Absteigende Sortierung
                case 'efficiency':
                    return (b.efficiency_percent || 0) - (a.efficiency_percent || 0);
                default:
                    return 0;
            }
        });
        return filtered;
    }, [products, selectedBrand, searchTerm, priceRange, sortBy, config.powerKey]);
    // Produktvergleich-Logik
    const generateComparisonData = (products) => {
        return products.map(product => {
            const power = product[config.powerKey] || 0;
            const price = product.price_euro || 0;
            const pricePerWatt = power > 0 && price > 0 ? price / power : 0;
            // Rating-System (1-5 Sterne)
            const efficiency = product.efficiency_percent || 0;
            const warranty = product.warranty_years || 0;
            const efficiencyRating = efficiency >= 22 ? 'Excellent' : efficiency >= 20 ? 'Good' : efficiency >= 18 ? 'Fair' : 'Basic';
            const warrantyRating = warranty >= 25 ? 'Excellent' : warranty >= 20 ? 'Good' : warranty >= 15 ? 'Fair' : 'Basic';
            // Gesamt-Rating berechnen
            const overallRating = Math.round(((efficiency / 25 * 100) * 0.4 + // 40% Effizienz
                (warranty / 30 * 100) * 0.3 + // 30% Garantie
                (pricePerWatt > 0 ? Math.max(0, 100 - pricePerWatt * 2) : 50) * 0.3 // 30% Preis-Leistung
            ));
            return {
                product,
                pricePerWatt: pricePerWatt > 0 ? pricePerWatt : undefined,
                efficiencyRating,
                warrantyRating,
                overallRating: Math.min(100, Math.max(0, overallRating))
            };
        });
    };
    // Produktkarte Template
    const productCardTemplate = (product) => {
        const power = product[config.powerKey] || 0;
        const isSelected = selectedProduct?.id === product.id;
        const isInComparison = comparisonProducts.some(p => p.id === product.id);
        return (_jsx(ModernCard, { className: `product-card h-full ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-lg mb-1 line-clamp-2", children: product.produkt_modell }), _jsx(Chip, { label: product.hersteller, className: "text-xs", style: { backgroundColor: '#e3f2fd', color: '#1976d2' } })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { icon: "pi pi-info-circle", size: "small", text: true, onClick: () => {
                                            setDetailProduct(product);
                                            setShowDetails(true);
                                        }, tooltip: "Details anzeigen" }), _jsx(Button, { icon: isInComparison ? "pi pi-minus" : "pi pi-plus", size: "small", text: true, onClick: () => {
                                            if (isInComparison) {
                                                setComparisonProducts(prev => prev.filter(p => p.id !== product.id));
                                            }
                                            else {
                                                setComparisonProducts(prev => [...prev, product]);
                                            }
                                        }, tooltip: isInComparison ? "Aus Vergleich entfernen" : "Zum Vergleich hinzufügen" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-gray-600", children: "Leistung" }), _jsxs("div", { className: "font-semibold text-blue-600", children: [power.toLocaleString('de-DE'), " ", config.powerUnit] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-600", children: "Effizienz" }), _jsxs("div", { className: "font-semibold", children: [product.efficiency_percent || 'N/A', "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-600", children: "Garantie" }), _jsxs("div", { className: "font-semibold", children: [product.warranty_years || 'N/A', " Jahre"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-600", children: "Preis" }), _jsx("div", { className: "font-semibold text-green-600", children: product.price_euro ?
                                                    `${product.price_euro.toLocaleString('de-DE')} €` :
                                                    'Auf Anfrage' })] })] }), product.price_euro && power > 0 && (_jsxs("div", { className: "bg-gray-50 p-3 rounded text-sm", children: [_jsxs("div", { className: "text-gray-600", children: ["Preis pro ", config.powerUnit] }), _jsxs("div", { className: "font-bold text-lg", children: [(product.price_euro / power).toFixed(2), " \u20AC/", config.powerUnit] })] }))] }), _jsx("div", { className: "flex gap-2", children: _jsxs(ModernButton, { onClick: () => onProductSelect(product), variant: isSelected ? "success" : "primary", size: "small", className: "flex-1", children: [_jsx("i", { className: `pi ${isSelected ? "pi-check" : "pi-plus"} mr-2` }), isSelected ? "Ausgewählt" : "Auswählen"] }) })] }) }, product.id));
    };
    return (_jsxs("div", { className: "modern-product-selection", children: [_jsxs(ModernCard, { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [_jsx("i", { className: `pi ${config.icon} text-blue-500` }), config.title] }), _jsxs("p", { className: "text-gray-600", children: [filteredProducts.length, " von ", products.length, " Produkten"] })] }), onQuantityChange && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("label", { className: "text-sm font-medium", children: [config.quantityLabel, ":"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { icon: "pi pi-minus", size: "small", outlined: true, onClick: () => onQuantityChange(Math.max(1, quantity - 1)) }), _jsx(InputNumber, { value: quantity, onValueChange: (e) => onQuantityChange(e.value || 1), min: 1, max: 100, className: "w-20", showButtons: false }), _jsx(Button, { icon: "pi pi-plus", size: "small", outlined: true, onClick: () => onQuantityChange(quantity + 1) })] })] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Hersteller" }), _jsx(Dropdown, { value: selectedBrand, onChange: (e) => setSelectedBrand(e.value), options: brands, placeholder: "Alle Hersteller", className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Suche" }), _jsx(InputText, { value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Modell, Hersteller...", className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Sortierung" }), _jsx(Dropdown, { value: sortBy, onChange: (e) => setSortBy(e.value), options: [
                                            { label: 'Name', value: 'name' },
                                            { label: 'Hersteller', value: 'brand' },
                                            { label: 'Preis', value: 'price' },
                                            { label: 'Leistung', value: 'power' },
                                            { label: 'Effizienz', value: 'efficiency' }
                                        ], className: "w-full" })] }), _jsx("div", { className: "flex items-end gap-2", children: _jsxs(ModernButton, { onClick: () => setShowComparison(true), disabled: comparisonProducts.length < 2, size: "small", className: "relative", children: [_jsx("i", { className: "pi pi-clone mr-2" }), "Vergleichen", comparisonProducts.length > 0 && (_jsx(Badge, { value: comparisonProducts.length, className: "absolute -top-2 -right-2" }))] }) })] })] }), selectedProduct && (_jsx(ModernCard, { variant: "elevated", className: "mb-6 border-l-4 border-green-500 bg-green-50", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg text-green-800", children: "Ausgew\u00E4hlt" }), _jsxs("p", { className: "text-green-700", children: [selectedProduct.hersteller, " ", selectedProduct.produkt_modell] }), quantity > 1 && (_jsxs("p", { className: "text-sm text-green-600", children: [quantity, "x = ", ((selectedProduct[config.powerKey] || 0) * quantity).toLocaleString('de-DE'), " ", config.powerUnit, " gesamt"] }))] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-green-600", children: "Einzelpreis" }), _jsx("div", { className: "text-xl font-bold text-green-800", children: selectedProduct.price_euro ?
                                        `${selectedProduct.price_euro.toLocaleString('de-DE')} €` :
                                        'Auf Anfrage' }), quantity > 1 && selectedProduct.price_euro && (_jsxs("div", { className: "text-sm text-green-600", children: ["Gesamt: ", (selectedProduct.price_euro * quantity).toLocaleString('de-DE'), " \u20AC"] }))] })] }) })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredProducts.map(product => productCardTemplate(product)) }), filteredProducts.length === 0 && (_jsx(ModernCard, { children: _jsxs("div", { className: "text-center py-8", children: [_jsx("i", { className: "pi pi-search text-4xl text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-600 mb-2", children: "Keine Produkte gefunden" }), _jsx("p", { className: "text-gray-500", children: "Versuche andere Filter oder Suchbegriffe" })] }) })), _jsx(Sidebar, { visible: showComparison, onHide: () => setShowComparison(false), position: "right", style: { width: '50vw' }, header: "Produktvergleich", children: comparisonProducts.length >= 2 ? (_jsx(ProductComparison, { products: comparisonProducts, comparisonData: generateComparisonData(comparisonProducts), category: category })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("i", { className: "pi pi-clone text-4xl text-gray-400 mb-4" }), _jsx("p", { className: "text-gray-600", children: "W\u00E4hle mindestens 2 Produkte zum Vergleichen aus" })] })) }), _jsx(Sidebar, { visible: showDetails, onHide: () => setShowDetails(false), position: "right", style: { width: '40vw' }, header: "Produktdetails", children: detailProduct && (_jsx(ProductDetails, { product: detailProduct, category: category })) })] }));
}
// Produktvergleich-Komponente
function ProductComparison({ products, comparisonData, category }) {
    return (_jsx("div", { className: "space-y-6", children: _jsxs(DataTable, { value: comparisonData, responsiveLayout: "scroll", children: [_jsx(Column, { field: "product.produkt_modell", header: "Modell", style: { width: '200px' } }), _jsx(Column, { field: "product.hersteller", header: "Hersteller" }), _jsx(Column, { field: "product.price_euro", header: "Preis", body: (rowData) => rowData.product.price_euro ?
                        `${rowData.product.price_euro.toLocaleString('de-DE')} €` :
                        'N/A' }), _jsx(Column, { field: "pricePerWatt", header: "\u20AC/Wp", body: (rowData) => rowData.pricePerWatt ?
                        `${rowData.pricePerWatt.toFixed(2)} €` :
                        'N/A' }), _jsx(Column, { field: "product.efficiency_percent", header: "Effizienz (%)" }), _jsx(Column, { field: "product.warranty_years", header: "Garantie (Jahre)" }), _jsx(Column, { field: "overallRating", header: "Bewertung", body: (rowData) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ProgressBar, { value: rowData.overallRating, style: { width: '80px', height: '8px' }, showValue: false }), _jsxs("span", { className: "text-sm", children: [rowData.overallRating, "%"] })] })) })] }) }));
}
// Produktdetails-Komponente
function ProductDetails({ product, category }) {
    const specs = [
        { label: 'Hersteller', value: product.hersteller },
        { label: 'Modell', value: product.produkt_modell },
        { label: 'Kategorie', value: product.kategorie },
        { label: 'Preis', value: product.price_euro ? `${product.price_euro.toLocaleString('de-DE')} €` : 'Auf Anfrage' },
        { label: 'Effizienz', value: product.efficiency_percent ? `${product.efficiency_percent}%` : 'N/A' },
        { label: 'Garantie', value: product.warranty_years ? `${product.warranty_years} Jahre` : 'N/A' },
        { label: 'Herkunft', value: product.origin_country || 'N/A' },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: product.produkt_modell }), _jsx(Chip, { label: product.hersteller, className: "mb-4" })] }), _jsx(Divider, {}), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-3", children: "Spezifikationen" }), _jsx("div", { className: "space-y-2", children: specs.map((spec, index) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "text-gray-600", children: [spec.label, ":"] }), _jsx("span", { className: "font-medium", children: spec.value })] }, index))) })] }), product.description && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-3", children: "Beschreibung" }), _jsx("p", { className: "text-sm text-gray-700", children: product.description })] })] }))] }));
}
export default ModernProductSelection;
