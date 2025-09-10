import React, { useState, useEffect, useCallback } from 'react';
import './ProductManagement.css';
/**
 * Local type definitions to avoid importing types from the external core package
 * (the external module path '../../../../core/src/types/db' is not available in this project/tsconfig).
 */

declare global {
  interface Window {
    api: any;
  }
}
type ProductCategory = 'Modul' | 'Wechselrichter' | 'Batteriespeicher' | 'Wallbox' | 'Zubehör' | 'Sonstiges';

interface Product {
  id?: number;
  created_at?: string | null;
  updated_at?: string | null;
  category: ProductCategory;
  model_name: string;
  brand?: string;
  price_euro?: number;
  capacity_w?: number | null;
  storage_power_kw?: number | null;
  power_kw?: number | null;
  max_cycles?: number | null;
  warranty_years?: number;
  length_m?: number | null;
  width_m?: number | null;
  weight_kg?: number | null;
  efficiency_percent?: number | null;
  origin_country?: string;
  description?: string;
  pros?: string;
  cons?: string;
  rating?: number | null;
  image_base64?: string;
  datasheet_link_db_path?: string;
  additional_cost_netto?: number;
  company_id?: number | null;
  cell_technology?: string;
  module_structure?: string;
  cell_type?: string;
  version?: string;
  module_warranty_text?: string;
  labor_hours?: number | null;
}

