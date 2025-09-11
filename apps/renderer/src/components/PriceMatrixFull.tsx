import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';

interface PriceMatrixEntry {
  id?: number;
  capacity_kw?: number;
  price_without_storage?: number;
  price_with_5kwh?: number;
  price_with_10kwh?: number;
  price_with_15kwh?: number;
  price_with_20kwh?: number;
  price_with_25kwh?: number;
  price_custom?: number;
  additional_notes?: string;
  valid_from?: string;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}

interface PriceMatrixFormData extends Omit<PriceMatrixEntry, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
}

const PriceMatrixFull: React.FC = () => {
  const [priceEntries, setPriceEntries] = useState<PriceMatrixEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PriceMatrixFormData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  
  const toast = useRef<Toast>(null);

  // Form state
  const [formData, setFormData] = useState<PriceMatrixFormData>({
    capacity_kw: 0,
    price_without_storage: 0,
    price_with_5kwh: 0,
    price_with_10kwh: 0,
    price_with_15kwh: 0,
    price_with_20kwh: 0,
    price_with_25kwh: 0,
    price_custom: 0,
    additional_notes: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: ''
  });

  // Load price matrix from database/admin settings
  const loadPriceMatrix = async () => {
    setLoading(true);
    try {
      const adminAPI = (window as any).adminAPI;
      if (!adminAPI) {
        throw new Error('Admin API not available');
      }

      // Try to get price matrix from admin settings
      const result = await adminAPI.getSettings();
      if (result?.success && result.data?.priceMatrix) {
        // Convert price matrix format to entries
        const matrix = result.data.priceMatrix;
        const entries: PriceMatrixEntry[] = [];
        
        Object.keys(matrix).forEach((capacity, index) => {
          const capacityNum = parseFloat(capacity);
          if (!isNaN(capacityNum)) {
            entries.push({
              id: index + 1,
              capacity_kw: capacityNum,
              price_without_storage: matrix[capacity]['Ohne Speicher'] || 0,
              price_with_5kwh: matrix[capacity]['5 kWh'] || 0,
              price_with_10kwh: matrix[capacity]['10 kWh'] || 0,
              price_with_15kwh: matrix[capacity]['15 kWh'] || 0,
              price_with_20kwh: matrix[capacity]['20 kWh'] || 0,
              price_with_25kwh: matrix[capacity]['25 kWh'] || 0,
              additional_notes: 'Aus Admin-Einstellungen',
              valid_from: new Date().toISOString().split('T')[0]
            });
          }
        });

        setPriceEntries(entries);
        toast.current?.show({
          severity: 'success',
          summary: 'Erfolgreich',
          detail: `${entries.length} Preiseinträge geladen`
        });
      } else {
        // Generate sample data if no matrix exists
        const sampleData = generateSamplePriceMatrix();
        setPriceEntries(sampleData);
        toast.current?.show({
          severity: 'info',
          summary: 'Info',
          detail: 'Beispiel-Preisdaten geladen. Bitte echte Daten hochladen.'
        });
      }
    } catch (error) {
      console.error('Failed to load price matrix:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Preismatrix konnte nicht geladen werden'
      });
      
      // Load sample data as fallback
      const sampleData = generateSamplePriceMatrix();
      setPriceEntries(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePriceMatrix = (): PriceMatrixEntry[] => {
    const capacities = [3, 5, 7, 10, 12, 15, 20, 25, 30];
    return capacities.map((capacity, index) => ({
      id: index + 1,
      capacity_kw: capacity,
      price_without_storage: capacity * 1200,
      price_with_5kwh: capacity * 1200 + 5000,
      price_with_10kwh: capacity * 1200 + 8000,
      price_with_15kwh: capacity * 1200 + 11000,
      price_with_20kwh: capacity * 1200 + 14000,
      price_with_25kwh: capacity * 1200 + 17000,
      price_custom: capacity * 1200,
      additional_notes: 'Beispieldaten',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: ''
    }));
  };

  useEffect(() => {
    loadPriceMatrix();
  }, []);

  // Form handling
  const handleFormChange = (field: keyof PriceMatrixFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // File upload for bulk import
  const handleFileUpload = async (event: any, isDryRun: boolean = false) => {
    const files = event.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLoading(true);

    try {
      const adminAPI = (window as any).adminAPI;
      if (!adminAPI) {
        throw new Error('Admin API not available');
      }

      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      const result = await adminAPI.uploadPriceMatrix({
        filename: file.name,
        data: Array.from(uint8Array),
        file_extension: file.name.split('.').pop()?.toLowerCase(),
        dry_run: isDryRun
      });
      
      if (result?.success) {
        const message = isDryRun 
          ? `Probelauf abgeschlossen: Preismatrix würde aktualisiert werden`
          : `Preismatrix erfolgreich hochgeladen!`;
        
        toast.current?.show({
          severity: 'success',
          summary: isDryRun ? 'Probelauf' : 'Upload',
          detail: message
        });
        
        if (!isDryRun) {
          await loadPriceMatrix();
        }
      } else {
        throw new Error(result?.error || 'Unbekannter Fehler');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: `${isDryRun ? 'Probelauf' : 'Upload'} fehlgeschlagen: ${error}`
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.capacity_kw || formData.capacity_kw <= 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Kapazität (kW) ist ein Pflichtfeld!'
      });
      return;
    }

    setLoading(true);
    try {
      if (editingEntry?.id) {
        // Update existing entry
        const updatedEntries = priceEntries.map(entry => 
          entry.id === editingEntry.id ? { ...formData, id: editingEntry.id } : entry
        );
        setPriceEntries(updatedEntries);
      } else {
        // Add new entry
        const newEntry = { 
          ...formData, 
          id: Math.max(...priceEntries.map(e => e.id || 0)) + 1,
          created_at: new Date().toISOString()
        };
        setPriceEntries([...priceEntries, newEntry]);
      }
      
      toast.current?.show({
        severity: 'success',
        summary: 'Erfolgreich',
        detail: editingEntry?.id ? 'Preiseintrag aktualisiert' : 'Preiseintrag hinzugefügt'
      });
      
      resetForm();
    } catch (error) {
      console.error('Submit failed:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Fehler beim Speichern des Preiseintrags'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: PriceMatrixEntry) => {
    setEditingEntry(entry);
    setFormData({ ...entry });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: 'Möchten Sie diesen Preiseintrag wirklich löschen?',
      header: 'Bestätigung',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const updatedEntries = priceEntries.filter(entry => entry.id !== id);
        setPriceEntries(updatedEntries);
        toast.current?.show({
          severity: 'success',
          summary: 'Erfolgreich',
          detail: 'Preiseintrag gelöscht'
        });
      }
    });
  };

  const resetForm = () => {
    setFormData({
      capacity_kw: 0,
      price_without_storage: 0,
      price_with_5kwh: 0,
      price_with_10kwh: 0,
      price_with_15kwh: 0,
      price_with_20kwh: 0,
      price_with_25kwh: 0,
      price_custom: 0,
      additional_notes: '',
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: ''
    });
    setEditingEntry(null);
    setIsFormOpen(false);
  };

  // Column templates
  const capacityBodyTemplate = (rowData: PriceMatrixEntry) => {
    return <Tag value={`${rowData.capacity_kw} kW`} severity="info" />;
  };

  const priceBodyTemplate = (price: number) => {
    return price ? `€${price.toLocaleString('de-DE')}` : '-';
  };

  const dateBodyTemplate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('de-DE');
  };

  const actionBodyTemplate = (rowData: PriceMatrixEntry) => {
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
        label="Neuer Preiseintrag"
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
        onClick={() => loadPriceMatrix()}
        className="p-button-info"
      />
    </div>
  );

  const endContent = (
    <div className="flex align-items-center gap-3">
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

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card title="💰 Preismatrix - VOLLSTÄNDIG MIT CRUD" className="shadow-lg">
        <div className="mb-4">
          {/* File Upload Section */}
          <Card title="📊 Preismatrix Import" className="mb-4 bg-green-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5>📈 Preisdaten-Import</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Laden Sie Excel (.xlsx) oder CSV-Dateien mit Preismatrix hoch
                </p>
                <FileUpload
                  mode="basic"
                  name="price-matrix"
                  accept=".xlsx,.csv"
                  chooseLabel="💾 Preismatrix hochladen"
                  onUpload={(e) => handleFileUpload(e, false)}
                  customUpload
                  auto={false}
                />
              </div>
              <div>
                <h5>🔍 Validierungs-Check</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Testen Sie den Import ohne Änderungen zu speichern
                </p>
                <FileUpload
                  mode="basic"
                  name="price-matrix-dry"
                  accept=".xlsx,.csv"
                  chooseLabel="✅ Validierung starten"
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
          value={priceEntries}
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
          emptyMessage="❌ Keine Preiseinträge gefunden"
        >
          <Column field="id" header="ID" sortable style={{ width: '80px' }} />
          <Column field="capacity_kw" header="Kapazität" body={capacityBodyTemplate} sortable />
          <Column field="price_without_storage" header="Ohne Speicher" body={(data) => priceBodyTemplate(data.price_without_storage)} sortable />
          <Column field="price_with_5kwh" header="5 kWh" body={(data) => priceBodyTemplate(data.price_with_5kwh)} sortable />
          <Column field="price_with_10kwh" header="10 kWh" body={(data) => priceBodyTemplate(data.price_with_10kwh)} sortable />
          <Column field="price_with_15kwh" header="15 kWh" body={(data) => priceBodyTemplate(data.price_with_15kwh)} sortable />
          <Column field="price_with_20kwh" header="20 kWh" body={(data) => priceBodyTemplate(data.price_with_20kwh)} sortable />
          <Column field="price_with_25kwh" header="25 kWh" body={(data) => priceBodyTemplate(data.price_with_25kwh)} sortable />
          <Column field="valid_from" header="Gültig ab" body={(data) => dateBodyTemplate(data.valid_from)} sortable />
          <Column body={actionBodyTemplate} header="🔧 Aktionen" style={{ width: '120px' }} />
        </DataTable>
      </Card>

      {/* Price Entry Form Dialog */}
      <Dialog
        visible={isFormOpen}
        style={{ width: '60vw' }}
        header={editingEntry?.id ? '✏️ Preiseintrag bearbeiten' : '➕ Neuer Preiseintrag'}
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
            <h4>⚡ Grunddaten</h4>
          </div>
          
          <div className="field">
            <label htmlFor="capacity_kw">Kapazität (kW) *</label>
            <InputNumber
              id="capacity_kw"
              value={formData.capacity_kw}
              onValueChange={(e) => handleFormChange('capacity_kw', e.value)}
              className="w-full"
              minFractionDigits={1}
              maxFractionDigits={2}
            />
          </div>

          <div className="field">
            <label htmlFor="additional_notes">Notizen</label>
            <InputText
              id="additional_notes"
              value={formData.additional_notes || ''}
              onChange={(e) => handleFormChange('additional_notes', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Price Information */}
          <div className="col-span-2">
            <h4>💰 Preise (€)</h4>
          </div>

          <div className="field">
            <label htmlFor="price_without_storage">Ohne Speicher</label>
            <InputNumber
              id="price_without_storage"
              value={formData.price_without_storage}
              onValueChange={(e) => handleFormChange('price_without_storage', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="price_with_5kwh">Mit 5 kWh Speicher</label>
            <InputNumber
              id="price_with_5kwh"
              value={formData.price_with_5kwh}
              onValueChange={(e) => handleFormChange('price_with_5kwh', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="price_with_10kwh">Mit 10 kWh Speicher</label>
            <InputNumber
              id="price_with_10kwh"
              value={formData.price_with_10kwh}
              onValueChange={(e) => handleFormChange('price_with_10kwh', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="price_with_15kwh">Mit 15 kWh Speicher</label>
            <InputNumber
              id="price_with_15kwh"
              value={formData.price_with_15kwh}
              onValueChange={(e) => handleFormChange('price_with_15kwh', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="price_with_20kwh">Mit 20 kWh Speicher</label>
            <InputNumber
              id="price_with_20kwh"
              value={formData.price_with_20kwh}
              onValueChange={(e) => handleFormChange('price_with_20kwh', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="price_with_25kwh">Mit 25 kWh Speicher</label>
            <InputNumber
              id="price_with_25kwh"
              value={formData.price_with_25kwh}
              onValueChange={(e) => handleFormChange('price_with_25kwh', e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
              className="w-full"
            />
          </div>

          {/* Validity Period */}
          <div className="col-span-2">
            <h4>📅 Gültigkeitszeitraum</h4>
          </div>

          <div className="field">
            <label htmlFor="valid_from">Gültig ab</label>
            <InputText
              id="valid_from"
              type="date"
              value={formData.valid_from || ''}
              onChange={(e) => handleFormChange('valid_from', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="field">
            <label htmlFor="valid_until">Gültig bis (optional)</label>
            <InputText
              id="valid_until"
              type="date"
              value={formData.valid_until || ''}
              onChange={(e) => handleFormChange('valid_until', e.target.value)}
              className="w-full"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default PriceMatrixFull;