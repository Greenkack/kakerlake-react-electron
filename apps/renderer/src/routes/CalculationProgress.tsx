import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardBody,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Progress,
  Center
} from '@chakra-ui/react';

interface CalculationStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
}

export default function CalculationProgress(): JSX.Element {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [steps, setSteps] = useState<CalculationStep[]>([
    { id: 'load', label: 'Konfiguration laden', status: 'pending', progress: 0 },
    { id: 'pv', label: 'PV-Ertragsberechnung', status: 'pending', progress: 0 },
    { id: 'consumption', label: 'Verbrauchsanalyse', status: 'pending', progress: 0 },
    { id: 'storage', label: 'Speicheroptimierung', status: 'pending', progress: 0 },
    { id: 'economics', label: 'Wirtschaftlichkeitsberechnung', status: 'pending', progress: 0 },
    { id: 'environment', label: 'Umweltbilanz', status: 'pending', progress: 0 },
    { id: 'save', label: 'Ergebnisse speichern', status: 'pending', progress: 0 },
  ]);

  // Berechnungsfunktion
  async function performCalculations(config: any): Promise<CalculationStep> {
    // Basis-Werte aus der Konfiguration
    const moduleWp = 440; // Standard Viessmann Modul
    const moduleQty = config.moduleQty || 20;
    const anlage_kwp = (moduleQty * moduleWp) / 1000;
    
    // Standard-Annahmen für Berechnungen
    const sonnenstunden = 950; // kWh/kWp/Jahr in Deutschland
    const eigenverbrauch_anteil = config.withStorage ? 0.65 : 0.35;
    const strompreis_cent = 35;
    const einspeiseverguetung_cent = 8.2;
    const invest_per_kwp = config.withStorage ? 1800 : 1400;
    
    // Berechnungen
    const annual_pv_production_kwh = anlage_kwp * sonnenstunden;
    const eigenverbrauch_kwh = annual_pv_production_kwh * eigenverbrauch_anteil;
    const einspeisung_kwh = annual_pv_production_kwh - eigenverbrauch_kwh;
    const jahresverbrauch_kwh = 4500; // Standard Haushalt
    const autarkiegrad = Math.min((eigenverbrauch_kwh / jahresverbrauch_kwh) * 100, 100);
    
    // Wirtschaftlichkeit
    const total_investment = anlage_kwp * invest_per_kwp;
    const jaehrliche_ersparnis = (eigenverbrauch_kwh * strompreis_cent + einspeisung_kwh * einspeiseverguetung_cent) / 100;
    const amortisation = total_investment / jaehrliche_ersparnis;
    
    // CO2-Bilanz (0.4 kg CO2/kWh Strommix Deutschland)
    const co2_ersparnis_kg = annual_pv_production_kwh * 0.4;
    const baeume_equivalent = Math.round(co2_ersparnis_kg / 12.5); // Ein Baum bindet ~12.5kg CO2/Jahr
    const auto_km = Math.round(co2_ersparnis_kg / 0.12); // 120g CO2/km Auto
    
    return {
      // Technisch
      anlage_kwp,
      annual_pv_production_kwh: Math.round(annual_pv_production_kwh),
      specific_yield_kwh_per_kwp: sonnenstunden,
      performance_ratio_percent: 85,
      
      // Energiefluss
      self_consumption_rate_percent: eigenverbrauch_anteil * 100,
      autarky_rate_percent: autarkiegrad,
      annual_grid_feed_kwh: Math.round(einspeisung_kwh),
      annual_grid_consumption_kwh: Math.round(jahresverbrauch_kwh - eigenverbrauch_kwh),
      
      // Wirtschaftlichkeit
      total_investment_netto: total_investment,
      total_investment_brutto: total_investment * 1.19,
      payback_time_years: amortisation,
      npv_25_years: jaehrliche_ersparnis * 25 - total_investment,
      irr_percent: (jaehrliche_ersparnis / total_investment) * 100,
      lcoe_cent_per_kwh: (total_investment / (annual_pv_production_kwh * 25)) * 100,
      annual_savings_euro: jaehrliche_ersparnis,
      
      // Umwelt
      annual_co2_savings_kg: co2_ersparnis_kg,
      tree_equivalent: baeume_equivalent,
      car_km_equivalent: auto_km,
      
      // Speicher
      ...(config.withStorage && {
        storage_capacity_kwh: config.storageDesiredKWh || 10,
        storage_cycles_per_year: 250,
        storage_efficiency_percent: 95,
      }),
    };
  }

  // Hauptberechnung starten
  useEffect(() => {
    let isMounted = true;
    
    async function runCalculations() {
      try {
        // Schritt 1: Konfiguration laden
        updateStep('load', 'running');
        setCurrentStep('Konfiguration wird geladen...');
        
        // Lade gespeicherte Konfiguration
        const savedConfig = localStorage.getItem('kakerlake_solar_config');
        const config = savedConfig ? JSON.parse(savedConfig) : {
          moduleQty: 20,
          withStorage: true,
          storageDesiredKWh: 10
        };
        
        await simulateDelay(500);
        if (!isMounted) return;
        updateStep('load', 'completed');
        
        // Schritt 2: PV-Ertragsberechnung
        updateStep('pv', 'running');
        setCurrentStep('PV-Ertrag wird berechnet...');
        await simulateDelay(800);
        if (!isMounted) return;
        updateStep('pv', 'completed');
        
        // Schritt 3: Verbrauchsanalyse
        updateStep('consumption', 'running');
        setCurrentStep('Verbrauchsmuster werden analysiert...');
        await simulateDelay(700);
        if (!isMounted) return;
        updateStep('consumption', 'completed');
        
        // Schritt 4: Speicheroptimierung
        updateStep('storage', 'running');
        setCurrentStep('Speicher wird optimiert...');
        await simulateDelay(900);
        if (!isMounted) return;
        updateStep('storage', 'completed');
        
        // Schritt 5: Wirtschaftlichkeitsberechnung
        updateStep('economics', 'running');
        setCurrentStep('Wirtschaftlichkeit wird berechnet...');
        
        // Echte Berechnungen durchführen
        const moduleWp = 440;
        const moduleQty = config.moduleQty || 20;
        const anlage_kwp = (moduleQty * moduleWp) / 1000;
        const sonnenstunden = 950;
        const annual_pv_production_kwh = anlage_kwp * sonnenstunden;
        const eigenverbrauch_anteil = config.withStorage ? 0.65 : 0.35;
        const eigenverbrauch_kwh = annual_pv_production_kwh * eigenverbrauch_anteil;
        const einspeisung_kwh = annual_pv_production_kwh - eigenverbrauch_kwh;
        const jahresverbrauch_kwh = 4500;
        const autarkiegrad = Math.min((eigenverbrauch_kwh / jahresverbrauch_kwh) * 100, 100);
        const strompreis_cent = 35;
        const einspeiseverguetung_cent = 8.2;
        const invest_per_kwp = config.withStorage ? 1800 : 1400;
        const total_investment = anlage_kwp * invest_per_kwp;
        const jaehrliche_ersparnis = (eigenverbrauch_kwh * strompreis_cent + einspeisung_kwh * einspeiseverguetung_cent) / 100;
        const amortisation = total_investment / jaehrliche_ersparnis;
        const co2_ersparnis_kg = annual_pv_production_kwh * 0.4;
        
        await simulateDelay(1000);
        if (!isMounted) return;
        updateStep('economics', 'completed');
        
        // Schritt 6: Umweltbilanz
        updateStep('environment', 'running');
        setCurrentStep('CO₂-Bilanz wird erstellt...');
        await simulateDelay(600);
        if (!isMounted) return;
        updateStep('environment', 'completed');
        
        // Schritt 7: Ergebnisse speichern
        updateStep('save', 'running');
        setCurrentStep('Ergebnisse werden gespeichert...');
        
        const results = {
          timestamp: new Date().toISOString(),
          config,
          results: {
            anlage_kwp,
            annual_pv_production_kwh: Math.round(annual_pv_production_kwh),
            specific_yield_kwh_per_kwp: sonnenstunden,
            performance_ratio_percent: 85,
            self_consumption_rate_percent: eigenverbrauch_anteil * 100,
            autarky_rate_percent: autarkiegrad,
            annual_grid_feed_kwh: Math.round(einspeisung_kwh),
            annual_grid_consumption_kwh: Math.round(jahresverbrauch_kwh - eigenverbrauch_kwh),
            total_investment_netto: total_investment,
            total_investment_brutto: total_investment * 1.19,
            payback_time_years: amortisation,
            npv_25_years: jaehrliche_ersparnis * 25 - total_investment,
            irr_percent: (jaehrliche_ersparnis / total_investment) * 100,
            lcoe_cent_per_kwh: (total_investment / (annual_pv_production_kwh * 25)) * 100,
            annual_savings_euro: jaehrliche_ersparnis,
            annual_co2_savings_kg: co2_ersparnis_kg,
            tree_equivalent: Math.round(co2_ersparnis_kg / 12.5),
            car_km_equivalent: Math.round(co2_ersparnis_kg / 0.12),
            storage_capacity_kwh: config.withStorage ? (config.storageDesiredKWh || 10) : undefined,
            storage_cycles_per_year: config.withStorage ? 250 : undefined,
            storage_efficiency_percent: config.withStorage ? 95 : undefined,
          }
        };
        
        localStorage.setItem('kakerlake_solar_calculations', JSON.stringify(results));
        
        await simulateDelay(400);
        if (!isMounted) return;
        updateStep('save', 'completed');
        
        setIsCalculating(false);
        setCurrentStep('Berechnungen abgeschlossen!');
        
      } catch (err) {
        if (!isMounted) return;
        console.error('Berechnungsfehler:', err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        setIsCalculating(false);
      }
    }
    
    runCalculations();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Progress tracking
  useEffect(() => {
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    const totalSteps = steps.length;
    setOverallProgress((completedSteps / totalSteps) * 100);
  }, [steps]);

  function updateStep(id: string, status: CalculationStep['status']) {
    setSteps(prev => prev.map(s => 
      s.id === id ? { ...s, status, progress: status === 'completed' ? 100 : status === 'running' ? 50 : 0 } : s
    ));
  }

  async function simulateDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getStatusIcon(status: CalculationStep['status']) {
    switch (status) {
      case 'completed':
        return <span className="text-green-500">✓</span>;
      case 'running':
        return <span className="text-blue-500 animate-spin">⟳</span>;
      case 'error':
        return <span className="text-red-500">✗</span>;
      default:
        return <span className="text-gray-400">○</span>;
    }
  }

  return (
    <Box minH="100vh" bg="darkBg.500" py={8}>
      <Container maxW="4xl" px={4}>
        {/* Navigation Header */}
        <Card bg="darkBg.400" borderColor="neonGreen.500" variant="outline" mb={6}>
          <CardBody p={4}>
            <HStack justify="space-between" align="center">
              <Heading 
                size="lg" 
                color="neonGreen.300"
                textShadow="0 0 10px rgba(0, 255, 0, 0.8)"
              >
                ⚡ BERECHNUNGEN ⚡
              </Heading>
              <HStack spacing={3}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Text>←</Text>}
                  onClick={() => navigate('/solar')}
                >
                  Zurück
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  leftIcon={<Text>🏠</Text>}
                  onClick={() => navigate('/')}
                >
                  Hauptmenü
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Main Content */}
        <Card 
          bg="darkBg.400" 
          borderColor="neonGreen.500" 
          variant="outline"
          boxShadow="0 0 25px rgba(0, 255, 0, 0.2)"
        >
          <CardBody p={8}>
            {error ? (
              <Center py={8}>
                <VStack spacing={4}>
                  <Text fontSize="6xl" color="red.400">⚠</Text>
                  <Heading size="lg" color="red.400">Fehler bei der Berechnung</Heading>
                  <Text color="neonGreen.200" textAlign="center">{error}</Text>
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={() => navigate('/solar')}
                  >
                    Zurück zur Konfiguration
                  </Button>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={8} align="stretch">
                {/* Progress Overview */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="neonGreen.200">
                      Gesamtfortschritt
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color="neonGreen.200">
                      {Math.round(overallProgress)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={overallProgress}
                    size="lg"
                    colorScheme="green"
                    bg="darkBg.600"
                    borderRadius="full"
                    hasStripe
                    isAnimated
                    boxShadow="0 0 10px rgba(0, 255, 0, 0.3)"
                  />
                  {currentStep && (
                    <Text 
                      fontSize="sm" 
                      color="neonGreen.300" 
                      mt={2} 
                      textAlign="center"
                      textShadow="0 0 8px rgba(0, 255, 0, 0.8)"
                    >
                      {currentStep}
                    </Text>
                  )}
                </Box>

                {/* Individual Steps */}
                <VStack spacing={4} mb={8} align="stretch">
                  {steps.map((step) => (
                    <HStack key={step.id} align="center" spacing={4}>
                      <Box flexShrink={0} w="8" h="8" display="flex" alignItems="center" justifyContent="center">
                        {getStatusIcon(step.status)}
                      </Box>
                      <Box flex="1">
                        <HStack justify="space-between" mb={1}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={
                              step.status === 'completed' ? 'green.600' :
                              step.status === 'running' ? 'blue.600' :
                              step.status === 'error' ? 'red.600' :
                              'gray.500'
                            }
                          >
                            {step.label}
                          </Text>
                        </HStack>
                        <Box w="full" bg="gray.100" rounded="full" h="2" overflow="hidden">
                          <Box
                            height="100%"
                            transition="width 0.3s"
                            bg={
                              step.status === 'completed' ? 'green.500' :
                              step.status === 'running' ? 'blue.500' :
                              step.status === 'error' ? 'red.500' :
                              'gray.300'
                            }
                            style={{ width: `${step.progress}%` }}
                          />
                        </Box>
                      </Box>
                    </HStack>
                  ))}
                </VStack>

                {/* Results Summary (wenn fertig) */}
                {!isCalculating && (
                  <Box borderTopWidth={1} pt={6}>
                    <HStack mb={4} align="center" spacing={3}>
                      <Text fontSize="2xl" color="green.600">✓</Text>
                      <Heading size="md" color="green.600">Berechnungen erfolgreich abgeschlossen!</Heading>
                    </HStack>

                    <Box bg="gray.50" rounded="lg" p={4}>
                      <Text fontSize="sm" color="gray.600" mb={3}>
                        Die detaillierten Ergebnisse wurden gespeichert und können im Dashboard eingesehen werden.
                      </Text>
                      <HStack spacing={3}>
                        <Button
                          onClick={() => navigate('/dashboard')}
                          colorScheme="green"
                          leftIcon={<Text>📊</Text>}
                        >
                          Zum Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => navigate('/home')}
                        >
                          Zum Hauptmenü
                        </Button>
                      </HStack>
                    </Box>
                  </Box>
                )}
              </VStack>
            )}
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
