/* DEF: PDF-Angebotsausgabe – Hub für Standard/Erweitert/Multi/Vorschau */
import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';

// Navigationskomponente für PDF-Seiten
function PdfNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    { path: '/pdf', label: 'PDF-Hub', icon: 'pi pi-home' },
    { path: '/pdf/standard', label: 'Standard', icon: 'pi pi-file' },
    { path: '/pdf/extended', label: 'Erweitert', icon: 'pi pi-file-edit' },
    { path: '/pdf/multi', label: 'Multi-PDF', icon: 'pi pi-copy' },
    { path: '/pdf/preview', label: 'Vorschau', icon: 'pi pi-eye' }
  ];
  
  return (
    <Card className="mb-4">
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            label={item.label}
            icon={item.icon}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path 
              ? 'p-button-success' 
              : 'p-button-outlined'
            }
          />
        ))}
      </div>
    </Card>
  );
}

// PDF-Hub Hauptseite
function PdfHubMain() {
  const navigate = useNavigate();
  
  const pdfFeatures = [
    {
      title: 'Standard PDF',
      description: 'Schnelle Standard-PDF-Generierung für Angebote',
      icon: 'pi pi-file',
      color: 'success',
      action: () => navigate('/pdf/standard'),
      features: ['Basis-Angebot', 'Standardlayout', 'Schnell generiert']
    },
    {
      title: 'Erweiterte PDF',
      description: 'Detaillierte PDF mit erweiterten Funktionen',
      icon: 'pi pi-file-edit',
      color: 'primary', 
      action: () => navigate('/pdf/extended'),
      features: ['Detaillierte Berechnungen', 'Grafiken', 'Anpassbares Layout']
    },
    {
      title: 'Multi-PDF Generator',
      description: 'Mehrere PDFs gleichzeitig erstellen',
      icon: 'pi pi-copy',
      color: 'info',
      action: () => navigate('/pdf/multi'),
      features: ['Batch-Verarbeitung', 'Multiple Szenarien', 'Bulk-Export']
    },
    {
      title: 'PDF Vorschau',
      description: 'Live-Vorschau vor der Generierung',
      icon: 'pi pi-eye',
      color: 'warning',
      action: () => navigate('/pdf/preview'),
      features: ['Live-Preview', 'Bearbeitung', 'Echtzeitupdate']
    }
  ];

  const recentPdfs = [
    {
      name: 'Angebot_Mustermann_2024.pdf',
      date: '2024-01-15',
      size: '2.3 MB',
      status: 'success'
    },
    {
      name: 'Kostenvoranschlag_Schmidt.pdf', 
      date: '2024-01-14',
      size: '1.8 MB',
      status: 'success'
    },
    {
      name: 'Vergleichsangebot_Weber.pdf',
      date: '2024-01-13',
      size: '3.1 MB',
      status: 'pending'
    }
  ];

  const statistics = [
    { label: 'PDFs heute', value: '12', icon: 'pi pi-file', color: 'success' },
    { label: 'Diese Woche', value: '47', icon: 'pi pi-calendar', color: 'primary' },
    { label: 'Dieser Monat', value: '184', icon: 'pi pi-chart-bar', color: 'info' },
    { label: 'Gesamt', value: '1,247', icon: 'pi pi-database', color: 'warning' }
  ];

  return (
    <div className="pdf-hub-main">
      {/* Statistiken */}
      <div className="grid mb-4">
        {statistics.map((stat, index) => (
          <div key={index} className="col-12 md:col-3">
            <Card>
              <div className="flex align-items-center">
                <Avatar
                  icon={stat.icon}
                  className={`p-overlay-badge mr-3 bg-${stat.color}-100 text-${stat.color}-600`}
                  size="large"
                  shape="circle"
                />
                <div>
                  <div className="text-2xl font-bold text-900">{stat.value}</div>
                  <div className="text-600">{stat.label}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* PDF-Features Grid */}
      <div className="grid">
        {pdfFeatures.map((feature, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Card className="h-full hover:shadow-4 transition-all transition-duration-300 cursor-pointer">
              <div className="text-center">
                <Avatar
                  icon={feature.icon}
                  className={`p-overlay-badge mb-3 bg-${feature.color}-100 text-${feature.color}-600`}
                  size="xlarge"
                  shape="circle"
                />
                <h4 className="text-900 font-semibold mb-2">{feature.title}</h4>
                <p className="text-600 mb-3">{feature.description}</p>
                
                <div className="mb-4">
                  {feature.features.map((feat, idx) => (
                    <Chip key={idx} label={feat} className="mr-2 mb-2" />
                  ))}
                </div>
                
                <Button
                  label="Öffnen"
                  icon="pi pi-arrow-right"
                  className={`p-button-${feature.color} w-full`}
                  onClick={feature.action}
                />
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Divider />

      {/* Zuletzt erstellte PDFs */}
      <Panel header="Zuletzt erstellt" className="mt-4">
        <div className="grid">
          {recentPdfs.map((pdf, index) => (
            <div key={index} className="col-12 md:col-4">
              <Card className="hover:shadow-2 transition-all transition-duration-300">
                <div className="flex align-items-center justify-content-between">
                  <div className="flex align-items-center">
                    <i className="pi pi-file-pdf text-red-500 text-2xl mr-3"></i>
                    <div>
                      <div className="font-semibold text-900 mb-1">{pdf.name}</div>
                      <div className="text-600 text-sm">{pdf.date} • {pdf.size}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-download"
                      className="p-button-rounded p-button-outlined p-button-sm"
                      tooltip="Download"
                    />
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-outlined p-button-sm"
                      tooltip="Vorschau"
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// Standard PDF Komponente (Platzhalter)
function StandardPdf() {
  return (
    <Panel header="Standard PDF Generator">
      <div className="text-center p-6">
        <Avatar icon="pi pi-file" size="xlarge" className="mb-3" />
        <h3>Standard PDF Generator</h3>
        <p className="text-600 mb-4">Erstellen Sie schnell Standard-PDFs für Ihre Angebote</p>
        <Button label="PDF erstellen" icon="pi pi-plus" className="p-button-success" />
      </div>
    </Panel>
  );
}

// Erweiterte PDF Komponente (Platzhalter)
function ExtendedPdf() {
  return (
    <Panel header="Erweiterte PDF Generator">
      <div className="text-center p-6">
        <Avatar icon="pi pi-file-edit" size="xlarge" className="mb-3" />
        <h3>Erweiterte PDF Generator</h3>
        <p className="text-600 mb-4">Erstellen Sie detaillierte PDFs mit erweiterten Funktionen</p>
        <Button label="Erweiterte PDF erstellen" icon="pi pi-plus" className="p-button-primary" />
      </div>
    </Panel>
  );
}

// Multi PDF Komponente (Platzhalter)
function MultiPdf() {
  return (
    <Panel header="Multi-PDF Generator">
      <div className="text-center p-6">
        <Avatar icon="pi pi-copy" size="xlarge" className="mb-3" />
        <h3>Multi-PDF Generator</h3>
        <p className="text-600 mb-4">Erstellen Sie mehrere PDFs gleichzeitig</p>
        <Button label="Batch-PDF erstellen" icon="pi pi-plus" className="p-button-info" />
      </div>
    </Panel>
  );
}

// PDF Vorschau Komponente (Platzhalter)
function PdfPreview() {
  return (
    <Panel header="PDF Vorschau">
      <div className="text-center p-6">
        <Avatar icon="pi pi-eye" size="xlarge" className="mb-3" />
        <h3>PDF Vorschau</h3>
        <p className="text-600 mb-4">Live-Vorschau Ihrer PDFs vor der Generierung</p>
        <Button label="Vorschau starten" icon="pi pi-eye" className="p-button-warning" />
      </div>
    </Panel>
  );
}

// Hauptkomponente
export default function PdfHub() {
  return (
    <div className="pdf-hub-container p-4">
      <PdfNavigation />
      
      <Routes>
        <Route path="/" element={<PdfHubMain />} />
        <Route path="/standard" element={<StandardPdf />} />
        <Route path="/extended" element={<ExtendedPdf />} />
        <Route path="/multi" element={<MultiPdf />} />
        <Route path="/preview" element={<PdfPreview />} />
      </Routes>
    </div>
  );
}
