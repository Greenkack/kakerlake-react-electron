import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';

interface AdminMenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: 'system' | 'content' | 'users' | 'analytics';
  status?: 'active' | 'maintenance' | 'new';
}

const adminMenuItems: AdminMenuItem[] = [
  // System Management
  {
    id: 'settings',
    title: 'Systemeinstellungen',
    description: 'Grundeinstellungen der Anwendung verwalten',
    icon: 'pi pi-cog',
    path: '/admin/settings',
    category: 'system'
  },
  {
    id: 'database',
    title: 'Datenbank-Verwaltung',
    description: 'Backup, Import/Export und Datenbankwartung',
    icon: 'pi pi-database',
    path: '/admin/database',
    category: 'system'
  },
  {
    id: 'pricing',
    title: 'Preismatrix-Management',
    description: 'Preise und Kalkulationsgrundlagen verwalten',
    icon: 'pi pi-money-bill',
    path: '/admin/pricing',
    category: 'content'
  },
  {
    id: 'products',
    title: 'Produktverwaltung',
    description: 'Solar-Module, Wechselrichter und Speicher verwalten',
    icon: 'pi pi-box',
    path: '/admin/products',
    category: 'content'
  },
  {
    id: 'users',
    title: 'Benutzerverwaltung',
    description: 'Nutzer, Rollen und Berechtigungen verwalten',
    icon: 'pi pi-users',
    path: '/admin/users',
    category: 'users'
  },
  {
    id: 'analytics',
    title: 'Systemanalyse',
    description: 'Leistung, Statistiken und Berichte',
    icon: 'pi pi-chart-line',
    path: '/admin/analytics',
    category: 'analytics',
    status: 'new'
  }
];

const categoryLabels = {
  system: 'System',
  content: 'Inhalte',
  users: 'Benutzer',
  analytics: 'Analyse'
};

const categoryColors = {
  system: 'info',
  content: 'success',
  users: 'help',
  analytics: 'warning'
};

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory 
    ? adminMenuItems.filter(item => item.category === selectedCategory)
    : adminMenuItems;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <Badge value="NEU" severity="success" />;
      case 'maintenance':
        return <Badge value="WARTUNG" severity="warning" />;
      case 'active':
        return <Badge value="AKTIV" severity="info" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-900 mb-2">
          <i className="pi pi-shield mr-2"></i>
          Admin Dashboard
        </h1>
        <p className="text-600 text-lg">Systemverwaltung und Konfiguration</p>
      </div>

      {/* Category Filter */}
      <Card title="📋 Kategorien" className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            label="Alle" 
            severity={selectedCategory === null ? "info" : "secondary"}
            outlined={selectedCategory !== null}
            onClick={() => setSelectedCategory(null)}
            className="mb-2"
          />
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button 
              key={key}
              label={label}
              severity={selectedCategory === key ? categoryColors[key as keyof typeof categoryColors] as any : "secondary"}
              outlined={selectedCategory !== key}
              onClick={() => setSelectedCategory(key)}
              className="mb-2"
            />
          ))}
        </div>
      </Card>

      {/* Admin Menu Items */}
      <div className="grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="col-12 md:col-6 lg:col-4">
            <Card 
              className={`h-full surface-100 hover:surface-200 transition-colors transition-duration-200`}
              footer={
                <Link to={item.path}>
                  <Button 
                    label="Öffnen" 
                    icon="pi pi-external-link" 
                    className="w-full"
                    severity={categoryColors[item.category] as any}
                  />
                </Link>
              }
            >
              <div className="flex align-items-center gap-3 mb-3">
                <i className={`${item.icon} text-3xl text-${categoryColors[item.category]}`}></i>
                <div>
                  <h3 className="text-xl font-semibold text-900 mb-1">{item.title}</h3>
                  {getStatusBadge(item.status)}
                </div>
              </div>
              <p className="text-600 line-height-3">{item.description}</p>
            </Card>
          </div>
        ))}
      </div>

      <Divider className="my-6" />

      {/* System Status */}
      <Card title="🖥️ System-Status" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-3">
            <div className="text-center">
              <i className="pi pi-check-circle text-4xl text-green-500 mb-2"></i>
              <div className="text-lg font-bold text-green-600">Online</div>
              <div className="text-sm text-600">System Status</div>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="text-center">
              <i className="pi pi-database text-4xl text-blue-500 mb-2"></i>
              <div className="text-lg font-bold text-blue-600">Aktiv</div>
              <div className="text-sm text-600">Datenbank</div>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="text-center">
              <i className="pi pi-users text-4xl text-purple-500 mb-2"></i>
              <div className="text-lg font-bold text-purple-600">3</div>
              <div className="text-sm text-600">Aktive Nutzer</div>
            </div>
          </div>
          <div className="col-12 md:col-3">
            <div className="text-center">
              <i className="pi pi-calendar text-4xl text-orange-500 mb-2"></i>
              <div className="text-lg font-bold text-orange-600">Heute</div>
              <div className="text-sm text-600">Letztes Backup</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="⚡ Schnellaktionen" className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            label="Backup erstellen" 
            icon="pi pi-download" 
            severity="success" 
            outlined 
          />
          <Button 
            label="System neustarten" 
            icon="pi pi-refresh" 
            severity="warning" 
            outlined 
          />
          <Button 
            label="Logs anzeigen" 
            icon="pi pi-list" 
            severity="info" 
            outlined 
          />
          <Button 
            label="Cache leeren" 
            icon="pi pi-trash" 
            severity="danger" 
            outlined 
          />
        </div>
      </Card>
    </div>
  );
}
