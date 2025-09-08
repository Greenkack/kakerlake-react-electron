import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Center,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

function Dashboard() {
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lade gespeicherte Berechnungen aus localStorage
    const savedCalcs = localStorage.getItem('kakerlake_solar_calculations');
    if (savedCalcs) {
      try {
        const data = JSON.parse(savedCalcs);
        setCalculations(data);
        console.log('Dashboard: Berechnungen geladen', data);
      } catch (error) {
        console.error('Dashboard: Fehler beim Laden der Berechnungen:', error);
      }
    } else {
      console.log('Dashboard: Keine gespeicherten Berechnungen gefunden');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Lade Dashboard...</Text>
        </VStack>
      </Center>
    );
  }

  if (!calculations || !calculations.results) {
    return (
      <Container maxW="7xl" py={8} minH="100vh" bg="gray.50">
        <Center>
          <Card maxW="md" textAlign="center" shadow="lg">
            <CardBody p={8}>
              <Text fontSize="6xl" mb={4}>📊</Text>
              <Heading size="lg" color="gray.800" mb={4}>
                Keine Berechnungen vorhanden
              </Heading>
              <Text color="gray.600" mb={6}>
                Bitte führen Sie zuerst eine Berechnung im Solar-Rechner durch.
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate('/solar')}
              >
                Zum Solar-Rechner
              </Button>
            </CardBody>
          </Card>
        </Center>
      </Container>
    );
  }

  const { config, results } = calculations;

  // KPI Cards
  const kpiCards = [
    {
      title: 'Anlagenleistung',
      value: `${results.anlage_kwp?.toFixed(1) || 0} kWp`,
      icon: '⚡',
      color: 'bg-blue-500'
    },
    {
      title: 'Jahresertrag',
      value: `${results.annual_pv_production_kwh?.toLocaleString('de-DE') || 0} kWh`,
      icon: '☀️',
      color: 'bg-green-500'
    },
    {
      title: 'Eigenverbrauch',
      value: `${results.self_consumption_rate_percent?.toFixed(0) || 0}%`,
      icon: '🏠',
      color: 'bg-indigo-500'
    },
    {
      title: 'Autarkiegrad',
      value: `${results.autarky_rate_percent?.toFixed(0) || 0}%`,
      icon: '🔋',
      color: 'bg-purple-500'
    },
    {
      title: 'Jährliche Ersparnis',
      value: `${results.annual_savings_euro?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}`,
      icon: '💰',
      color: 'bg-yellow-500'
    },
    {
      title: 'Amortisation',
      value: `${results.payback_time_years?.toFixed(1) || 0} Jahre`,
      icon: '📈',
      color: 'bg-red-500'
    },
    {
      title: 'CO₂-Ersparnis',
      value: `${((results.annual_co2_savings_kg || 0) / 1000).toFixed(1)} t/Jahr`,
      icon: '🌍',
      color: 'bg-teal-500'
    },
    {
      title: 'Investition',
      value: `${results.total_investment_brutto?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}`,
      icon: '💳',
      color: 'bg-gray-600'
    }
  ];

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl" px={4}>
        {/* Header */}
        <Card shadow="sm" mb={6}>
          <CardBody p={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="xl" color="gray.800">Dashboard</Heading>
                <Text color="gray.600">
                  Berechnung vom {new Date(calculations.timestamp).toLocaleString('de-DE')}
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Button
                  variant="outline"
                  onClick={() => navigate('/solar')}
                >
                  Neue Berechnung
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate('/home')}
                >
                  Hauptmenü
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {kpiCards.map((kpi, index) => (
            <Card key={index} shadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={2}>
                  <Box
                    bg={kpi.color.replace('bg-', '').replace('-500', '.500')}
                    color="white"
                    fontSize="2xl"
                    w={12}
                    h={12}
                    rounded="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {kpi.icon}
                  </Box>
                  <Text fontSize="sm" color="gray.600">{kpi.title}</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">{kpi.value}</Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Detaillierte Ergebnisse */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
          {/* Energiebilanz */}
          <Card shadow="sm">
            <CardHeader>
              <Heading size="lg" color="gray.800">Energiebilanz</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">PV-Produktion</Text>
                  <Text fontWeight="medium">{results.annual_pv_production_kwh?.toLocaleString('de-DE') || 0} kWh</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Eigenverbrauch</Text>
                  <Text fontWeight="medium">{Math.round((results.annual_pv_production_kwh || 0) * (results.self_consumption_rate_percent || 0) / 100).toLocaleString('de-DE')} kWh</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Netzeinspeisung</Text>
                  <Text fontWeight="medium">{results.annual_grid_feed_kwh?.toLocaleString('de-DE') || 0} kWh</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Netzbezug</Text>
                  <Text fontWeight="medium">{results.annual_grid_consumption_kwh?.toLocaleString('de-DE') || 0} kWh</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Wirtschaftlichkeit */}
          <Card shadow="sm">
            <CardHeader>
              <Heading size="lg" color="gray.800">Wirtschaftlichkeit</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Investition (netto)</Text>
                  <Text fontWeight="medium">{results.total_investment_netto?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Investition (brutto)</Text>
                  <Text fontWeight="medium">{results.total_investment_brutto?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Jährliche Ersparnis</Text>
                  <Text fontWeight="medium">{results.annual_savings_euro?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0 €'}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Amortisationszeit</Text>
                  <Text fontWeight="medium">{results.payback_time_years?.toFixed(1) || 0} Jahre</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

        </SimpleGrid>

        {/* Umweltbilanz & Konfiguration */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
          {/* Umweltbilanz */}
          <Card shadow="sm">
            <CardHeader>
              <Heading size="lg" color="gray.800">Umweltbilanz</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="green.50" rounded="lg">
                  <HStack>
                    <Text fontSize="3xl">🌳</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Entspricht gepflanzten Bäumen</Text>
                      <Text fontSize="xl" fontWeight="bold" color="green.600">{results.tree_equivalent || 0}</Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box p={4} bg="blue.50" rounded="lg">
                  <HStack>
                    <Text fontSize="3xl">🚗</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Eingesparte Autokilometer</Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.600">{results.car_km_equivalent?.toLocaleString('de-DE') || 0} km</Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Konfiguration */}
          <Card shadow="sm">
            <CardHeader>
              <Heading size="lg" color="gray.800">Anlagenkonfiguration</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Module</Text>
                  <Text fontWeight="medium">{config?.moduleQty || 0} × {config?.moduleModel || 'Standard'}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Speicher</Text>
                  <Text fontWeight="medium">
                    {config?.withStorage ? `${results.storage_capacity_kwh || 0} kWh` : 'Ohne Speicher'}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Wechselrichter</Text>
                  <Text fontWeight="medium">{config?.invModel || 'Standard'}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Dashboard;
