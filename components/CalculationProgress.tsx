import React from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';

interface CalculationProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  progress: number;
  isComplete?: boolean;
}

const neonGreen = '#39FF14';
const darkBg = '#121212';
const cardBorder = 'rgba(57, 255, 20, 0.8)';

const containerStyle: React.CSSProperties = {
  padding: 8
};

const cardStyle: React.CSSProperties = {
  background: darkBg,
  border: `2px solid ${cardBorder}`,
  borderRadius: 8,
  boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
  transition: 'all 0.3s ease',
  padding: 16
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12
};

const headingStyle: React.CSSProperties = {
  color: neonGreen,
  margin: 0,
  fontSize: '1.125rem'
};

const badgeStyle = (isComplete: boolean): React.CSSProperties => ({
  background: isComplete ? '#2b7a1f' : '#d97706',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: 6,
  fontSize: '0.85rem'
});

const stepTextStyle: React.CSSProperties = {
  color: '#d1d5db',
  fontSize: '0.9rem'
};

const progressContainerStyle: React.CSSProperties = {
  width: '100%',
  background: '#2d2d2d',
  borderRadius: 8,
  overflow: 'hidden',
  height: 18,
  boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.4)'
};

const progressBarStyle = (progress: number): React.CSSProperties => ({
  width: `${Math.max(0, Math.min(100, progress))}%`,
  height: '100%',
  background: 'linear-gradient(90deg, #39FF14 0%, #32CD32 100%)',
  boxShadow: '0 0 10px rgba(57, 255, 20, 0.6)',
  transition: 'width 0.25s ease'
});

const footerTextStyle: React.CSSProperties = {
  color: neonGreen,
  textAlign: 'center',
  fontWeight: 700,
  marginTop: 12
};

const iconTextRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

const CalculationProgress: React.FC<CalculationProgressProps> = ({
  currentStep,
  totalSteps,
  stepName,
  progress,
  isComplete = false
}) => {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={headerRowStyle}>
            <h3 style={headingStyle}>Berechnung läuft...</h3>
            <span style={badgeStyle(isComplete)}>{isComplete ? 'Abgeschlossen' : 'In Bearbeitung'}</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={stepTextStyle}>
                Schritt {currentStep} von {totalSteps}: {stepName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={iconTextRowStyle}>
                  {isComplete ? (
                    <i className="pi pi-check-circle" style={{ color: neonGreen }} />
                  ) : (
                    <i className="pi pi-clock" style={{ color: "#f6c23e" }} />
                  )}
                </div>
                <div style={{ color: neonGreen, fontWeight: 700 }}>{Math.round(progress)}%</div>
              </div>
            </div>

            <div style={progressContainerStyle}>
              <div style={progressBarStyle(progress)} />
            </div>
          </div>

          {isComplete && (
            <div style={footerTextStyle}>✓ Berechnung erfolgreich abgeschlossen!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculationProgress;
