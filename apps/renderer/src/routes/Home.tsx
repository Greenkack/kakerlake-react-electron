import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Badge,
  Divider,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: '⚡ Solar Kalkulator',
      description: 'Neue PV-Anlage berechnen',
      action: () => navigate('/calc/solar'),
      color: 'neonGreen',
      glow: true
    },
    {
      title: '📊 Dashboard',
      description: 'Ergebnisse & KPIs anzeigen',
      action: () => navigate('/dashboard'),
      color: 'blue',
      glow: false
    },
    {
      title: '🔥 Wärmepumpe',
      description: 'Wärmepumpen-Simulation',
      action: () => navigate('/calc/heatpump'),
      color: 'red',
      glow: false
    },
    {
      title: '📄 PDF Hub',
      description: 'Angebote generieren',
      action: () => navigate('/pdf/standard'),
      color: 'purple',
      glow: false
    }
  ];

  const stats = [
    { label: 'Berechnungen', value: '1,247', change: '+12%' },
    { label: 'PV-Anlagen', value: '89', change: '+8%' },
    { label: 'Gesamt kWp', value: '2,156', change: '+23%' },
    { label: 'CO₂ Ersparnis', value: '847t', change: '+15%' }
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        
        {/* Hero Section */}
        <Box textAlign="center" py={12}>
          <Heading 
            size="2xl" 
            color="neonGreen.400" 
            textShadow="0 0 20px rgba(0, 255, 0, 0.8)"
            fontFamily="heading"
            mb={4}
          >
            ⚡ KAKERLAKE ENERGY ⚡
          </Heading>
          <Text 
            fontSize="xl" 
            color="neonGreen.200" 
            mb={6}
            textShadow="0 0 10px rgba(0, 255, 0, 0.5)"
          >
            Professional Solar & Heat Pump Calculator
          </Text>
          <HStack justify="center" spacing={4}>
            <Button
              size="lg"
              variant="solid"
              rightIcon={<Text>🚀</Text>}
              onClick={() => navigate('/calc/solar')}
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.8)',
              }}
              transition="all 0.3s ease"
            >
              Jetzt starten
            </Button>
            <Button
              size="lg"
              variant="outline"
              rightIcon={<Text>📊</Text>}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </HStack>
        </Box>

        <Divider borderColor="neonGreen.700" />

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              bg="darkBg.400" 
              borderColor="neonGreen.800" 
              variant="outline"
              _hover={{
                borderColor: 'neonGreen.500',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.3s ease"
            >
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color="neonGreen.200" fontSize="sm">
                    {stat.label}
                  </StatLabel>
                  <StatNumber 
                    color="neonGreen.400" 
                    fontSize="2xl"
                    textShadow="0 0 10px rgba(0, 255, 0, 0.6)"
                  >
                    {stat.value}
                  </StatNumber>
                  <StatHelpText color="green.300">
                    {stat.change} heute
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Box>
          <Heading 
            size="lg" 
            color="neonGreen.300" 
            mb={6} 
            textAlign="center"
            textShadow="0 0 10px rgba(0, 255, 0, 0.5)"
          >
            Schnellzugriff
          </Heading>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                bg="darkBg.400"
                borderColor={action.glow ? "neonGreen.500" : "neonGreen.800"}
                variant="outline"
                cursor="pointer"
                onClick={action.action}
                _hover={{
                  borderColor: 'neonGreen.400',
                  boxShadow: action.glow 
                    ? '0 0 25px rgba(0, 255, 0, 0.6)' 
                    : '0 0 15px rgba(0, 255, 0, 0.3)',
                  transform: 'translateY(-3px)',
                }}
                transition="all 0.3s ease"
                position="relative"
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <HStack justify="space-between" w="full">
                      <Heading 
                        size="md" 
                        color="neonGreen.300"
                        textShadow={action.glow ? "0 0 15px rgba(0, 255, 0, 0.8)" : "none"}
                      >
                        {action.title}
                      </Heading>
                      {action.glow && (
                        <Badge 
                          colorScheme="green" 
                          variant="solid"
                          fontSize="xs"
                          boxShadow="0 0 10px rgba(0, 255, 0, 0.5)"
                        >
                          HOT
                        </Badge>
                      )}
                    </HStack>
                    <Text color="neonGreen.200" fontSize="sm">
                      {action.description}
                    </Text>
                    <Button 
                      size="sm" 
                      variant={action.glow ? "solid" : "outline"}
                      alignSelf="flex-start"
                      _hover={{
                        transform: 'scale(1.05)',
                      }}
                    >
                      Öffnen →
                    </Button>
                  </VStack>
                </CardBody>
                
                {/* Glow effect for main action */}
                {action.glow && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    pointerEvents="none"
                    borderRadius="lg"
                    border="2px solid transparent"
                    background="linear-gradient(45deg, transparent, rgba(0, 255, 0, 0.1), transparent)"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      borderRadius: 'lg',
                      padding: '2px',
                      background: 'linear-gradient(45deg, #00ff00, transparent, #00ff00)',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                    }}
                  />
                )}
              </Card>
            ))}
          </Grid>
        </Box>

        {/* System Status */}
        <Card bg="darkBg.400" borderColor="neonGreen.800" variant="outline">
          <CardBody>
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <Heading size="md" color="neonGreen.300">System Status</Heading>
                <Badge colorScheme="green" variant="solid">ONLINE</Badge>
              </HStack>
              
              <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                <VStack>
                  <Text fontSize="sm" color="neonGreen.200">Database</Text>
                  <Progress value={95} colorScheme="green" size="sm" w="full" />
                  <Text fontSize="xs" color="green.300">95% Health</Text>
                </VStack>
                
                <VStack>
                  <Text fontSize="sm" color="neonGreen.200">API Status</Text>
                  <Progress value={100} colorScheme="green" size="sm" w="full" />
                  <Text fontSize="xs" color="green.300">100% Uptime</Text>
                </VStack>
                
                <VStack>
                  <Text fontSize="sm" color="neonGreen.200">Performance</Text>
                  <Progress value={87} colorScheme="green" size="sm" w="full" />
                  <Text fontSize="xs" color="green.300">87ms avg</Text>
                </VStack>
              </Grid>
            </VStack>
          </CardBody>
        </Card>
        
      </VStack>
    </Container>
  );
}
