import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
const PRODUCT_CATEGORIES = [
    'Modul',
    'Wechselrichter',
    'Batteriespeicher',
    'Wallbox',
    'Zubehör',
    'Sonstiges'
];
export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [filterCategory, setFilterCategory] = useState('Alle Kategorien');
    const [searchText, setSearchText] = useState('');
    // Form state
    const [formData, setFormData] = useState({
        category: 'Modul',
        model_name: '',
        brand: '',
        price_euro: 0,
        capacity_w: null,
        storage_power_kw: null,
        power_kw: null,
        max_cycles: null,
        warranty_years: 0,
        length_m: null,
        width_m: null,
        weight_kg: null,
        efficiency_percent: null,
        origin_country: '',
        description: '',
        pros: '',
        cons: '',
        rating: null,
        image_base64: '',
        datasheet_link_db_path: '',
        additional_cost_netto: 0,
        company_id: null,
        cell_technology: '',
        module_structure: '',
        cell_type: '',
        version: '',
        module_warranty_text: '',
        labor_hours: null
    });
    const loadProducts = useCallback(async (category) => {
        setLoading(true);
        try {
            const result = await window.api?.product?.listProducts(category || null);
            setProducts(result || []);
        }
        catch (error) {
            console.error('Failed to load products:', error);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);
    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleImageUpload = async (file) => {
        if (file.size > 2 * 1024 * 1024) {
            alert('Datei zu groß! Maximum 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            // Remove data:image/...;base64, prefix
            const base64Data = base64.split(',')[1];
            handleFormChange('image_base64', base64Data);
        };
        reader.readAsDataURL(file);
    };
    const handleFileUpload = async (file, dryRun = false) => {
        if (!file)
            return;
        setLoading(true);
        try {
            const fileBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(fileBuffer);
            // Use Python bridge for actual import (like the original Python version)
            const result = await window.api?.importProductsFromFile?.({
                filename: file.name,
                data: Array.from(uint8Array),
                file_extension: file.name.split('.').pop()?.toLowerCase(),
                dry_run: dryRun // Pass dry run parameter
            });
            if (result?.success) {
                const message = dryRun
                    ? `Probelauf abgeschlossen: ${(result.created || 0) + (result.updated || 0)} Produkte würden verarbeitet (${result.created || 0} neu, ${result.updated || 0} aktualisiert, ${result.skipped || 0} übersprungen)`
                    : `Import erfolgreich! ${result.created || 0} neue Produkte erstellt, ${result.updated || 0} aktualisiert, ${result.skipped || 0} übersprungen`;
                alert(message);
                if (!dryRun) {
                    // Only reload products after real import, not dry run
                    await loadProducts();
                    setUploadFile(null);
                }
            }
            else {
                alert(`${dryRun ? 'Probelauf' : 'Import'} Fehler: ${result?.error || 'Unbekannter Fehler'}`);
            }
        }
        catch (error) {
            console.error('File upload failed:', error);
            alert(`${dryRun ? 'Probelauf' : 'Import'} fehlgeschlagen: ${error}`);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.model_name?.trim() || !formData.category) {
            alert('Modellname und Kategorie sind Pflichtfelder!');
            return;
        }
        setLoading(true);
        try {
            if (editingProduct?.id) {
                // Update existing product
                const success = await window.api?.product?.updateProduct(editingProduct.id, formData);
                if (success) {
                    alert('Produkt erfolgreich aktualisiert!');
                }
                else {
                    alert('Fehler beim Aktualisieren des Produkts');
                }
            }
            else {
                // Add new product
                const id = await window.api?.product?.addProduct(formData);
                if (id) {
                    alert('Produkt erfolgreich hinzugefügt!');
                }
                else {
                    alert('Fehler beim Hinzufügen des Produkts');
                }
            }
            // Reset form and reload
            resetForm();
            await loadProducts();
        }
        catch (error) {
            console.error('Submit failed:', error);
            alert('Fehler beim Speichern des Produkts');
        }
        finally {
            setLoading(false);
        }
    };
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsFormOpen(true);
    };
    const handleDelete = async (id) => {
        if (!confirm('Produkt wirklich löschen?'))
            return;
        setLoading(true);
        try {
            const success = await window.api?.product?.deleteProduct(id);
            if (success) {
                alert('Produkt erfolgreich gelöscht!');
                await loadProducts();
            }
            else {
                alert('Fehler beim Löschen des Produkts');
            }
        }
        catch (error) {
            console.error('Delete failed:', error);
            alert('Fehler beim Löschen des Produkts');
        }
        finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setFormData({
            category: 'Modul',
            model_name: '',
            brand: '',
            price_euro: 0,
            capacity_w: null,
            storage_power_kw: null,
            power_kw: null,
            max_cycles: null,
            warranty_years: 0,
            length_m: null,
            width_m: null,
            weight_kg: null,
            efficiency_percent: null,
            origin_country: '',
            description: '',
            pros: '',
            cons: '',
            rating: null,
            image_base64: '',
            datasheet_link_db_path: '',
            additional_cost_netto: 0,
            company_id: null,
            cell_technology: '',
            module_structure: '',
            cell_type: '',
            version: '',
            module_warranty_text: '',
            labor_hours: null
        });
        setEditingProduct(null);
        setIsFormOpen(false);
    };
    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesCategory = filterCategory === 'Alle Kategorien' || product.category === filterCategory;
        const matchesSearch = !searchText.trim() ||
            product.model_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    return (_jsx("div", { className: "max-w-7xl mx-auto p-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Produktverwaltung" }), _jsxs("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900 mb-3", children: "Produktdatenbank hochladen (Excel/CSV)" }), _jsx("p", { className: "text-blue-700 mb-4", children: "Laden Sie eine Excel (.xlsx) oder CSV (.csv) Datei mit Produktdaten hoch. Pflichtfelder: model_name, category" }), _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx("input", { type: "file", accept: ".xlsx,.csv", onChange: (e) => setUploadFile(e.target.files?.[0] || null), className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" }), _jsx("button", { onClick: () => uploadFile && handleFileUpload(uploadFile, true), disabled: !uploadFile || loading, className: "px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap", children: loading ? 'Prüfe...' : 'Probelauf' }), _jsx("button", { onClick: () => uploadFile && handleFileUpload(uploadFile, false), disabled: !uploadFile || loading, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap", children: loading ? 'Importiere...' : 'Import starten' })] })] }), _jsx("div", { className: "mb-6", children: _jsx("button", { onClick: () => setIsFormOpen(!isFormOpen), className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700", children: isFormOpen ? 'Formular schließen' : 'Neues Produkt manuell anlegen' }) }), isFormOpen && (_jsx("div", { className: "mb-6 p-6 bg-gray-50 rounded-lg border", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: editingProduct ? `Produkt bearbeiten: ${editingProduct.model_name}` : 'Neues Produkt anlegen' }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Modellname *" }), _jsx("input", { type: "text", value: formData.model_name || '', onChange: (e) => handleFormChange('model_name', e.target.value), required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kategorie *" }), _jsx("select", { value: formData.category, onChange: (e) => handleFormChange('category', e.target.value), required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: PRODUCT_CATEGORIES.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Hersteller" }), _jsx("input", { type: "text", value: formData.brand || '', onChange: (e) => handleFormChange('brand', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Preis (\u20AC)" }), _jsx("input", { type: "number", step: "0.01", value: formData.price_euro || 0, onChange: (e) => handleFormChange('price_euro', parseFloat(e.target.value) || 0), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Garantie (Jahre)" }), _jsx("input", { type: "number", value: formData.warranty_years || 0, onChange: (e) => handleFormChange('warranty_years', parseInt(e.target.value) || 0), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Zusatzkosten Netto (\u20AC)" }), _jsx("input", { type: "number", step: "0.01", value: formData.additional_cost_netto || 0, onChange: (e) => handleFormChange('additional_cost_netto', parseFloat(e.target.value) || 0), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), formData.category === 'Modul' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kapazit\u00E4t (W)" }), _jsx("input", { type: "number", value: formData.capacity_w || '', onChange: (e) => handleFormChange('capacity_w', parseFloat(e.target.value) || null), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Effizienz (%)" }), _jsx("input", { type: "number", step: "0.1", value: formData.efficiency_percent || '', onChange: (e) => handleFormChange('efficiency_percent', parseFloat(e.target.value) || null), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Produktbild (PNG, JPG, max. 2MB)" }), _jsx("input", { type: "file", accept: ".png,.jpg,.jpeg", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                handleImageUpload(file);
                                        }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), formData.image_base64 && (_jsx("div", { className: "mt-2", children: _jsx("img", { src: `data:image/jpeg;base64,${formData.image_base64}`, alt: "Product preview", className: "w-32 h-32 object-contain border rounded" }) }))] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: loading, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50", children: loading ? 'Speichere...' : (editingProduct ? 'Aktualisieren' : 'Hinzufügen') }), _jsx("button", { type: "button", onClick: resetForm, className: "px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700", children: "Abbrechen" })] })] }) })), _jsxs("div", { className: "mb-6 flex flex-wrap gap-4 items-center", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kategorie:" }), _jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "Alle Kategorien", children: "Alle Kategorien" }), PRODUCT_CATEGORIES.map(cat => (_jsx("option", { value: cat, children: cat }, cat)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Suche:" }), _jsx("input", { type: "text", placeholder: "Modell/Hersteller suchen...", value: searchText, onChange: (e) => setSearchText(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]" })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => loadProducts(), disabled: loading, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50", children: loading ? 'Lade...' : 'Aktualisieren' }) })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold mb-3", children: ["Produkte (", filteredProducts.length, ")"] }), filteredProducts.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "Keine Produkte gefunden." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full border border-gray-300", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "ID" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Kategorie" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Modell" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Hersteller" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Preis (\u20AC)" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Garantie" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Aktionen" })] }) }), _jsx("tbody", { children: filteredProducts.map((product) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "border border-gray-300 px-4 py-2", children: product.id }), _jsx("td", { className: "border border-gray-300 px-4 py-2", children: product.category }), _jsx("td", { className: "border border-gray-300 px-4 py-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [product.image_base64 && (_jsx("img", { src: `data:image/jpeg;base64,${product.image_base64}`, alt: product.model_name, className: "w-8 h-8 object-contain" })), product.model_name] }) }), _jsx("td", { className: "border border-gray-300 px-4 py-2", children: product.brand }), _jsxs("td", { className: "border border-gray-300 px-4 py-2", children: [(product.price_euro || 0).toFixed(2), "\u20AC"] }), _jsxs("td", { className: "border border-gray-300 px-4 py-2", children: [product.warranty_years || 0, " Jahre"] }), _jsx("td", { className: "border border-gray-300 px-4 py-2", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(product), className: "px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600", children: "Bearbeiten" }), _jsx("button", { onClick: () => handleDelete(product.id), className: "px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600", children: "L\u00F6schen" })] }) })] }, product.id))) })] }) }))] })] }) }));
}
