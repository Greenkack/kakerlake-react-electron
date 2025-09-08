import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';

export default function Documents() {
    return (
        <div className="p-4">
            <Card 
                title="📄 Dokumentenerstellung" 
                subTitle="Standard / erweitert / Multi-PDF, Vorlagen & Optionen"
                className="mb-4 surface-card"
            >
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-4">
                        <Card 
                            title="Standard PDF" 
                            className="h-full surface-100"
                            footer={
                                <Button 
                                    label="Erstellen" 
                                    icon="pi pi-file-pdf" 
                                    className="p-button-success w-full"
                                />
                            }
                        >
                            <p className="text-600">Standardangebot mit allen wichtigen Informationen</p>
                            <Badge value="Schnell" severity="success" className="mt-2" />
                        </Card>
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-4">
                        <Card 
                            title="Erweitertes PDF" 
                            className="h-full surface-100"
                            footer={
                                <Button 
                                    label="Erstellen" 
                                    icon="pi pi-file-excel" 
                                    className="p-button-warning w-full"
                                />
                            }
                        >
                            <p className="text-600">Detaillierte Analyse mit Wirtschaftlichkeitsrechnung</p>
                            <Badge value="Detailliert" severity="warning" className="mt-2" />
                        </Card>
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-4">
                        <Card 
                            title="Multi-PDF Suite" 
                            className="h-full surface-100"
                            footer={
                                <Button 
                                    label="Erstellen" 
                                    icon="pi pi-folder" 
                                    className="p-button-info w-full"
                                />
                            }
                        >
                            <p className="text-600">Komplettes Dokumentenpaket für Profis</p>
                            <Badge value="Komplett" severity="info" className="mt-2" />
                        </Card>
                    </div>
                </div>
                
                <Divider />
                
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <h3 className="text-primary">📋 Vorlagen verwalten</h3>
                        <Button 
                            label="Vorlagen öffnen" 
                            icon="pi pi-cog" 
                            className="p-button-outlined"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6">
                        <h3 className="text-primary">⚙️ Optionen</h3>
                        <Button 
                            label="Einstellungen" 
                            icon="pi pi-sliders-h" 
                            className="p-button-outlined"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
