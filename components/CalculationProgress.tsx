import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Progress,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

interface CalculationProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  progress: number;
  isComplete?: boolean;
}

const CalculationProgress: React.FC<CalculationProgressProps> = ({
  currentStep,
  totalSteps,
  stepName,
  progress,
  isComplete = false
}) => {
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('neonGreen', 'neonGreen');

  return (
    <Card 
      bg={bgColor} 
      borderColor={borderColor} 
      borderWidth="2px"
      boxShadow="0 0 20px rgba(57, 255, 20, 0.3)"
      _hover={{
        boxShadow: "0 0 30px rgba(57, 255, 20, 0.5)",
        transform: "translateY(-2px)"
      }}
      transition="all 0.3s ease"
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" color="neonGreen">
              Berechnung läuft...
            </Heading>
            <Badge 
              colorScheme={isComplete ? "green" : "yellow"}
              variant="solid"
              fontSize="sm"
            >
              {isComplete ? "Abgeschlossen" : "In Bearbeitung"}
            </Badge>
          </HStack>

          <Box>
            <HStack justify="space-between" mb={2}>
              <Text color="gray.300" fontSize="sm">
                Schritt {currentStep} von {totalSteps}: {stepName}
              </Text>
              <HStack spacing={2}>
                {isComplete ? (
                  <Icon as={FaCheckCircle} color="neonGreen" />
                ) : (
                  <Icon as={FaClock} color="yellow.400" />
                )}
                <Text color="neonGreen" fontWeight="bold" fontSize="sm">
                  {Math.round(progress)}%
                </Text>
              </HStack>
            </HStack>

            <Progress
              value={progress}
              colorScheme="green"
              size="lg"
              borderRadius="md"
              bg="gray.700"
              sx={{
                '& > div': {
                  background: 'linear-gradient(90deg, #39FF14 0%, #32CD32 100%)',
                  boxShadow: '0 0 10px rgba(57, 255, 20, 0.6)'
                }
              }}
            />
          </Box>

          {isComplete && (
            <Text color="neonGreen" textAlign="center" fontWeight="bold">
              ✓ Berechnung erfolgreich abgeschlossen!
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default CalculationProgress;
