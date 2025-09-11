import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

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

const ProductManagementFull: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  
  const toast = useRef<Toast>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    category: 'modul',
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

  // Categories matching database exactly
  const categories = [
    { label: 'Alle Kategorien', value: '' },
    { label: 'Modul', value: 'modul' },
    { label: 'Wechselrichter', value: 'Wechselrichter' },
    { label: 'Batteriespeicher', value: 'Batteriespeicher' },
    { label: 'Wallbox', value: 'Wallbox' },
    { label: 'Carport', value: 'Carport' },
    { label: 'Energiemanagementsystem', value: 'Energiemanagementsystem' },
    { label: 'Leistungsoptimierer', value: 'Leistungsoptimierer' },
    { label: 'Notstromversorgung', value: 'Notstromversorgung' },
    { label: 'Tierabwehrschutz', value: 'Tierabwehrschutz' },
    { label: 'Extrakosten', value: 'Extrakosten' }
  ];

  // Load products from database with comprehensive debugging
  const loadProducts = async (category?: string) => {
    console.log('🚀 DEBUG: loadProducts started', { category });
    setLoading(true);
    
    try {
      console.log('🔍 DEBUG: Checking window.databaseAPI...');
      const databaseAPI = (window as any).databaseAPI;
      
      if (!databaseAPI) {
        console.error('❌ DEBUG: Database API not available on window');
        console.log('📋 DEBUG: Available window properties:', Object.keys(window));
        throw new Error('Database API not available');
      }
      
      console.log('✅ DEBUG: Database API found:', databaseAPI);
      console.log('📋 DEBUG: databaseAPI methods:', Object.keys(databaseAPI));
      
      if (!databaseAPI.listProducts) {
        console.error('❌ DEBUG: listProducts method not found');
        throw new Error('listProducts method not available');
      }
      
      console.log('🔄 DEBUG: Calling databaseAPI.listProducts with category:', category || null);
      const result = await databaseAPI.listProducts(category || null);
      console.log('📦 DEBUG: Raw result from database:', result);
      console.log('📊 DEBUG: Result type:', typeof result);
      console.log('📊 DEBUG: Is array?', Array.isArray(result));
      
      // Handle both direct array response and wrapped response
      if (Array.isArray(result)) {
        console.log('✅ DEBUG: Direct array response with', result.length, 'items');
        console.log('📋 DEBUG: First item sample:', result[0]);
        setProducts(result);
        toast.current?.show({
          severity: 'success',
          summary: 'Erfolgreich',
          detail: `${result.length} Produkte geladen (Direct Array)`
        });
      } else if (result?.success) {
        console.log('✅ DEBUG: Wrapped response with success=true');
        console.log('📦 DEBUG: result.data:', result.data);
        console.log('📊 DEBUG: result.data length:', result.data?.length);
        if (result.data && result.data.length > 0) {
          console.log('📋 DEBUG: First data item sample:', result.data[0]);
        }
        setProducts(result.data || []);
        toast.current?.show({
          severity: 'success',
          summary: 'Erfolgreich',
          detail: `${result.data?.length || 0} Produkte geladen (Wrapped Response)`
        });
      } else {
        console.error('❌ DEBUG: Unexpected result format:', result);
        console.log('📊 DEBUG: result.success:', result?.success);
        console.log('📊 DEBUG: result.error:', result?.error);
        throw new Error(result?.error || 'Failed to load products');
      }
      
      console.log('✅ DEBUG: loadProducts completed successfully');
    } catch (error) {
      console.error('❌ DEBUG: Exception in loadProducts:', error);
      console.error('📊 DEBUG: Error type:', typeof error);
      console.error('📊 DEBUG: Error constructor:', error?.constructor?.name);
      console.error('📊 DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: `Fehler beim Laden der Produkte: ${errorMessage}`
      });
    } finally {
      console.log('🏁 DEBUG: loadProducts finally block, setting loading=false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🎯 DEBUG: useEffect triggered - Initial load');
    console.log('📊 DEBUG: Component mounted, starting initial product load');
    loadProducts();
  }, []);

  // Handle category filter change with debugging
  const handleCategoryChange = (category: string) => {
    console.log('🔄 DEBUG: Category filter changed to:', category);
    setSelectedCategory(category);
    console.log('🔄 DEBUG: Loading products for category:', category || 'ALL');
    loadProducts(category || undefined);
  };

  // Form handling
  const handleFormChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: any) => {
    const files = event.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Datei zu groß! Maximum 2MB'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      handleFormChange('image_base64', base64Data);
      toast.current?.show({
        severity: 'success',
        summary: 'Erfolgreich',
        detail: 'Bild hochgeladen'
      });
    };
    reader.readAsDataURL(file);
  };

  // File upload for bulk import
  const handleFileUpload = async (event: any, isDryRun: boolean = false) => {
    const files = event.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLoading(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      const result = await (window as any).databaseAPI?.importProductsFromFile?.({
        filename: file.name,
        data: Array.from(uint8Array),
        file_extension: file.name.split('.').pop()?.toLowerCase(),
        dry_run: isDryRun
      });
      
      if (result?.success) {
        const message = isDryRun 
          ? `Probelauf abgeschlossen: ${(result.created || 0) + (result.updated || 0)} Produkte würden verarbeitet`
          : `Import erfolgreich! ${result.created || 0} neue, ${result.updated || 0} aktualisiert`;
        
        toast.current?.show({
          severity: 'success',
          summary: isDryRun ? 'Probelauf' : 'Import',
          detail: message
        });
        
        if (!isDryRun) {
          await loadProducts();
        }
      } else {
        throw new Error(result?.error || 'Unbekannter Fehler');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: `${isDryRun ? 'Probelauf' : 'Import'} fehlgeschlagen: ${error}`
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations with comprehensive debugging
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 DEBUG: Form submit started');
    console.log('📋 DEBUG: Form data:', formData);
    console.log('📋 DEBUG: Editing product:', editingProduct);
    
    if (!formData.model_name?.trim() || !formData.category) {
      console.warn('⚠️ DEBUG: Validation failed - missing required fields');
      console.log('📊 DEBUG: model_name:', formData.model_name);
      console.log('📊 DEBUG: category:', formData.category);
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Modellname und Kategorie sind Pflichtfelder!'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 DEBUG: Checking database API...');
      const databaseAPI = (window as any).databaseAPI;
      if (!databaseAPI) {
        console.error('❌ DEBUG: Database API not available in submit');
        throw new Error('Database API not available');
      }
      
      console.log('✅ DEBUG: Database API found, proceeding with operation');

      let result;
      if (editingProduct?.id) {
        console.log('🔄 DEBUG: Updating existing product with ID:', editingProduct.id);
        if (!databaseAPI.updateProduct) {
          console.error('❌ DEBUG: updateProduct method not found');
          throw new Error('updateProduct method not available');
        }
        result = await databaseAPI.updateProduct(editingProduct.id, formData);
        console.log('📦 DEBUG: Update result:', result);
      } else {
        console.log('➕ DEBUG: Adding new product');
        if (!databaseAPI.addProduct) {
          console.error('❌ DEBUG: addProduct method not found');
          throw new Error('addProduct method not available');
        }
        result = await databaseAPI.addProduct(formData);
        console.log('📦 DEBUG: Add result:', result);
      }
      
      if (result?.success || result) {
        console.log('✅ DEBUG: Operation successful');
        toast.current?.show({
          severity: 'success',
          summary: 'Erfolgreich',
          detail: editingProduct?.id ? 'Produkt aktualisiert' : 'Produkt hinzugefügt'
        });
        console.log('🔄 DEBUG: Resetting form and reloading products');
        resetForm();
        await loadProducts();
      } else {
        console.error('❌ DEBUG: Operation failed with result:', result);
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('❌ DEBUG: Exception in handleSubmit:', error);
      console.error('📊 DEBUG: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Fehler beim Speichern des Produkts'
      });
    } finally {
      console.log('🏁 DEBUG: handleSubmit finally block');
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    console.log('✏️ DEBUG: Edit product triggered for:', product);
    console.log('📋 DEBUG: Product ID:', product.id);
    setEditingProduct(product);
    setFormData({ ...product });
    setIsFormOpen(true);
    console.log('✅ DEBUG: Edit form opened');
  };

  const handleDelete = (id: number) => {
    console.log('🗑️ DEBUG: Delete confirmation for product ID:', id);
    confirmDialog({
      message: 'Möchten Sie dieses Produkt wirklich löschen?',
      header: 'Bestätigung',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        console.log('✅ DEBUG: Delete confirmed, proceeding...');
        setLoading(true);
        try {
          console.log('🔍 DEBUG: Checking database API for delete...');
          const databaseAPI = (window as any).databaseAPI;
          if (!databaseAPI) {
            console.error('❌ DEBUG: Database API not available for delete');
            throw new Error('Database API not available');
          }
          
          if (!databaseAPI.deleteProduct) {
            console.error('❌ DEBUG: deleteProduct method not found');
            throw new Error('deleteProduct method not available');
          }

          console.log('🔄 DEBUG: Calling deleteProduct with ID:', id);
          const result = await databaseAPI.deleteProduct(id);
          console.log('📦 DEBUG: Delete result:', result);
          
          if (result?.success || result) {
            console.log('✅ DEBUG: Delete successful');
            toast.current?.show({
              severity: 'success',
              summary: 'Erfolgreich',
              detail: 'Produkt gelöscht'
            });
            console.log('🔄 DEBUG: Reloading products after delete');
            await loadProducts();
          } else {
            console.error('❌ DEBUG: Delete failed with result:', result);
            throw new Error('Delete failed');
          }
        } catch (error) {
          console.error('❌ DEBUG: Exception in delete operation:', error);
          console.error('📊 DEBUG: Delete error details:', {
            message: error instanceof Error ? error.message : 'Unknown',
            stack: error instanceof Error ? error.stack : 'No stack'
          });
          toast.current?.show({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Fehler beim Löschen des Produkts'
          });
        } finally {
          console.log('🏁 DEBUG: Delete operation finally block');
          setLoading(false);
        }
      }
    });
  };

  const resetForm = () => {
    console.log('🔄 DEBUG: Resetting form');
    setFormData({
      category: 'modul',
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
    console.log('✅ DEBUG: Form reset completed');
  };

  // Column templates
  const categoryBodyTemplate = (rowData: Product) => {
    return <Tag value={rowData.category} severity="info" />;
  };

  const priceBodyTemplate = (rowData: Product) => {
    return rowData.price_euro ? `€${rowData.price_euro.toFixed(2)}` : '-';
  };

  const capacityBodyTemplate = (rowData: Product) => {
    if (rowData.capacity_w) return `${rowData.capacity_w}W`;
    if (rowData.power_kw) return `${rowData.power_kw}kW`;
    if (rowData.storage_power_kw) return `${rowData.storage_power_kw}kWh`;
    return '-';
  };

  const imageBodyTemplate = (rowData: Product) => {
    if (rowData.image_base64) {
      return (
        <Image 
          src={`data:image/png;base64,${rowData.image_base64}`}
          alt={rowData.model_name}
          width="50"
          height="50"
          preview
        />
      );
    }
    return <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
      <i className="pi pi-image text-gray-400"></i>
    </div>;
  };

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => handleEdit(rowData)}
          tooltip="Bearbeiten"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData.id!)}
          tooltip="Löschen"
        />
      </div>
    );
  };

  // Toolbar content
  const startContent = (
    <div className="flex align-items-center gap-2">
      <Button
        label="Neues Produkt"
        icon="pi pi-plus"
        onClick={() => {
          resetForm();
          setIsFormOpen(true);
        }}
        className="p-button-success"
      />
      <Button
        label="Aktualisieren"
        icon="pi pi-refresh"
        onClick={() => loadProducts()}
        className="p-button-info"
      />
    </div>
  );

  const endContent = (
    <div className="flex align-items-center gap-3">
      <Dropdown
        value={selectedCategory}
        options={categories}
        onChange={(e) => handleCategoryChange(e.value)}
        placeholder="Kategorie wählen"
        className="w-200px"
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Suchen..."
        />
      </span>
    </div>
  );

  // Debug logging
  console.log('🎨 DEBUG: ProductManagement render started');
  console.log('📊 DEBUG: Current state:', {
    productsCount: products.length,
    loading,
    selectedCategory,
    isFormOpen,
    editingProductId: editingProduct?.id
  });
  console.log('📊 DEBUG: About to render DataTable with products:', products);
  console.log('📊 DEBUG: Products array length:', products.length);
  if (products.length > 0) {
    console.log('📋 DEBUG: First product sample:', products[0]);
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card title="Produktverwaltung - VOLLSTÄNDIG MIT CRUD" className="shadow-lg">
        <div className="mb-4">
          {/* Debug Info Panel */}
          <Card title="🐛 DEBUG INFORMATION" className="mb-4 bg-yellow-50">
            <div className="text-sm">
              <p><strong>Produkte geladen:</strong> {products.length}</p>
              <p><strong>Loading:</strong> {loading ? 'JA' : 'NEIN'}</p>
              <p><strong>Kategorie-Filter:</strong> {selectedCategory || 'ALLE'}</p>
              <p><strong>Form offen:</strong> {isFormOpen ? 'JA' : 'NEIN'}</p>
              <p><strong>Bearbeitung:</strong> {editingProduct?.id ? `ID ${editingProduct.id}` : 'KEINE'}</p>
              <p><strong>Database API verfügbar:</strong> {(window as any).databaseAPI ? 'JA' : 'NEIN'}</p>
              {(window as any).databaseAPI && (
                <p><strong>API Methoden:</strong> {Object.keys((window as any).databaseAPI).join(', ')}</p>
              )}
            </div>
          </Card>
          
          {/* File Upload Section */}
          <Card title="📂 Bulk-Import (Excel/CSV)" className="mb-4 bg-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5>🚀 Daten-Import</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Laden Sie Excel (.xlsx) oder CSV-Dateien hoch. Pflichtfelder: model_name, category
                </p>
                <FileUpload
                  mode="basic"
                  name="products"
                  accept=".xlsx,.csv"
                  chooseLabel="📄 Datei wählen"
                  onUpload={(e) => handleFileUpload(e, false)}
                  customUpload
                  auto={false}
                />
              </div>
              <div>
                <h5>🧪 Probelauf</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Testen Sie den Import ohne Änderungen zu speichern
                </p>
                <FileUpload
                  mode="basic"
                  name="products-dry"
                  accept=".xlsx,.csv"
                  chooseLabel="🔍 Probelauf starten"
                  onUpload={(e) => handleFileUpload(e, true)}
                  customUpload
                  auto={false}
                />
              </div>
            </div>
          </Card>

          <Toolbar start={startContent} end={endContent} className="mb-4" />
        </div>

        {loading && (
          <div className="flex justify-center p-4">
            <ProgressSpinner />
          </div>
        )}

        <DataTable
          value={products}
          paginator
          rows={rows}
          rowsPerPageOptions={[10, 25, 50]}
          globalFilter={globalFilter}
          first={first}
          onPage={(e) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
          className="p-datatable-sm"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          emptyMessage="❌ Keine Produkte gefunden"
        >
          <Column field="id" header="ID" sortable style={{ width: '80px' }} />
          <Column field="category" header="Kategorie" body={categoryBodyTemplate} sortable />
          <Column field="model_name" header="Modell" sortable />
          <Column field="brand" header="Hersteller" sortable />
          <Column field="price_euro" header="Preis" body={priceBodyTemplate} sortable />
          <Column header="Kapazität" body={capacityBodyTemplate} />
          <Column header="Bild" body={imageBodyTemplate} style={{ width: '100px' }} />
          <Column body={actionBodyTemplate} header="🔧 Aktionen" style={{ width: '120px' }} />
        </DataTable>
      </Card>

      {/* Product Form Dialog */}
      <Dialog
        visible={isFormOpen}
        style={{ width: '50vw' }}
        header={editingProduct?.id ? '✏️ Produkt bearbeiten' : '➕ Neues Produkt'}
        modal
        onHide={resetForm}
        footer={
          <div>
            <Button
              label="❌ Abbrechen"
              icon="pi pi-times"
              onClick={resetForm}
              className="p-button-text"
            />
            <Button
              label="💾 Speichern"
              icon="pi pi-check"
              onClick={handleSubmit}
              loading={loading}
            />
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="col-span-2">
            <h4>📋 Grunddaten</h4>
          </div>
          
          <div className="field">
            <label htmlFor="category">Kategorie *</label>
            <Dropdown
              id="category"
              value={formData.category}
              options={categories.filter(c => c.value)}
              onChange={(e) => handleFormChange('category', e.value)}
              placeholder="Kategorie wählen"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="model_name">Modellname *</label>
            <InputText
              id="model_name"
              value={formData.model_name || ''}
              onChange={(e) => handleFormChange('model_name', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="brand">Hersteller</label>
            <InputText
              id="brand"
              value={formData.brand || ''}
              onChange={(e) => handleFormChange('brand', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="price_euro">Preis (€)</label>
            <InputNumber
              id="price_euro"
              value={formData.price_euro}
              onValueChange={(e) => handleFormChange('price_euro', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          {/* Technical Specifications */}
          <div className="col-span-2">
            <h4>⚡ Technische Daten</h4>
          </div>

          <div className="field">
            <label htmlFor="capacity_w">Kapazität (W)</label>
            <InputNumber
              id="capacity_w"
              value={formData.capacity_w}
              onValueChange={(e) => handleFormChange('capacity_w', e.value)}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="power_kw">Leistung (kW)</label>
            <InputNumber
              id="power_kw"
              value={formData.power_kw}
              onValueChange={(e) => handleFormChange('power_kw', e.value)}
              className="w-full"
              minFractionDigits={1}
              maxFractionDigits={3}
            />
          </div>

          <div className="field">
            <label htmlFor="storage_power_kw">Speicherkapazität (kWh)</label>
            <InputNumber
              id="storage_power_kw"
              value={formData.storage_power_kw}
              onValueChange={(e) => handleFormChange('storage_power_kw', e.value)}
              className="w-full"
              minFractionDigits={1}
              maxFractionDigits={3}
            />
          </div>

          <div className="field">
            <label htmlFor="efficiency_percent">Wirkungsgrad (%)</label>
            <InputNumber
              id="efficiency_percent"
              value={formData.efficiency_percent}
              onValueChange={(e) => handleFormChange('efficiency_percent', e.value)}
              className="w-full"
              suffix="%"
              minFractionDigits={1}
              maxFractionDigits={2}
            />
          </div>

          <div className="field">
            <label htmlFor="warranty_years">Garantie (Jahre)</label>
            <InputNumber
              id="warranty_years"
              value={formData.warranty_years}
              onValueChange={(e) => handleFormChange('warranty_years', e.value)}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="origin_country">Herkunftsland</label>
            <InputText
              id="origin_country"
              value={formData.origin_country || ''}
              onChange={(e) => handleFormChange('origin_country', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <div className="field">
              <label htmlFor="description">Beschreibung</label>
              <InputTextarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <div className="field">
              <label>🖼️ Produktbild</label>
              <FileUpload
                mode="basic"
                name="image"
                accept="image/*"
                maxFileSize={2000000}
                chooseLabel="🎨 Bild wählen"
                onUpload={handleImageUpload}
                customUpload
                auto={false}
              />
              {formData.image_base64 && (
                <Image
                  src={`data:image/png;base64,${formData.image_base64}`}
                  alt="Preview"
                  width="100"
                  className="mt-2"
                />
              )}
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ProductManagementFull;