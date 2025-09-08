import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { ProgressBar } from 'primereact/progressbar';
import { Timeline } from 'primereact/timeline';

function Home() {
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState<any>({
    status: 'online',
    lastUpdate: new Date(),
    projectsCount: 0,
    calculationsToday: 0
  });
  const [quickActions] = useState([
    {
      title: 'Solar Kalkulation',
      description: 'Neue PV-Anlage berechnen',
      icon: 'pi-sun',
      color: 'success',
      route: '/calc/solar',
      gradient: 'linear-gradient(45deg, #00ff00, #80ff80)'
    },
    {
      title: 'Dashboard',
      description: 'KPI-Übersicht anzeigen',
      icon: 'pi-chart-bar',
      color: 'info',
      route: '/dashboard',
      gradient: 'linear-gradient(45deg, #00ccff, #80e5ff)'
    },
    {
      title: 'Wärmepumpe',
      description: 'Wärmepumpen-Simulation',
      icon: 'pi-fire',
      color: 'warning',
      route: '/calc/heatpump',
      gradient: 'linear-gradient(45deg, #ff8c00, #ffa500)'
    },
    {
      title: 'CRM System',
      description: 'Kundenverwaltung öffnen',
      icon: 'pi-users',
      color: 'danger',
      route: '/crm/dashboard',
      gradient: 'linear-gradient(45deg, #ff4444, #ff7777)'
    },
    {
      title: 'PDF Generator',
      description: 'Angebote erstellen',
      icon: 'pi-file-pdf',
      color: 'secondary',
      route: '/pdf/standard',
      gradient: 'linear-gradient(45deg, #6366f1, #8b5cf6)'
    },
    {
      title: 'Administration',
      description: 'System verwalten',
      icon: 'pi-cog',
      color: 'help',
      route: '/admin/login',
      gradient: 'linear-gradient(45deg, #64748b, #94a3b8)'
    }
  ]);

  const recentActivities = [
    {
      status: 'Neue Berechnung erstellt',
      date: '2024-01-15 14:30',
      icon: 'pi pi-plus-circle',
      color: '#00ff00'
    },
    {
      status: 'PDF-Angebot generiert',
      date: '2024-01-15 13:15',
      icon: 'pi pi-file-pdf',
      color: '#ff8c00'
    },
    {
      status: 'Kunde hinzugefügt',
      date: '2024-01-15 11:45',
      icon: 'pi pi-user-plus',
      color: '#00ccff'
    },
    {
      status: 'Preis-Matrix aktualisiert',
      date: '2024-01-14 16:20',
      icon: 'pi pi-table',
      color: '#8b5cf6'
    }
  ];

  useEffect(() => {
    // Simuliere System-Status laden
    const loadSystemStatus = () => {
      const savedProjects = localStorage.getItem('kakerlake_projects');
      const savedCalcs = localStorage.getItem('kakerlake_solar_calculations');
      
      setSystemStatus({
        status: 'online',
        lastUpdate: new Date(),
        projectsCount: savedProjects ? JSON.parse(savedProjects).length : 0,
        calculationsToday: savedCalcs ? 1 : 0
      });
    };

    loadSystemStatus();
  }, []);

  const ActionCard = ({ action }: { action: any }) => {
    return (
      <Card className="h-full hover:scale-105 transition-transform transition-duration-300 cursor-pointer neon-glow">
        <div 
          className="text-center p-4"
          onClick={() => navigate(action.route)}
          style={{ background: action.gradient, borderRadius: '12px' }}
        >
          <div className="mb-3">
            <i className={`pi ${action.icon} text-5xl text-white`}></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
          <p className="text-white-alpha-80 text-sm">{action.description}</p>
          <Button 
            icon="pi pi-arrow-right"
            className="p-button-rounded p-button-text p-button-plain mt-2"
            style={{ color: 'white' }}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="home-container p-4 fade-in">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <i className="pi pi-bolt text-8xl text-primary neon-glow-strong"></i>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-3 neon-glow">
          KAKERLAKE
        </h1>
        <h2 className="text-3xl text-color-secondary mb-4">
          PV & Wärmepumpen Kalkulationssystem
        </h2>
        <p className="text-xl text-color-secondary max-w-4xl mx-auto">
          Professionelle Berechnung und Angebotserstellung für Photovoltaik-Anlagen und Wärmepumpen
        </p>
      </div>

      {/* System Status */}
      <Card className="mb-6 neon-glow">
        <div className="flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="flex align-items-center gap-3">
            <div className="flex align-items-center gap-2">
              <div className="w-1rem h-1rem border-round bg-green-400 animation-pulse"></div>
              <span className="font-semibold text-primary">System Status: Online</span>
            </div>
            <Badge value="Pro" severity="success" />
          </div>
          <div className="flex gap-4 text-sm text-color-secondary">
            <span>
              <i className="pi pi-folder mr-1"></i>
              {systemStatus.projectsCount} Projekte
            </span>
            <span>
              <i className="pi pi-calculator mr-1"></i>
              {systemStatus.calculationsToday} Berechnungen heute
            </span>
            <span>
              <i className="pi pi-clock mr-1"></i>
              Letzte Aktualisierung: {systemStatus.lastUpdate.toLocaleTimeString('de-DE')}
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <Panel header="⚡ Schnellzugriff" className="mb-6">
        <div className="grid">
          {quickActions.map((action, index) => (
            <div key={index} className="col-12 md:col-6 lg:col-4">
              <ActionCard action={action} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid">
        {/* Recent Activity Timeline */}
        <div className="col-12 lg:col-8">
          <Panel header="📋 Letzte Aktivitäten" className="h-full">
            <Timeline 
              value={recentActivities} 
              align="left"
              className="customized-timeline"
              marker={(item) => (
                <span 
                  className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                  style={{ backgroundColor: item.color }}
                >
                  <i className={item.icon}></i>
                </span>
              )}
              content={(item) => (
                <Card className="ml-3">
                  <div className="flex justify-content-between align-items-center">
                    <div>
                      <p className="font-semibold text-primary mb-1">{item.status}</p>
                      <p className="text-sm text-color-secondary">{item.date}</p>
                    </div>
                    <Button 
                      icon="pi pi-eye" 
                      className="p-button-rounded p-button-text p-button-sm"
                      tooltip="Details anzeigen"
                    />
                  </div>
                </Card>
              )}
            />
          </Panel>
        </div>

        {/* System Performance */}
        <div className="col-12 lg:col-4">
          <Panel header="📊 System Performance" className="h-full">
            <div className="flex flex-column gap-4">
              <div>
                <div className="flex justify-content-between mb-2">
                  <span className="text-sm text-color-secondary">CPU Auslastung</span>
                  <span className="text-sm font-semibold">23%</span>
                </div>
                <ProgressBar value={23} className="h-0-5rem" />
              </div>

              <div>
                <div className="flex justify-content-between mb-2">
                  <span className="text-sm text-color-secondary">Speicher Nutzung</span>
                  <span className="text-sm font-semibold">67%</span>
                </div>
                <ProgressBar value={67} className="h-0-5rem" />
              </div>

              <div>
                <div className="flex justify-content-between mb-2">
                  <span className="text-sm text-color-secondary">Datenbank Performance</span>
                  <span className="text-sm font-semibold">91%</span>
                </div>
                <ProgressBar value={91} className="h-0-5rem" />
              </div>

              <Divider />

              <div className="text-center">
                <i className="pi pi-shield text-3xl text-green-400 mb-2"></i>
                <p className="text-sm text-color-secondary">Alle Systeme funktionsfähig</p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Quick Stats */}
        <div className="col-12">
          <Panel header="📈 Schnellübersicht" className="mb-4">
            <div className="grid">
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-sun text-4xl text-yellow-400 mb-2"></i>
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-sm text-color-secondary">PV-Berechnungen</p>
                </div>
              </div>
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-file-pdf text-4xl text-red-400 mb-2"></i>
                  <p className="text-2xl font-bold text-primary">89</p>
                  <p className="text-sm text-color-secondary">PDF Angebote</p>
                </div>
              </div>
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-users text-4xl text-blue-400 mb-2"></i>
                  <p className="text-2xl font-bold text-primary">34</p>
                  <p className="text-sm text-color-secondary">Aktive Kunden</p>
                </div>
              </div>
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round surface-ground">
                  <i className="pi pi-euro text-4xl text-green-400 mb-2"></i>
                  <p className="text-2xl font-bold text-primary">2.3M€</p>
                  <p className="text-sm text-color-secondary">Angebotssumme</p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default Home;
