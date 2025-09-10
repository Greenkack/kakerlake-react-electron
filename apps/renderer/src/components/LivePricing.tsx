// apps/renderer/src/components/LivePricing.tsx
// Live pricing component for real-time cost calculations

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CalculationResults } from './CalculationResults';

interface LivePricingProps {
  baseResults: CalculationResults;
  onPricingUpdate?: (newPricing: any) => void;
}

interface PricingModification {
  discount_percent: number;
  surcharge_percent: number;
  additional_costs: number;
  custom_prices: { [key: string]: number };
}

interface PricingResults {
  base_price_netto: number;
  discount_amount: number;
  surcharge_amount: number;
  additional_costs: number;
  final_price_netto: number;
  final_price_brutto: number;
  price_change_percent: number;
  new_amortization_years: number;
  new_roi_percent: number;
  updated_at: string;
}

const LivePricingComponent: React.FC<LivePricingProps> = ({ 
  baseResults, 
  onPricingUpdate 
}) => {
  const [modifications, setModifications] = useState<PricingModification>({
    discount_percent: 0,
    surcharge_percent: 0,
    additional_costs: 0,
    custom_prices: {}
  });

  const [pricingResults, setPricingResults] = useState<PricingResults | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'percent',
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  // Update pricing calculations
  const updatePricing = async () => {
    setIsUpdating(true);
    try {
      const calculationAPI = (window as any).calculationAPI;
      if (!calculationAPI) {
        throw new Error('Calculation API not available');
      }

      const result = await calculationAPI.livePricing(baseResults, modifications);

      if (result.success) {
        setPricingResults(result.results);
        onPricingUpdate?.(result.results);
      } else {
        throw new Error(result.error || 'Pricing update failed');
      }

    } catch (error) {
      console.error('Live pricing error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update pricing whenever modifications change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updatePricing();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [modifications]);

  // Calculate preview values locally for immediate feedback
  const previewCalculations = () => {
    const basePrice = baseResults.total_investment_netto;
    const discountAmount = basePrice * (modifications.discount_percent / 100);
    const surchargeAmount = basePrice * (modifications.surcharge_percent / 100);
    const finalPrice = basePrice - discountAmount + surchargeAmount + modifications.additional_costs;
    
    return {
      finalPrice,
      discountAmount,
      surchargeAmount,
      priceChange: ((finalPrice - basePrice) / basePrice) * 100
    };
  };

  const preview = previewCalculations();

  // Pricing scenarios for quick selection
  const pricingScenarios = [
    { name: 'Standard', discount: 0, surcharge: 0, additional: 0 },
    { name: '5% Rabatt', discount: 5, surcharge: 0, additional: 0 },
    { name: '10% Rabatt', discount: 10, surcharge: 0, additional: 0 },
    { name: '15% Rabatt', discount: 15, surcharge: 0, additional: 0 },
    { name: 'Premium (+5%)', discount: 0, surcharge: 5, additional: 0 },
    { name: 'Zusatzkosten +2k€', discount: 0, surcharge: 0, additional: 2000 },
  ];

  return (
    <div className="live-pricing">
      <Card title="💰 Live-Preiskalkulation" className="mb-4">
        <div className="grid">
          {/* Controls */}
          <div className="col-12 md:col-6">
            <Panel header="Preisanpassungen" className="h-full">
              <div className="flex flex-column gap-4">
                {/* Discount Slider */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rabatt: {modifications.discount_percent}%
                  </label>
                  <Slider
                    value={modifications.discount_percent}
                    onChange={(e) => setModifications(prev => ({
                      ...prev,
                      discount_percent: e.value as number
                    }))}
                    min={0}
                    max={50}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-sm text-500 mt-1">
                    Ersparnis: {formatCurrency(preview.discountAmount)}
                  </div>
                </div>

                {/* Surcharge Slider */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aufschlag: {modifications.surcharge_percent}%
                  </label>
                  <Slider
                    value={modifications.surcharge_percent}
                    onChange={(e) => setModifications(prev => ({
                      ...prev,
                      surcharge_percent: e.value as number
                    }))}
                    min={0}
                    max={30}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-sm text-500 mt-1">
                    Mehrkosten: {formatCurrency(preview.surchargeAmount)}
                  </div>
                </div>

                {/* Additional Costs */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Zusätzliche Kosten
                  </label>
                  <InputNumber
                    value={modifications.additional_costs}
                    onValueChange={(e) => setModifications(prev => ({
                      ...prev,
                      additional_costs: e.value || 0
                    }))}
                    mode="currency"
                    currency="EUR"
                    locale="de-DE"
                    className="w-full"
                    min={0}
                    max={50000}
                  />
                </div>

                {/* Quick Scenarios */}
                <Divider />
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Schnell-Szenarien
                  </label>
                  <div className="grid gap-2">
                    {pricingScenarios.map((scenario, index) => (
                      <div key={index} className="col-6 md:col-4">
                        <Button
                          label={scenario.name}
                          size="small"
                          className="w-full p-button-outlined"
                          onClick={() => setModifications({
                            discount_percent: scenario.discount,
                            surcharge_percent: scenario.surcharge,
                            additional_costs: scenario.additional,
                            custom_prices: {}
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Live Results */}
          <div className="col-12 md:col-6">
            <Panel header="Aktualisierte Kalkulation" className="h-full">
              <div className="flex flex-column gap-3">
                {/* Price Overview */}
                <div className="p-3 border-round surface-card">
                  <div className="flex justify-content-between align-items-center mb-2">
                    <span className="text-sm">Ursprungspreis (netto):</span>
                    <span className="font-medium">{formatCurrency(baseResults.total_investment_netto)}</span>
                  </div>
                  
                  {modifications.discount_percent > 0 && (
                    <div className="flex justify-content-between align-items-center mb-2">
                      <span className="text-sm text-green-600">Rabatt ({modifications.discount_percent}%):</span>
                      <span className="font-medium text-green-600">-{formatCurrency(preview.discountAmount)}</span>
                    </div>
                  )}
                  
                  {modifications.surcharge_percent > 0 && (
                    <div className="flex justify-content-between align-items-center mb-2">
                      <span className="text-sm text-orange-600">Aufschlag ({modifications.surcharge_percent}%):</span>
                      <span className="font-medium text-orange-600">+{formatCurrency(preview.surchargeAmount)}</span>
                    </div>
                  )}
                  
                  {modifications.additional_costs > 0 && (
                    <div className="flex justify-content-between align-items-center mb-2">
                      <span className="text-sm text-red-600">Zusatzkosten:</span>
                      <span className="font-medium text-red-600">+{formatCurrency(modifications.additional_costs)}</span>
                    </div>
                  )}
                  
                  <Divider className="my-2" />
                  
                  <div className="flex justify-content-between align-items-center">
                    <span className="font-bold">Neuer Preis (netto):</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(preview.finalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-content-between align-items-center mt-2">
                    <span className="text-sm">Inkl. MwSt. (19%):</span>
                    <span className="font-medium">{formatCurrency(preview.finalPrice * 1.19)}</span>
                  </div>

                  {preview.priceChange !== 0 && (
                    <div className="text-center mt-3">
                      <Badge 
                        value={`${preview.priceChange > 0 ? '+' : ''}${formatPercent(preview.priceChange)}`}
                        severity={preview.priceChange > 0 ? 'danger' : 'success'}
                        size="large"
                      />
                    </div>
                  )}
                </div>

                {/* Updated KPIs */}
                {pricingResults && (
                  <div className="p-3 border-round surface-card">
                    <h4 className="mt-0 mb-3">Aktualisierte Kennzahlen</h4>
                    
                    <div className="flex justify-content-between align-items-center mb-2">
                      <span className="text-sm">Neue Amortisation:</span>
                      <Badge 
                        value={`${pricingResults.new_amortization_years.toFixed(1)} Jahre`}
                        severity={pricingResults.new_amortization_years <= 12 ? 'success' : 'warning'}
                      />
                    </div>
                    
                    <div className="flex justify-content-between align-items-center mb-2">
                      <span className="text-sm">Neue Rendite (ROI):</span>
                      <Badge 
                        value={formatPercent(pricingResults.new_roi_percent)}
                        severity={pricingResults.new_roi_percent >= 8 ? 'success' : 'warning'}
                      />
                    </div>

                    <div className="text-xs text-500 mt-2">
                      Aktualisiert: {new Date(pricingResults.updated_at).toLocaleString('de-DE')}
                    </div>
                  </div>
                )}

                {/* Loading Indicator */}
                {isUpdating && (
                  <div className="text-center">
                    <ProgressBar mode="indeterminate" className="mb-2" style={{ height: '6px' }} />
                    <div className="text-sm text-500">Kalkulation wird aktualisiert...</div>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-4">
          <Button 
            label="Kalkulation zurücksetzen"
            icon="pi pi-refresh"
            className="p-button-outlined mr-2"
            onClick={() => setModifications({
              discount_percent: 0,
              surcharge_percent: 0,
              additional_costs: 0,
              custom_prices: {}
            })}
          />
          
          <Button 
            label="Neue Kalkulation als PDF"
            icon="pi pi-file-pdf"
            severity="success"
            onClick={() => {
              // TODO: Generate PDF with updated pricing
              console.log('Generate PDF with pricing:', pricingResults);
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default LivePricingComponent;
