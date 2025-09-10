import React, { useState, useEffect, useMemo } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';
import { Panel } from 'primereact/panel';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { ProgressBar } from 'primereact/progressbar';

// Import der neuen ModernUI Komponenten
import { ModernCard, ModernButton } from '../components/ModernUI_PrimeReact';

interface Product {
  id: string;
  kategorie: string;
  hersteller: string;
  produkt_modell: string;
  pv_modul_leistung?: number;
  wr_leistung_kw?: number;
  kapazitaet_speicher_kwh?: number;
  price_euro?: number;
  efficiency_percent?: number;
  warranty_years?: number;
  origin_country?: string;
  description?: string;
}

interface ProductSelectionProps {
  products: Product[];
  selectedProduct?: Product;
  onProductSelect: (product: Product) => void;
  category: 'module' | 'inverter' | 'storage';
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
}

interface ProductComparisonData {
  product: Product;
  pricePerWatt?: number;
  efficiencyRating: string;
  warrantyRating: string;
  overallRating: number;
}

export function ModernProductSelection({ 
  products, 
  selectedProduct, 
  onProductSelect, 
  category, 
  quantity = 1,
  onQuantityChange 
}: ProductSelectionProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('name');

  // Kategorie-spezifische Konfiguration
  const categoryConfig = {
    module: {
      title: 'PV Module',
      icon: 'pi-th-large',
      powerKey: 'pv_modul_leistung',
      powerUnit: 'Wp',
      quantityLabel: 'Anzahl Module',
      features: ['Leistung (Wp)', 'Effizienz (%)', 'Garantie', 'Preis']
    },
    inverter: {
      title: 'Wechselrichter',
      icon: 'pi-cog',
      powerKey: 'wr_leistung_kw',
      powerUnit: 'kW',
      quantityLabel: 'Anzahl WR',
      features: ['Leistung (kW)', 'Effizienz (%)', 'Garantie', 'Preis']
    },
    storage: {
      title: 'Batteriespeicher',
      icon: 'pi-battery-3',
      powerKey: 'kapazitaet_speicher_kwh',
      powerUnit: 'kWh',
      quantityLabel: 'Anzahl Speicher',
      features: ['Kapazität (kWh)', 'Effizienz (%)', 'Garantie', 'Preis']
    }
  };

  const config = categoryConfig[category];

  // Hersteller-Liste generieren
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.hersteller).filter(Boolean)));
    return [
      { label: 'Alle Hersteller', value: '' },
      ...uniqueBrands.map(brand => ({ label: brand, value: brand }))
    ];
  }, [products]);

  // Gefilterte Produkte
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Brand-Filter
    if (selectedBrand) {
      filtered = filtered.filter(p => p.hersteller === selectedBrand);
    }

    // Such-Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.produkt_modell.toLowerCase().includes(term) ||
        p.hersteller.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    // Preis-Filter
    filtered = filtered.filter(p => {
      const price = p.price_euro || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sortierung
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.produkt_modell.localeCompare(b.produkt_modell);
        case 'brand':
          return a.hersteller.localeCompare(b.hersteller);
        case 'price':
          return (a.price_euro || 0) - (b.price_euro || 0);
        case 'power':
          const aPower = a[config.powerKey as keyof Product] as number || 0;
          const bPower = b[config.powerKey as keyof Product] as number || 0;
          return bPower - aPower; // Absteigende Sortierung
        case 'efficiency':
          return (b.efficiency_percent || 0) - (a.efficiency_percent || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedBrand, searchTerm, priceRange, sortBy, config.powerKey]);

  // Produktvergleich-Logik
  const generateComparisonData = (products: Product[]): ProductComparisonData[] => {
    return products.map(product => {
      const power = product[config.powerKey as keyof Product] as number || 0;
      const price = product.price_euro || 0;
      const pricePerWatt = power > 0 && price > 0 ? price / power : 0;
      
      // Rating-System (1-5 Sterne)
      const efficiency = product.efficiency_percent || 0;
      const warranty = product.warranty_years || 0;
      
      const efficiencyRating = efficiency >= 22 ? 'Excellent' : efficiency >= 20 ? 'Good' : efficiency >= 18 ? 'Fair' : 'Basic';
      const warrantyRating = warranty >= 25 ? 'Excellent' : warranty >= 20 ? 'Good' : warranty >= 15 ? 'Fair' : 'Basic';
      
      // Gesamt-Rating berechnen
      const overallRating = Math.round((
        (efficiency / 25 * 100) * 0.4 + // 40% Effizienz
        (warranty / 30 * 100) * 0.3 +   // 30% Garantie
        (pricePerWatt > 0 ? Math.max(0, 100 - pricePerWatt * 2) : 50) * 0.3  // 30% Preis-Leistung
      ));

      return {
        product,
        pricePerWatt: pricePerWatt > 0 ? pricePerWatt : undefined,
        efficiencyRating,
        warrantyRating,
        overallRating: Math.min(100, Math.max(0, overallRating))
      };
    });
  };

  // Produktkarte Template
  const productCardTemplate = (product: Product) => {
    const power = product[config.powerKey as keyof Product] as number || 0;
    const isSelected = selectedProduct?.id === product.id;
    const isInComparison = comparisonProducts.some(p => p.id === product.id);

    return (
      <ModernCard
        key={product.id}
        className={`product-card h-full ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {product.produkt_modell}
              </h3>
              <Chip 
                label={product.hersteller} 
                className="text-xs"
                style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                icon="pi pi-info-circle"
                size="small"
                text
                onClick={() => {
                  setDetailProduct(product);
                  setShowDetails(true);
                }}
                tooltip="Details anzeigen"
              />
              <Button
                icon={isInComparison ? "pi pi-minus" : "pi pi-plus"}
                size="small"
                text
                onClick={() => {
                  if (isInComparison) {
                    setComparisonProducts(prev => prev.filter(p => p.id !== product.id));
                  } else {
                    setComparisonProducts(prev => [...prev, product]);
                  }
                }}
                tooltip={isInComparison ? "Aus Vergleich entfernen" : "Zum Vergleich hinzufügen"}
              />
            </div>
          </div>

          {/* Spezifikationen */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-600">Leistung</div>
                <div className="font-semibold text-blue-600">
                  {power.toLocaleString('de-DE')} {config.powerUnit}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Effizienz</div>
                <div className="font-semibold">
                  {product.efficiency_percent || 'N/A'}%
                </div>
              </div>
              <div>
                <div className="text-gray-600">Garantie</div>
                <div className="font-semibold">
                  {product.warranty_years || 'N/A'} Jahre
                </div>
              </div>
              <div>
                <div className="text-gray-600">Preis</div>
                <div className="font-semibold text-green-600">
                  {product.price_euro ? 
                    `${product.price_euro.toLocaleString('de-DE')} €` : 
                    'Auf Anfrage'
                  }
                </div>
              </div>
            </div>

            {/* Preis pro Watt/kW */}
            {product.price_euro && power > 0 && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="text-gray-600">Preis pro {config.powerUnit}</div>
                <div className="font-bold text-lg">
                  {(product.price_euro / power).toFixed(2)} €/{config.powerUnit}
                </div>
              </div>
            )}
          </div>

          {/* Aktions-Buttons */}
          <div className="flex gap-2">
            <ModernButton
              onClick={() => onProductSelect(product)}
              variant={isSelected ? "success" : "primary"}
              size="small"
              className="flex-1"
            >
              <i className={`pi ${isSelected ? "pi-check" : "pi-plus"} mr-2`}></i>
              {isSelected ? "Ausgewählt" : "Auswählen"}
            </ModernButton>
          </div>
        </div>
      </ModernCard>
    );
  };

  return (
    <div className="modern-product-selection">
      {/* Header mit Statistiken */}
      <ModernCard className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <i className={`pi ${config.icon} text-blue-500`}></i>
              {config.title}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} von {products.length} Produkten
            </p>
          </div>
          
          {/* Menge */}
          {onQuantityChange && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">{config.quantityLabel}:</label>
              <div className="flex items-center gap-2">
                <Button 
                  icon="pi pi-minus" 
                  size="small" 
                  outlined 
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                />
                <InputNumber 
                  value={quantity}
                  onValueChange={(e) => onQuantityChange(e.value || 1)}
                  min={1}
                  max={100}
                  className="w-20"
                  showButtons={false}
                />
                <Button 
                  icon="pi pi-plus" 
                  size="small" 
                  outlined 
                  onClick={() => onQuantityChange(quantity + 1)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter-Bereich */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hersteller</label>
            <Dropdown
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.value)}
              options={brands}
              placeholder="Alle Hersteller"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Suche</label>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Modell, Hersteller..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sortierung</label>
            <Dropdown
              value={sortBy}
              onChange={(e) => setSortBy(e.value)}
              options={[
                { label: 'Name', value: 'name' },
                { label: 'Hersteller', value: 'brand' },
                { label: 'Preis', value: 'price' },
                { label: 'Leistung', value: 'power' },
                { label: 'Effizienz', value: 'efficiency' }
              ]}
              className="w-full"
            />
          </div>

          <div className="flex items-end gap-2">
            <ModernButton
              onClick={() => setShowComparison(true)}
              disabled={comparisonProducts.length < 2}
              size="small"
              className="relative"
            >
              <i className="pi pi-clone mr-2"></i>
              Vergleichen
              {comparisonProducts.length > 0 && (
                <Badge 
                  value={comparisonProducts.length} 
                  className="absolute -top-2 -right-2"
                />
              )}
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* Ausgewähltes Produkt Zusammenfassung */}
      {selectedProduct && (
        <ModernCard variant="elevated" className="mb-6 border-l-4 border-green-500 bg-green-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg text-green-800">Ausgewählt</h3>
              <p className="text-green-700">
                {selectedProduct.hersteller} {selectedProduct.produkt_modell}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-green-600">
                  {quantity}x = {((selectedProduct[config.powerKey as keyof Product] as number || 0) * quantity).toLocaleString('de-DE')} {config.powerUnit} gesamt
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600">Einzelpreis</div>
              <div className="text-xl font-bold text-green-800">
                {selectedProduct.price_euro ? 
                  `${selectedProduct.price_euro.toLocaleString('de-DE')} €` : 
                  'Auf Anfrage'
                }
              </div>
              {quantity > 1 && selectedProduct.price_euro && (
                <div className="text-sm text-green-600">
                  Gesamt: {(selectedProduct.price_euro * quantity).toLocaleString('de-DE')} €
                </div>
              )}
            </div>
          </div>
        </ModernCard>
      )}

      {/* Produktgitter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => productCardTemplate(product))}
      </div>

      {/* Keine Produkte gefunden */}
      {filteredProducts.length === 0 && (
        <ModernCard>
          <div className="text-center py-8">
            <i className="pi pi-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Keine Produkte gefunden
            </h3>
            <p className="text-gray-500">
              Versuche andere Filter oder Suchbegriffe
            </p>
          </div>
        </ModernCard>
      )}

      {/* Produktvergleich Sidebar */}
      <Sidebar
        visible={showComparison}
        onHide={() => setShowComparison(false)}
        position="right"
        style={{ width: '50vw' }}
        header="Produktvergleich"
      >
        {comparisonProducts.length >= 2 ? (
          <ProductComparison 
            products={comparisonProducts}
            comparisonData={generateComparisonData(comparisonProducts)}
            category={category}
          />
        ) : (
          <div className="text-center py-8">
            <i className="pi pi-clone text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">
              Wähle mindestens 2 Produkte zum Vergleichen aus
            </p>
          </div>
        )}
      </Sidebar>

      {/* Produktdetails Sidebar */}
      <Sidebar
        visible={showDetails}
        onHide={() => setShowDetails(false)}
        position="right"
        style={{ width: '40vw' }}
        header="Produktdetails"
      >
        {detailProduct && (
          <ProductDetails product={detailProduct} category={category} />
        )}
      </Sidebar>
    </div>
  );
}

// Produktvergleich-Komponente
function ProductComparison({ 
  products, 
  comparisonData, 
  category 
}: { 
  products: Product[]; 
  comparisonData: ProductComparisonData[];
  category: string;
}) {
  return (
    <div className="space-y-6">
      <DataTable value={comparisonData} responsiveLayout="scroll">
        <Column field="product.produkt_modell" header="Modell" style={{ width: '200px' }} />
        <Column field="product.hersteller" header="Hersteller" />
        <Column 
          field="product.price_euro" 
          header="Preis"
          body={(rowData) => 
            rowData.product.price_euro ? 
              `${rowData.product.price_euro.toLocaleString('de-DE')} €` : 
              'N/A'
          }
        />
        <Column 
          field="pricePerWatt" 
          header="€/Wp"
          body={(rowData) => 
            rowData.pricePerWatt ? 
              `${rowData.pricePerWatt.toFixed(2)} €` : 
              'N/A'
          }
        />
        <Column field="product.efficiency_percent" header="Effizienz (%)" />
        <Column field="product.warranty_years" header="Garantie (Jahre)" />
        <Column 
          field="overallRating"
          header="Bewertung"
          body={(rowData) => (
            <div className="flex items-center gap-2">
              <ProgressBar 
                value={rowData.overallRating} 
                style={{ width: '80px', height: '8px' }}
                showValue={false}
              />
              <span className="text-sm">{rowData.overallRating}%</span>
            </div>
          )}
        />
      </DataTable>
    </div>
  );
}

// Produktdetails-Komponente
function ProductDetails({ product, category }: { product: Product; category: string }) {
  const specs = [
    { label: 'Hersteller', value: product.hersteller },
    { label: 'Modell', value: product.produkt_modell },
    { label: 'Kategorie', value: product.kategorie },
    { label: 'Preis', value: product.price_euro ? `${product.price_euro.toLocaleString('de-DE')} €` : 'Auf Anfrage' },
    { label: 'Effizienz', value: product.efficiency_percent ? `${product.efficiency_percent}%` : 'N/A' },
    { label: 'Garantie', value: product.warranty_years ? `${product.warranty_years} Jahre` : 'N/A' },
    { label: 'Herkunft', value: product.origin_country || 'N/A' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">{product.produkt_modell}</h3>
        <Chip label={product.hersteller} className="mb-4" />
      </div>

      <Divider />

      <div>
        <h4 className="font-semibold mb-3">Spezifikationen</h4>
        <div className="space-y-2">
          {specs.map((spec, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{spec.label}:</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {product.description && (
        <>
          <Divider />
          <div>
            <h4 className="font-semibold mb-3">Beschreibung</h4>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ModernProductSelection;
