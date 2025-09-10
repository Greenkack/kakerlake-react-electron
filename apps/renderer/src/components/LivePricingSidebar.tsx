// apps/renderer/src/components/LivePricingSidebar.tsx
// Sidebar-Komponente für Live-Preisberechnung mit AppContext Integration

import React, { FC, useEffect } from 'react';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { usePricing, useCalculationResults } from '../context/AppContext';

interface LivePricingSidebarProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

/**
 * Sidebar-Komponente für die Live-Preisberechnung.
 *
 * Diese Komponente stellt Eingabefelder für Rabatt und Aufschlag bereit und
 * berechnet den finalen Preis basierend auf dem Basispreis aus dem Context.
 */
export const LivePricingSidebar: FC<LivePricingSidebarProps> = ({ 
  className = '',
  showTitle = true,
  compact = false
}) => {
  const { pricing, updatePricing } = usePricing();
  const { results } = useCalculationResults();

  // Aktualisiere Basispreis aus Calculation Results
  useEffect(() => {
    if (results?.total_investment_netto && results.total_investment_netto !== pricing.baseCost) {
      updatePricing({ baseCost: results.total_investment_netto });
    }
  }, [results?.total_investment_netto, pricing.baseCost, updatePricing]);

  const handleDiscountChange = (value: number | null | undefined) => {
    updatePricing({ discountPercent: value || 0 });
  };

  const handleSurchargeChange = (value: number | null | undefined) => {
    updatePricing({ surchargePercent: value || 0 });
  };

  const handleAdditionalCostsChange = (value: number | null | undefined) => {
    updatePricing({ additionalCosts: value || 0 });
  };

  const resetPricing = () => {
    updatePricing({
      discountPercent: 0,
      surchargePercent: 0,
      additionalCosts: 0
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const priceChangePercent = pricing.baseCost > 0 
    ? ((pricing.finalPrice - pricing.baseCost) / pricing.baseCost) * 100 
    : 0;

  const content = (
    <div className="pricing-sidebar-content">
      {/* Basispreis Anzeige */}
      <div className="field mb-4">
        <label className="font-semibold text-sm mb-2 block">Basispreis (Netto)</label>
        <div className="bg-gray-50 p-3 border-round">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(pricing.baseCost)}
          </span>
        </div>
      </div>

      {/* Rabatt Eingabe */}
      <div className="field mb-4">
        <label htmlFor="discount" className="font-semibold text-sm mb-2 block">
          Rabatt (%)
        </label>
        <div className="p-inputgroup">
          <InputNumber
            id="discount"
            value={pricing.discountPercent}
            min={0}
            max={50}
            maxFractionDigits={1}
            onValueChange={(e) => handleDiscountChange(e.value)}
            suffix="%"
            showButtons={!compact}
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            className="w-full"
          />
        </div>
        {!compact && (
          <Slider
            value={pricing.discountPercent}
            onChange={(e) => handleDiscountChange(Array.isArray(e.value) ? e.value[0] : e.value)}
            min={0}
            max={50}
            step={0.5}
            className="mt-2"
          />
        )}
      </div>

      {/* Aufschlag Eingabe */}
      <div className="field mb-4">
        <label htmlFor="surcharge" className="font-semibold text-sm mb-2 block">
          Aufschlag (%)
        </label>
        <div className="p-inputgroup">
          <InputNumber
            id="surcharge"
            value={pricing.surchargePercent}
            min={0}
            max={50}
            maxFractionDigits={1}
            onValueChange={(e) => handleSurchargeChange(e.value)}
            suffix="%"
            showButtons={!compact}
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            className="w-full"
          />
        </div>
        {!compact && (
          <Slider
            value={pricing.surchargePercent}
            onChange={(e) => handleSurchargeChange(Array.isArray(e.value) ? e.value[0] : e.value)}
            min={0}
            max={50}
            step={0.5}
            className="mt-2"
          />
        )}
      </div>

      {/* Zusatzkosten Eingabe */}
      <div className="field mb-4">
        <label htmlFor="additional" className="font-semibold text-sm mb-2 block">
          Zusatzkosten (€)
        </label>
        <InputNumber
          id="additional"
          value={pricing.additionalCosts}
          min={0}
          maxFractionDigits={2}
          onValueChange={(e) => handleAdditionalCostsChange(e.value)}
          mode="currency"
          currency="EUR"
          locale="de-DE"
          showButtons={!compact}
          buttonLayout="horizontal"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          className="w-full"
        />
      </div>

      <Divider />

      {/* Endergebnis */}
      <div className="pricing-result">
        <div className="flex justify-content-between align-items-center mb-2">
          <span className="font-semibold">Endpreis (Netto):</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(pricing.finalPrice)}
          </span>
        </div>
        
        <div className="flex justify-content-between align-items-center mb-2">
          <span className="font-semibold">Endpreis (Brutto):</span>
          <span className="text-lg font-semibold">
            {formatCurrency(pricing.finalPriceBrutto || 0)}
          </span>
        </div>

        {priceChangePercent !== 0 && (
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-sm">Preisänderung:</span>
            <Badge
              value={`${priceChangePercent > 0 ? '+' : ''}${priceChangePercent.toFixed(1)}%`}
              severity={priceChangePercent > 0 ? 'danger' : 'success'}
            />
          </div>
        )}

        {/* Reset Button */}
        <Button
          label="Zurücksetzen"
          icon="pi pi-refresh"
          onClick={resetPricing}
          className="w-full"
          outlined
          size="small"
          disabled={pricing.discountPercent === 0 && pricing.surchargePercent === 0 && pricing.additionalCosts === 0}
        />
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className={`live-pricing-sidebar-compact ${className}`}>
        {showTitle && (
          <h4 className="mb-3 text-center">
            <i className="pi pi-calculator mr-2"></i>
            Live-Preisberechnung
          </h4>
        )}
        {content}
      </div>
    );
  }

  return (
    <Card 
      className={`live-pricing-sidebar ${className}`}
      pt={{
        body: { className: 'p-3' },
        content: { className: 'p-0' }
      }}
    >
      {showTitle && (
        <div className="flex align-items-center mb-4">
          <i className="pi pi-calculator text-primary mr-2 text-xl"></i>
          <h3 className="m-0 text-primary">Live-Preisberechnung</h3>
        </div>
      )}
      {content}
    </Card>
  );
};

export default LivePricingSidebar;