interface ProductFormData extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Modul',
  'Wechselrichter', 
  'Batteriespeicher',
  'Wallbox',
  'Zubehör',
  'Sonstiges'
];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Alle Kategorien');
  const [searchText, setSearchText] = useState('');

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
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

  const loadProducts = useCallback(async (category?: string) => {
    setLoading(true);
    try {
      const result = await window.api.product.listProducts(category || null);
      setProducts(result);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFormChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('Datei zu groß! Maximum 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64Data = base64.split(',')[1];
      handleFormChange('image_base64', base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
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
      } else {
        alert(`Import Fehler: ${result.message || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Datei-Upload fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        } else {
          alert('Fehler beim Aktualisieren des Produkts');
        }
      } else {
        // Add new product
        const id = await window.api.product.addProduct(formData);
        if (id) {
          alert('Produkt erfolgreich hinzugefügt!');
        } else {
          alert('Fehler beim Hinzufügen des Produkts');
        }
      }
      
      // Reset form and reload
      resetForm();
      await loadProducts();
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Fehler beim Speichern des Produkts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Produkt wirklich löschen?')) return;
    
    setLoading(true);
    try {
      const success = await window.api.product.deleteProduct(id);
      if (success) {
        alert('Produkt erfolgreich gelöscht!');
        await loadProducts();
      } else {
        alert('Fehler beim Löschen des Produkts');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Fehler beim Löschen des Produkts');
    } finally {
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
  const parseGermanNumber = (value: string): number | null => {
    if (!value) return null;
    
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

  return (
    <div className="product-management">
      <h2>Produktverwaltung</h2>
      {/* Bulk Upload Section */}
      <div className="upload-section">
        <h3>Produktdatenbank hochladen (Excel/CSV)</h3>
        <p>Laden Sie eine Excel (.xlsx) oder CSV (.csv) Datei mit Produktdaten hoch. Pflichtfelder: model_name, category</p>
        
        <label htmlFor="file-upload" className="sr-only">Produktdatei auswählen</label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
          className="file-input"
          title="Excel- oder CSV-Datei mit Produktdaten auswählen"
        />
        
        <button 
          onClick={() => uploadFile && handleFileUpload(uploadFile)}
          disabled={!uploadFile || loading}
          className="btn btn-primary"
        >
          {loading ? 'Verarbeite...' : 'Datei verarbeiten'}
      {/* Manual Product Form */}
      <div className="form-toggle">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-success"
        >
          {isFormOpen ? 'Formular schließen' : 'Neues Produkt manuell anlegen'}
        </button>
      </div>
        >
          {isFormOpen ? 'Formular schließen' : 'Neues Produkt manuell anlegen'}
        <form onSubmit={handleSubmit} className="product-form">
          <h3>{editingProduct ? `Produkt bearbeiten: ${editingProduct.model_name}` : 'Neues Produkt anlegen'}</h3>
          
          <div className="form-grid">
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <div>
              <label htmlFor="model-name">Modellname *</label>
              <input
                id="model-name"
                type="text"
                value={formData.model_name}
                onChange={(e) => handleFormChange('model_name', e.target.value)}
                required
                className="form-input"
                placeholder="Produktmodell eingeben"
                title="Name des Produktmodells"
              />
            </div>

            <div>
              <label htmlFor="category">Kategorie *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                required
                className="form-select"
                title="Produktkategorie auswählen"
              >
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Hersteller</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleFormChange('brand', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Preis (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price_euro || 0}
                onChange={(e) => handleFormChange('price_euro', parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Zusatzkosten Netto (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.additional_cost_netto || 0}
                onChange={(e) => handleFormChange('additional_cost_netto', parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Garantie (Jahre)</label>
              <input
                type="number"
                value={formData.warranty_years || 0}
                onChange={(e) => handleFormChange('warranty_years', parseInt(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            {/* Category-specific fields */}
            {formData.category === 'Modul' && (
              <>
                <div>
                  <label>Kapazität (W)</label>
                  <input
                    type="number"
                    value={formData.capacity_w || ''}
                    onChange={(e) => handleFormChange('capacity_w', parseFloat(e.target.value) || null)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label>Effizienz (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.efficiency_percent || ''}
                    onChange={(e) => handleFormChange('efficiency_percent', parseFloat(e.target.value) || null)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label>Zelltechnologie</label>
                  <input
                    type="text"
                    value={formData.cell_technology || ''}
                    onChange={(e) => handleFormChange('cell_technology', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label>Modulstruktur</label>
                  <input
                    type="text"
                    value={formData.module_structure || ''}
                    onChange={(e) => handleFormChange('module_structure', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </>
            )}

            {formData.category === 'Batteriespeicher' && (
              <>
                <div>
                  <label>Speicher-Leistung (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.storage_power_kw || ''}
                    onChange={(e) => handleFormChange('storage_power_kw', parseFloat(e.target.value) || null)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label>Max. Zyklen</label>
                  <input
                    type="number"
                    value={formData.max_cycles || ''}
                    onChange={(e) => handleFormChange('max_cycles', parseInt(e.target.value) || null)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </>
            )}

            {(formData.category === 'Wechselrichter' || formData.category === 'Wallbox') && (
              <div>
                <label>Leistung (kW)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.power_kw || ''}
                  onChange={(e) => handleFormChange('power_kw', parseFloat(e.target.value) || null)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            )}

            <div>
              <label>Länge (m)</label>
              <input
                type="number"
                step="0.01"
                value={formData.length_m || ''}
                onChange={(e) => handleFormChange('length_m', parseFloat(e.target.value) || null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Breite (m)</label>
              <input
                type="number"
                step="0.01"
                value={formData.width_m || ''}
                onChange={(e) => handleFormChange('width_m', parseFloat(e.target.value) || null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Gewicht (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight_kg || ''}
                onChange={(e) => handleFormChange('weight_kg', parseFloat(e.target.value) || null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Herkunftsland</label>
              <input
                type="text"
                value={formData.origin_country || ''}
                onChange={(e) => handleFormChange('origin_country', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* Text areas */}
          <div style={{ marginBottom: '15px' }}>
            <label>Beschreibung</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Vorteile</label>
              <textarea
                value={formData.pros || ''}
                onChange={(e) => handleFormChange('pros', e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label>Nachteile</label>
              <textarea
                value={formData.cons || ''}
                onChange={(e) => handleFormChange('cons', e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* Image upload */}
          <div style={{ marginBottom: '15px' }}>
            <label>Produktbild (PNG, JPG, max. 2MB)</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {formData.image_base64 && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={`data:image/jpeg;base64,${formData.image_base64}`}
                  alt="Product preview"
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
                />
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Bildgröße: {formData.image_base64.length} Zeichen (Base64)
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              disabled={loading}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {loading ? 'Speichere...' : (editingProduct ? 'Aktualisieren' : 'Hinzufügen')}
            </button>
            
            <button 
              type="button"
              onClick={resetForm}
              style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div>
          <label>Kategorie: </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="Alle Kategorien">Alle Kategorien</option>
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Suche: </label>
          <input
            type="text"
            placeholder="Modell/Hersteller suchen..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '200px' }}
          />
        </div>

        <button 
          onClick={() => loadProducts()}
          disabled={loading}
          style={{ padding: '8px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Lade...' : 'Aktualisieren'}
        </button>
      </div>

      {/* Products Table */}
      <div>
        <h3>Produkte ({filteredProducts.length})</h3>
        {filteredProducts.length === 0 ? (
          <p>Keine Produkte gefunden.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>ID</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Kategorie</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Modell</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Hersteller</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Preis (€)</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Garantie</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.id}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.category}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {product.image_base64 && (
                          <img 
                            src={`data:image/jpeg;base64,${product.image_base64}`}
                            alt={product.model_name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                        )}
                        {product.model_name}
                      </div>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.brand}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      {(product.price_euro || 0).toFixed(2)}€
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      {product.warranty_years || 0} Jahre
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          onClick={() => handleEdit(product)}
                          style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', fontSize: '12px' }}
                        >
                          Bearbeiten
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id!)}
                          style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', fontSize: '12px' }}
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
