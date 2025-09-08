import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  id?: number;
  category?: string;
  model_name?: string;
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
  created_at?: string;
  updated_at?: string;
}

interface ProductFormData extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
}

type ProductCategory = 'Modul' | 'Wechselrichter' | 'Batteriespeicher' | 'Wallbox' | 'Zubehör' | 'Sonstiges';

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Modul',
  'Wechselrichter', 
  'Batteriespeicher',
  'Wallbox',
  'Zubehör',
  'Sonstiges'
];

export default function ProductManagement(): JSX.Element {
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
      const result = await (window as any).api?.product?.listProducts(category || null);
      setProducts(result || []);
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

  const handleFileUpload = async (file: File, dryRun: boolean = false) => {
    if (!file) return;
    
    setLoading(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      // Use Python bridge for actual import (like the original Python version)
      const result = await (window as any).api?.importProductsFromFile?.({
        filename: file.name,
        data: Array.from(uint8Array),
        file_extension: file.name.split('.').pop()?.toLowerCase(),
        dry_run: dryRun  // Pass dry run parameter
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
      } else {
        alert(`${dryRun ? 'Probelauf' : 'Import'} Fehler: ${result?.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert(`${dryRun ? 'Probelauf' : 'Import'} fehlgeschlagen: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model_name?.trim() || !formData.category) {
      alert('Modellname und Kategorie sind Pflichtfelder!');
      return;
    }

    setLoading(true);
    try {
      if (editingProduct?.id) {
        // Update existing product
        const success = await (window as any).api?.product?.updateProduct(editingProduct.id, formData);
        if (success) {
          alert('Produkt erfolgreich aktualisiert!');
        } else {
          alert('Fehler beim Aktualisieren des Produkts');
        }
      } else {
        // Add new product
        const id = await (window as any).api?.product?.addProduct(formData);
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
      const success = await (window as any).api?.product?.deleteProduct(id);
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Produktverwaltung</h2>

        {/* Bulk Upload Section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Produktdatenbank hochladen (Excel/CSV)</h3>
          <p className="text-blue-700 mb-4">Laden Sie eine Excel (.xlsx) oder CSV (.csv) Datei mit Produktdaten hoch. Pflichtfelder: model_name, category</p>
          
          <div className="flex gap-3 items-center">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            <button 
              onClick={() => uploadFile && handleFileUpload(uploadFile, true)}
              disabled={!uploadFile || loading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Prüfe...' : 'Probelauf'}
            </button>
            
            <button 
              onClick={() => uploadFile && handleFileUpload(uploadFile, false)}
              disabled={!uploadFile || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Importiere...' : 'Import starten'}
            </button>
          </div>
        </div>

        {/* Manual Product Form Toggle */}
        <div className="mb-6">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {isFormOpen ? 'Formular schließen' : 'Neues Produkt manuell anlegen'}
          </button>
        </div>

        {/* Manual Product Form */}
        {isFormOpen && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-semibold mb-4">
                {editingProduct ? `Produkt bearbeiten: ${editingProduct.model_name}` : 'Neues Produkt anlegen'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Required fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modellname *</label>
                  <input
                    type="text"
                    value={formData.model_name || ''}
                    onChange={(e) => handleFormChange('model_name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hersteller</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => handleFormChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preis (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_euro || 0}
                    onChange={(e) => handleFormChange('price_euro', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garantie (Jahre)</label>
                  <input
                    type="number"
                    value={formData.warranty_years || 0}
                    onChange={(e) => handleFormChange('warranty_years', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zusatzkosten Netto (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.additional_cost_netto || 0}
                    onChange={(e) => handleFormChange('additional_cost_netto', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category-specific fields */}
                {formData.category === 'Modul' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kapazität (W)</label>
                      <input
                        type="number"
                        value={formData.capacity_w || ''}
                        onChange={(e) => handleFormChange('capacity_w', parseFloat(e.target.value) || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Effizienz (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.efficiency_percent || ''}
                        onChange={(e) => handleFormChange('efficiency_percent', parseFloat(e.target.value) || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Image upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Produktbild (PNG, JPG, max. 2MB)</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.image_base64 && (
                  <div className="mt-2">
                    <img 
                      src={`data:image/jpeg;base64,${formData.image_base64}`}
                      alt="Product preview"
                      className="w-32 h-32 object-contain border rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Speichere...' : (editingProduct ? 'Aktualisieren' : 'Hinzufügen')}
                </button>
                
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter and Search */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Alle Kategorien">Alle Kategorien</option>
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suche:</label>
            <input
              type="text"
              placeholder="Modell/Hersteller suchen..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => loadProducts()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Lade...' : 'Aktualisieren'}
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Produkte ({filteredProducts.length})</h3>
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">Keine Produkte gefunden.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Kategorie</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Modell</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Hersteller</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Preis (€)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Garantie</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center gap-2">
                          {product.image_base64 && (
                            <img 
                              src={`data:image/jpeg;base64,${product.image_base64}`}
                              alt={product.model_name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          {product.model_name}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {(product.price_euro || 0).toFixed(2)}€
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.warranty_years || 0} Jahre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Bearbeiten
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id!)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
    </div>
  );
}
