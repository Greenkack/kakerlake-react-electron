// apps/renderer/src/App.tsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  ChakraProvider, 
  extendTheme,
  Box,
  Container,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode
} from "@chakra-ui/react";

// Chakra UI Neon-Green & Black Theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    neonGreen: {
      50: '#e0ffe0',
      100: '#b3ffb3',
      200: '#80ff80',
      300: '#4dff4d',
      400: '#1aff1a',
      500: '#00ff00',   // Pure neon green
      600: '#00e600',
      700: '#00cc00',
      800: '#00b300',
      900: '#009900',
    },
    darkBg: {
      50: '#4a4a4a',
      100: '#3a3a3a',
      200: '#2a2a2a',
      300: '#1a1a1a',
      400: '#131313',
      500: '#0d0d0d',   // Main dark
      600: '#080808',
      700: '#050505',
      800: '#020202',
      900: '#000000',   // Pure black
    }
  },
  styles: {
    global: {
      body: {
        bg: 'darkBg.500',
        color: 'neonGreen.200',
      }
    }
  },
  fonts: {
    heading: `'Orbitron', 'Inter', sans-serif`,
    body: `'Roboto Mono', 'Inter', sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
        _focus: { boxShadow: '0 0 10px #00ff00' },
      },
      variants: {
        solid: {
          bg: 'neonGreen.500',
          color: 'darkBg.900',
          _hover: { 
            bg: 'neonGreen.400',
            boxShadow: '0 0 15px #00ff00',
            transform: 'translateY(-1px)',
          },
          _active: { transform: 'translateY(0)' },
        },
        outline: {
          border: '2px solid',
          borderColor: 'neonGreen.500',
          color: 'neonGreen.500',
          _hover: {
            bg: 'neonGreen.500',
            color: 'darkBg.900',
            boxShadow: '0 0 15px #00ff00',
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'darkBg.400',
          border: '1px solid',
          borderColor: 'neonGreen.800',
          borderRadius: 'lg',
          boxShadow: '0 4px 12px rgba(0, 255, 0, 0.1)',
          _hover: {
            borderColor: 'neonGreen.500',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
          }
        }
      }
    },
    Heading: {
      baseStyle: {
        color: 'neonGreen.300',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
      }
    }
  }
});

export default function App(): JSX.Element {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Debug: Log current path
  console.log('Current pathname:', pathname);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const active = pathname === to;
    return (
      <Button
        as={Link}
        to={to}
        variant={active ? "solid" : "outline"}
        size="sm"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.6)',
        }}
        transition="all 0.3s ease"
      >
        {children}
      </Button>
    );
  };

  const DropdownMenu = ({ 
    title, 
    menuKey, 
    items 
  }: { 
    title: string; 
    menuKey: string; 
    items: { to: string; label: string }[] 
  }) => {
    const hasActiveChild = items.some(item => pathname === item.to);
    
    return (
      <Menu>
        <MenuButton
          as={Button}
          variant={hasActiveChild ? "solid" : "outline"}
          size="sm"
          rightIcon={<Text>▼</Text>}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.6)',
          }}
          transition="all 0.3s ease"
        >
          {title}
        </MenuButton>
        <MenuList 
          bg="darkBg.400" 
          border="1px solid" 
          borderColor="neonGreen.500"
          boxShadow="0 0 20px rgba(0, 255, 0, 0.3)"
        >
          {items.map((item) => (
            <MenuItem
              key={item.to}
              as={Link}
              to={item.to}
              bg={pathname === item.to ? "neonGreen.500" : "transparent"}
              color={pathname === item.to ? "darkBg.900" : "neonGreen.200"}
              _hover={{
                bg: "neonGreen.400",
                color: "darkBg.900",
                boxShadow: "inset 0 0 10px rgba(0, 255, 0, 0.8)",
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="darkBg.500">
        <Box 
          as="header" 
          bg="darkBg.600" 
          borderBottom="2px solid" 
          borderColor="neonGreen.500"
          boxShadow="0 0 20px rgba(0, 255, 0, 0.2)"
        >
          <Container maxW="7xl" p={3}>
            <HStack spacing={4} wrap="wrap">
              <Heading 
                size="lg" 
                color="neonGreen.400" 
                textShadow="0 0 15px rgba(0, 255, 0, 0.8)"
                fontFamily="heading"
                mr="auto"
              >
                ⚡ KAKERLAKE – PV/WP ⚡
              </Heading>
          
          {/* Projekt & Bedarfsanalyse */}
          <DropdownMenu
            title="Projekt"
            menuKey="project"
            items={[
              { to: "/project/mode", label: "Anlagenmodus" },
              { to: "/project/customer", label: "Kundendaten" },
              { to: "/project/building", label: "Gebäudedaten" },
              { to: "/project/demand", label: "Bedarfsanalyse" },
              { to: "/project/needs", label: "Bedürfnisse" },
              { to: "/project/options", label: "Zusatzoptionen" }
            ]}
          />

          {/* Dashboard - Separate KPI-Übersicht */}
          <NavLink to="/dashboard">📊 Dashboard</NavLink>

          {/* Kalkulation */}
          <DropdownMenu
            title="Kalkulation"
            menuKey="calc"
            items={[
              { to: "/calc/solar", label: "Solarkalkulator" },
              { to: "/calc/heatpump", label: "Wärmepumpen-Sim" },
              { to: "/calc/results", label: "Ergebnisse" }
            ]}
          />

          {/* PDF-Hub */}
          <DropdownMenu
            title="PDF-Hub"
            menuKey="pdf"
            items={[
              { to: "/pdf/standard", label: "Standard-PDF" },
              { to: "/pdf/extended", label: "Erweiterte PDFs" },
              { to: "/pdf/multi", label: "Multi-PDF" },
              { to: "/pdf/preview", label: "Vorschau" }
            ]}
          />

          {/* CRM */}
          <DropdownMenu
            title="CRM"
            menuKey="crm"
            items={[
              { to: "/crm/dashboard", label: "Dashboard" },
              { to: "/crm/customers", label: "Kundenverwaltung" },
              { to: "/crm/pipeline", label: "Pipeline & Workflows" },
              { to: "/crm/calendar", label: "Kalender" },
              { to: "/crm/quick-calc", label: "Schnellkalkulation" }
            ]}
          />

          {/* Planung */}
          <DropdownMenu
            title="Planung"
            menuKey="planning"
            items={[
              { to: "/planning/info", label: "Informationsportal" },
              { to: "/planning/documents", label: "Dokumente" }
            ]}
          />

          {/* Administration */}
          <DropdownMenu
            title="Admin"
            menuKey="admin"
            items={[
              { to: "/admin/login", label: "Login" },
              { to: "/admin/companies", label: "Firmenverwaltung" },
              { to: "/admin/products", label: "Produktverwaltung" },
              { to: "/admin/price-matrix", label: "Preis-Matrix" },
              { to: "/admin/tariffs", label: "Tarifverwaltung" },
              { to: "/admin/settings", label: "Einstellungen" }
            ]}
          />
            </HStack>
          </Container>
        </Box>

        <Box as="main" maxW="7xl" mx="auto" p={4}>
          <Outlet />
        </Box>
      </Box>
    </ChakraProvider>
  );
}
