import React from "react";
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

export default function Documents(): JSX.Element {
  const header = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-file-text" />
      <span>Dokumentenerstellung</span>
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
          Standard / erweitert / Multi-PDF, Vorlagen & Optionen.
        </p>
        
        <Divider />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel header="Standard PDF" className="w-full">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-check" />
                <span>Grundlegendes Angebot</span>
              </div>
              <Button 
                label="Erstellen" 
                icon="pi pi-file-pdf" 
                className="p-button-outlined"
                size="small"
              />
            </div>
          </Panel>

          <Panel header="Erweiterte PDF" className="w-full">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-file" />
                <span>Detaillierte Analyse</span>
              </div>
              <Button 
                label="Erstellen" 
                icon="pi pi-file-pdf" 
                className="p-button-outlined"
                size="small"
              />
            </div>
          </Panel>

          <Panel header="Multi-PDF" className="w-full">
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2 text-600">
                <i className="pi pi-download" />
                <span>Mehrere Dokumente</span>
              </div>
              <Button 
                label="Konfigurieren" 
                icon="pi pi-cog" 
                className="p-button-outlined"
                size="small"
              />
            </div>
          </Panel>
        </div>

        <Divider />

        <Panel header="Vorlagen & Optionen" className="w-full">
          <div className="flex justify-content-between align-items-center">
            <div className="flex align-items-center gap-2 text-600">
              <i className="pi pi-cog" />
              <span>PDF-Vorlagen verwalten und Optionen anpassen</span>
            </div>
            <Button 
              label="Einstellungen" 
              icon="pi pi-cog" 
              className="p-button-text"
              size="small"
            />
          </div>
        </Panel>
      </div>
    </Card>
  );
}
