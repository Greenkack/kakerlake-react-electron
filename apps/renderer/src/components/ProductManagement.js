import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import './ProductManagement.css';
const PRODUCT_CATEGORIES = [
    'Modul',
    'Wechselrichter',
    'Batteriespeicher',
    'Wallbox',
    'Zubehör',
    'Sonstiges'
];
const ProductManagement = () => {
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
            const result = await window.api.product.listProducts(category || null);
            setProducts(result);
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
    const handleFileUpload = async (file) => {
        if (!file)
            return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Prepare for bulk import
            const fileBuffer = await file.arrayBuffer();
            const result = await window.api.product.bulkImportProducts({
                filename: file.name,
                data: Array.from(new Uint8Array(fileBuffer)),
                type: file.name.endsWith('.xlsx') ? 'xlsx' : 'csv'
            });
            if (result.success) {
                alert(`Import erfolgreich! ${result.imported} neue Produkte, ${result.updated} aktualisiert, ${result.skipped} übersprungen`);
                await loadProducts();
                setUploadFile(null);
            }
            else {
                alert(`Import Fehler: ${result.message || 'Unbekannter Fehler'}`);
            }
        }
        catch (error) {
            console.error('File upload failed:', error);
            alert('Datei-Upload fehlgeschlagen');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.model_name.trim() || !formData.category) {
            alert('Modellname und Kategorie sind Pflichtfelder!');
            return;
        }
        setLoading(true);
        try {
            if (editingProduct?.id) {
                // Update existing product
                const success = await window.api.product.updateProduct(editingProduct.id, formData);
                if (success) {
                    alert('Produkt erfolgreich aktualisiert!');
                }
                else {
                    alert('Fehler beim Aktualisieren des Produkts');
                }
            }
            else {
                // Add new product
                const id = await window.api.product.addProduct(formData);
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
            const success = await window.api.product.deleteProduct(id);
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
    // Parse German number format (handle comma as decimal separator)
    const parseGermanNumber = (value) => {
        if (!value)
            return null;
        // Remove thousands separators (dots) and replace decimal comma with dot
        let cleaned = value.toString();
        if (cleaned.includes('.') && cleaned.includes(',')) {
            // If both exist, dots are thousands separators
            cleaned = cleaned.replace(/\./g, '');
        }
        cleaned = cleaned.replace(',', '.');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
    };
    return (_jsxs("div", { className: "product-management", children: [_jsx("h2", { children: "Produktverwaltung" }), _jsxs("div", { className: "upload-section", children: [_jsx("h3", { children: "Produktdatenbank hochladen (Excel/CSV)" }), _jsx("p", { children: "Laden Sie eine Excel (.xlsx) oder CSV (.csv) Datei mit Produktdaten hoch. Pflichtfelder: model_name, category" }), _jsx("label", { htmlFor: "file-upload", className: "sr-only", children: "Produktdatei ausw\u00E4hlen" }), _jsx("input", { id: "file-upload", type: "file", accept: ".xlsx,.csv", onChange: (e) => setUploadFile(e.target.files?.[0] || null), className: "file-input", title: "Excel- oder CSV-Datei mit Produktdaten ausw\u00E4hlen" }), _jsxs("button", { onClick: () => uploadFile && handleFileUpload(uploadFile), disabled: !uploadFile || loading, className: "btn btn-primary", children: [loading ? 'Verarbeite...' : 'Datei verarbeiten', _jsx("div", { className: "form-toggle", children: _jsx("button", { onClick: () => setIsFormOpen(!isFormOpen), className: "btn btn-success", children: isFormOpen ? 'Formular schließen' : 'Neues Produkt manuell anlegen' }) }), ">", isFormOpen ? 'Formular schließen' : 'Neues Produkt manuell anlegen', _jsxs("form", { onSubmit: handleSubmit, className: "product-form", children: [_jsx("h3", { children: editingProduct ? `Produkt bearbeiten: ${editingProduct.model_name}` : 'Neues Produkt anlegen' }), _jsx("div", { className: "form-grid", children: _jsxs("form", { onSubmit: handleSubmit, style: { marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "model-name", children: "Modellname *" }), _jsx("input", { id: "model-name", type: "text", value: formData.model_name, onChange: (e) => handleFormChange('model_name', e.target.value), required: true, className: "form-input", placeholder: "Produktmodell eingeben", title: "Name des Produktmodells" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "category", children: "Kategorie *" }), _jsx("select", { id: "category", value: formData.category, onChange: (e) => handleFormChange('category', e.target.value), required: true, className: "form-select", title: "Produktkategorie ausw\u00E4hlen", children: PRODUCT_CATEGORIES.map(cat => (_jsx("option", { value: cat, children: cat }, cat))) })] }), _jsx("option", { value: cat, children: cat }, cat), "))}"] }) }), _jsxs("div", { children: [_jsx("label", { children: "Hersteller" }), _jsx("input", { type: "text", value: formData.brand || '', onChange: (e) => handleFormChange('brand', e.target.value), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Preis (\u20AC)" }), _jsx("input", { type: "number", step: "0.01", value: formData.price_euro || 0, onChange: (e) => handleFormChange('price_euro', parseFloat(e.target.value) || 0), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Zusatzkosten Netto (\u20AC)" }), _jsx("input", { type: "number", step: "0.01", value: formData.additional_cost_netto || 0, onChange: (e) => handleFormChange('additional_cost_netto', parseFloat(e.target.value) || 0), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Garantie (Jahre)" }), _jsx("input", { type: "number", value: formData.warranty_years || 0, onChange: (e) => handleFormChange('warranty_years', parseInt(e.target.value) || 0), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), formData.category === 'Modul' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { children: "Kapazit\u00E4t (W)" }), _jsx("input", { type: "number", value: formData.capacity_w || '', onChange: (e) => handleFormChange('capacity_w', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Effizienz (%)" }), _jsx("input", { type: "number", step: "0.1", value: formData.efficiency_percent || '', onChange: (e) => handleFormChange('efficiency_percent', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Zelltechnologie" }), _jsx("input", { type: "text", value: formData.cell_technology || '', onChange: (e) => handleFormChange('cell_technology', e.target.value), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Modulstruktur" }), _jsx("input", { type: "text", value: formData.module_structure || '', onChange: (e) => handleFormChange('module_structure', e.target.value), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] })] })), formData.category === 'Batteriespeicher' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { children: "Speicher-Leistung (kW)" }), _jsx("input", { type: "number", step: "0.1", value: formData.storage_power_kw || '', onChange: (e) => handleFormChange('storage_power_kw', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Max. Zyklen" }), _jsx("input", { type: "number", value: formData.max_cycles || '', onChange: (e) => handleFormChange('max_cycles', parseInt(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] })] })), (formData.category === 'Wechselrichter' || formData.category === 'Wallbox') && (_jsxs("div", { children: [_jsx("label", { children: "Leistung (kW)" }), _jsx("input", { type: "number", step: "0.1", value: formData.power_kw || '', onChange: (e) => handleFormChange('power_kw', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] })), _jsxs("div", { children: [_jsx("label", { children: "L\u00E4nge (m)" }), _jsx("input", { type: "number", step: "0.01", value: formData.length_m || '', onChange: (e) => handleFormChange('length_m', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Breite (m)" }), _jsx("input", { type: "number", step: "0.01", value: formData.width_m || '', onChange: (e) => handleFormChange('width_m', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Gewicht (kg)" }), _jsx("input", { type: "number", step: "0.1", value: formData.weight_kg || '', onChange: (e) => handleFormChange('weight_kg', parseFloat(e.target.value) || null), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Herkunftsland" }), _jsx("input", { type: "text", value: formData.origin_country || '', onChange: (e) => handleFormChange('origin_country', e.target.value), style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] })] }), _jsxs("div", { style: { marginBottom: '15px' }, children: [_jsx("label", { children: "Beschreibung" }), _jsx("textarea", { value: formData.description || '', onChange: (e) => handleFormChange('description', e.target.value), rows: 3, style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }, children: [_jsxs("div", { children: [_jsx("label", { children: "Vorteile" }), _jsx("textarea", { value: formData.pros || '', onChange: (e) => handleFormChange('pros', e.target.value), rows: 3, style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] }), _jsxs("div", { children: [_jsx("label", { children: "Nachteile" }), _jsx("textarea", { value: formData.cons || '', onChange: (e) => handleFormChange('cons', e.target.value), rows: 3, style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } })] })] }), _jsxs("div", { style: { marginBottom: '15px' }, children: [_jsx("label", { children: "Produktbild (PNG, JPG, max. 2MB)" }), _jsx("input", { type: "file", accept: ".png,.jpg,.jpeg", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                handleImageUpload(file);
                                        }, style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' } }), formData.image_base64 && (_jsxs("div", { style: { marginTop: '10px' }, children: [_jsx("img", { src: `data:image/jpeg;base64,${formData.image_base64}`, alt: "Product preview", style: { maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' } }), _jsxs("p", { style: { fontSize: '12px', color: '#666' }, children: ["Bildgr\u00F6\u00DFe: ", formData.image_base64.length, " Zeichen (Base64)"] })] }))] }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx("button", { type: "submit", disabled: loading, style: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }, children: loading ? 'Speichere...' : (editingProduct ? 'Aktualisieren' : 'Hinzufügen') }), _jsx("button", { type: "button", onClick: resetForm, style: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }, children: "Abbrechen" })] })] }), ")}", _jsxs("div", { style: { marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("label", { children: "Kategorie: " }), _jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }, children: [_jsx("option", { value: "Alle Kategorien", children: "Alle Kategorien" }), PRODUCT_CATEGORIES.map(cat => (_jsx("option", { value: cat, children: cat }, cat)))] })] }), _jsxs("div", { children: [_jsx("label", { children: "Suche: " }), _jsx("input", { type: "text", placeholder: "Modell/Hersteller suchen...", value: searchText, onChange: (e) => setSearchText(e.target.value), style: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '200px' } })] }), _jsx("button", { onClick: () => loadProducts(), disabled: loading, style: { padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }, children: loading ? 'Lade...' : 'Aktualisieren' })] }), _jsxs("div", { children: [_jsxs("h3", { children: ["Produkte (", filteredProducts.length, ")"] }), filteredProducts.length === 0 ? (_jsx("p", { children: "Keine Produkte gefunden." })) : (_jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f8f9fa' }, children: [_jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "ID" }), _jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "Kategorie" }), _jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "Modell" }), _jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "Hersteller" }), _jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "Preis (\u20AC)" }), _jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "Garantie" }), _jsx("th", { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'left' }, children: "Aktionen" })] }) }), _jsx("tbody", { children: filteredProducts.map((product) => (_jsxs("tr", { children: [_jsx("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: product.id }), _jsx("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: product.category }), _jsx("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [product.image_base64 && (_jsx("img", { src: `data:image/jpeg;base64,${product.image_base64}`, alt: product.model_name, style: { width: '40px', height: '40px', objectFit: 'contain' } })), product.model_name] }) }), _jsx("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: product.brand }), _jsxs("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: [(product.price_euro || 0).toFixed(2), "\u20AC"] }), _jsxs("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: [product.warranty_years || 0, " Jahre"] }), _jsx("td", { style: { border: '1px solid #ccc', padding: '8px' }, children: _jsxs("div", { style: { display: 'flex', gap: '5px' }, children: [_jsx("button", { onClick: () => handleEdit(product), style: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', fontSize: '12px' }, children: "Bearbeiten" }), _jsx("button", { onClick: () => handleDelete(product.id), style: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', fontSize: '12px' }, children: "L\u00F6schen" })] }) })] }, product.id))) })] }) }))] })] }), "); }; export default ProductManagement;"] }));
};
