import React from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Link } from "react-router-dom";

export default function CRMMenu(): JSX.Element {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-900 mb-2">
          <i className="pi pi-users mr-2"></i>
          CRM – Kundenverwaltung
        </h1>
        <p className="text-600 text-lg">
          Kundenverwaltung, Workflows, Kalender und Projekt-Pipeline.
        </p>
      </div>

      <Card className="mb-4">
        <Message 
          severity="info" 
          text="Das CRM-System wird bald mit umfangreichen Kundenverwaltungs-Features erweitert." 
          className="mb-4"
        />
        
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-4">
            <Card 
              title="📋 Kunden" 
              className="h-full surface-100"
              footer={
                <Button 
                  label="Bald verfügbar" 
                  icon="pi pi-clock" 
                  className="w-full" 
                  disabled 
                />
              }
            >
              <p className="text-600">Kundendaten verwalten und bearbeiten</p>
            </Card>
          </div>
          
          <div className="col-12 md:col-6 lg:col-4">
            <Card 
              title="📅 Kalender" 
              className="h-full surface-100"
              footer={
                <Button 
                  label="Bald verfügbar" 
                  icon="pi pi-clock" 
                  className="w-full" 
                  disabled 
                />
              }
            >
              <p className="text-600">Termine und Erinnerungen verwalten</p>
            </Card>
          </div>
          
          <div className="col-12 md:col-6 lg:col-4">
            <Card 
              title="🔄 Pipeline" 
              className="h-full surface-100"
              footer={
                <Button 
                  label="Bald verfügbar" 
                  icon="pi pi-clock" 
                  className="w-full" 
                  disabled 
                />
              }
            >
              <p className="text-600">Projekt-Workflows und Status tracking</p>
            </Card>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Link to="/home">
          <Button 
            label="Zurück zur Startseite" 
            icon="pi pi-arrow-left" 
            severity="secondary" 
            outlined 
          />
        </Link>
      </div>
    </div>
  );
}
