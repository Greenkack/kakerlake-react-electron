import React, { useState } from "react";
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressBar } from 'primereact/progressbar';

// Extended Documents with PDF Bridge Integration
declare global {
  interface Window {
    pdfAPI: any;
  }
}

interface PDFConfig {
  customer_name: string;
  customer_address: string;
  project_description: string;
  include_cover: boolean;
  include_calculations: boolean;
  include_diagrams: boolean;
  template_type: 'standard' | 'extended' | 'premium';
}

export default function Documents(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfConfig, setPdfConfig] = useState<PDFConfig>({
    customer_name: 'Max Mustermann',
    customer_address: 'Musterstraße 123, 12345 Musterstadt',
    project_description: 'Photovoltaik-Anlage 10 kWp mit Batteriespeicher',
    include_cover: true,
    include_calculations: true,
    include_diagrams: true,
    template_type: 'standard'
  });

  const handlePDFGeneration = async (type: 'standard' | 'extended' | 'multi') => {
    setLoading(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      // Sample project data for PDF generation
      const projectData = {
        customer_name: pdfConfig.customer_name,
        customer_address: pdfConfig.customer_address,
        project_description: pdfConfig.project_description,
        system_power_kwp: 10.5,
        annual_yield_kwh: 11000,
        investment_total: 25000,
        roi_percent: 8.5
      };

      let result;
      
      switch (type) {
        case 'standard':
          result = await window.pdfAPI.generateStandardPDF(projectData);
          break;
        case 'extended':
          result = await window.pdfAPI.generateExtendedPDF({
            ...projectData,
            include_calculations: pdfConfig.include_calculations,
            include_diagrams: pdfConfig.include_diagrams
          });
          break;
        case 'multi':
          result = await window.pdfAPI.generateMultiPDF({
            ...projectData,
            templates: ['offer', 'calculations', 'technical']
          });
          break;
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (result && result.success) {
        // Simulate download or show success
        setTimeout(() => {
          alert(`${type.toUpperCase()} PDF erfolgreich erstellt!`);
          setProgress(0);
        }, 1000);
      } else {
        alert(`Fehler bei der PDF-Erstellung: ${result?.message || 'Unbekannter Fehler'}`);
        setProgress(0);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF-Erstellung fehlgeschlagen');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-file-pdf" />
      <span>📄 Dokumentenerstellung mit PDF-Bridge</span>
    </div>
  );

  return (
    <Card 
      title={header}
      className="m-3"
      pt={{
        body: { className: 'p-4' },
        content: { className: 'p-0' }
      }}
    >
      <div className="space-y-4">
        <p className="text-700 mb-4">
          🚀 Professionelle PDF-Erstellung mit integrierter Bridge-Technologie
        </p>
        
        {/* PDF Configuration */}
        <Panel header="⚙️ PDF-Konfiguration" className="w-full mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-column gap-2">
              <label htmlFor="customer-name" className="font-semibold">Kundenname</label>
              <InputText 
                id="customer-name"
                value={pdfConfig.customer_name}
                onChange={(e) => setPdfConfig(prev => ({ ...prev, customer_name: e.target.value }))}
                placeholder="Kundenname eingeben"
              />
            </div>
            
            <div className="flex flex-column gap-2">
              <label htmlFor="customer-address" className="font-semibold">Kundenadresse</label>
              <InputText 
                id="customer-address"
                value={pdfConfig.customer_address}
                onChange={(e) => setPdfConfig(prev => ({ ...prev, customer_address: e.target.value }))}
                placeholder="Adresse eingeben"
              />
            </div>
            
            <div className="flex flex-column gap-2 md:col-span-2">
              <label htmlFor="project-description" className="font-semibold">Projektbeschreibung</label>
              <InputTextarea 
                id="project-description"
                value={pdfConfig.project_description}
                onChange={(e) => setPdfConfig(prev => ({ ...prev, project_description: e.target.value }))}
                rows={3}
                placeholder="Projektbeschreibung eingeben"
              />
            </div>
          </div>
        </Panel>

        {/* Progress Bar */}
        {loading && (
          <Panel header="🔄 PDF wird erstellt..." className="w-full mb-4">
            <ProgressBar value={progress} className="mb-2" />
            <p className="text-sm text-600">
              {progress < 30 ? 'Daten werden vorbereitet...' :
               progress < 60 ? 'PDF wird generiert...' :
               progress < 90 ? 'Template wird angewendet...' : 'Fertigstellung...'}
            </p>
          </Panel>
        )}
        
        <Divider />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel header="📄 Standard PDF" className="w-full">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-check" />
                <span>Grundlegendes Angebot</span>
              </div>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-check" />
                <span>Deckblatt & Anschreiben</span>
              </div>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-check" />
                <span>Basis-Kalkulation</span>
              </div>
              <Button 
                label="Standard PDF erstellen" 
                icon="pi pi-file-pdf" 
                className="p-button-outlined p-button-primary"
                size="small"
                loading={loading}
                onClick={() => handlePDFGeneration('standard')}
                disabled={loading}
              />
            </div>
          </Panel>

          <Panel header="📊 Erweiterte PDF" className="w-full">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-file" />
                <span>Detaillierte Analyse</span>
              </div>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-chart-line" />
                <span>Wirtschaftlichkeitsanalyse</span>
              </div>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-chart-bar" />
                <span>Diagramme & Charts</span>
              </div>
              <Button 
                label="Erweiterte PDF erstellen" 
                icon="pi pi-file-pdf" 
                className="p-button-outlined p-button-success"
                size="small"
                loading={loading}
                onClick={() => handlePDFGeneration('extended')}
                disabled={loading}
              />
            </div>
          </Panel>

          <Panel header="📦 Multi-PDF" className="w-full">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-download" />
                <span>Mehrere Dokumente</span>
              </div>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-folder" />
                <span>Angebot + Berechnungen</span>
              </div>
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-file-excel" />
                <span>Technische Dokumentation</span>
              </div>
              <Button 
                label="Multi-PDF erstellen" 
                icon="pi pi-download" 
                className="p-button-outlined p-button-warning"
                size="small"
                loading={loading}
                onClick={() => handlePDFGeneration('multi')}
                disabled={loading}
              />
            </div>
          </Panel>
        </div>

        <Divider />

        <Panel header="🛠️ PDF-Bridge Funktionen" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-column gap-3">
              <h4 className="mt-0">🎨 Template-Engine</h4>
              <p className="text-600 text-sm">Dynamische PDF-Erstellung mit Overlay-Technologie</p>
              <Button 
                label="Template verwalten" 
                icon="pi pi-palette" 
                className="p-button-text p-button-sm"
                disabled={loading}
              />
            </div>
            
            <div className="flex flex-column gap-3">
              <h4 className="mt-0">📋 Validierung</h4>
              <p className="text-600 text-sm">Automatische Datenvalidierung vor PDF-Erstellung</p>
              <Button 
                label="Daten validieren" 
                icon="pi pi-check-circle" 
                className="p-button-text p-button-sm"
                disabled={loading}
              />
            </div>

            <div className="flex flex-column gap-3">
              <h4 className="mt-0">📊 Live-Integration</h4>
              <p className="text-600 text-sm">Direkte Übernahme aus Calculation-Bridge</p>
              <Button 
                label="Berechnungen laden" 
                icon="pi pi-refresh" 
                className="p-button-text p-button-sm"
                disabled={loading}
              />
            </div>

            <div className="flex flex-column gap-3">
              <h4 className="mt-0">🔄 Batch-Processing</h4>
              <p className="text-600 text-sm">Mehrere PDFs gleichzeitig erstellen</p>
              <Button 
                label="Batch starten" 
                icon="pi pi-play" 
                className="p-button-text p-button-sm"
                disabled={loading}
              />
            </div>
          </div>
        </Panel>
      </div>
    </Card>
  );
}
