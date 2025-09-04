import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatGermanNumber, formatGermanCurrency } from '../../utils/germanFormat'

interface Product {
  id: string
  name: string
  brand: string
  category: 'module' | 'inverter' | 'battery' | 'wallbox' | 'mounting' | 'cable'
  type: string
  power?: number // Wp for modules, W for inverters, kWh for batteries
  efficiency?: number // %
  price: number // € net
  availability: 'in_stock' | 'limited' | 'out_of_stock' | 'discontinued'
  warranty: number // years
  certifications: string[]
  dimensions?: {
    length: number
    width: number
    height: number
    weight: number
  }
  specifications: Record<string, string | number>
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// Mock Data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ja Solar JAM72S30 540/MR',
    brand: 'Ja Solar',
    category: 'module',
    type: 'Mono PERC',
    power: 540,
    efficiency: 20.9,
    price: 189.50,
    availability: 'in_stock',
    warranty: 25,
    certifications: ['IEC 61215', 'IEC 61730', 'CE'],
    dimensions: {
      length: 2279,
      width: 1134,
      height: 30,
      weight: 27.5
    },
    specifications: {
      'Zelltyp': 'Mono PERC',
      'Anzahl Zellen': 144,
      'Vmp': '41,88 V',
      'Imp': '12,90 A',
      'Voc': '50,15 V',
      'Isc': '13,64 A'
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-08-20',
    isActive: true
  },
  {
    id: '2',
    name: 'SMA Sunny Boy 5.0',
    brand: 'SMA',
    category: 'inverter',
    type: 'String-Wechselrichter',
    power: 5000,
    efficiency: 97.1,
    price: 1245.00,
    availability: 'in_stock',
    warranty: 10,
    certifications: ['VDE-AR-N 4105', 'CE', 'RCM'],
    specifications: {
      'AC Nennleistung': '5000 W',
      'DC Eingänge': '2',
      'Max DC Spannung': '1000 V',
      'MPPT Bereiche': '2',
      'Schutzart': 'IP65'
    },
    createdAt: '2024-02-10',
    updatedAt: '2024-09-01',
    isActive: true
  },
  {
    id: '3',
    name: 'BYD Battery-Box Premium HVS 7.7',
    brand: 'BYD',
    category: 'battery',
    type: 'LiFePO4 Hochvolt',
    power: 7.68, // kWh
    efficiency: 96.0,
    price: 3890.00,
    availability: 'limited',
    warranty: 10,
    certifications: ['CE', 'UN38.3', 'IEC 62619'],
    specifications: {
      'Kapazität': '7,68 kWh',
      'Spannung': '51,2 V',
      'Zyklen': '6000+',
      'Temperaturbereich': '-10°C bis +50°C'
    },
    createdAt: '2024-01-20',
    updatedAt: '2024-08-15',
    isActive: true
  }
]

const categoryLabels = {
  module: 'PV-Module',
  inverter: 'Wechselrichter',
  battery: 'Batteriespeicher',
  wallbox: 'Wallboxen',
  mounting: 'Montagesysteme',
  cable: 'Kabel & Zubehör'
}

const availabilityLabels = {
  in_stock: 'Auf Lager',
  limited: 'Begrenzt',
  out_of_stock: 'Nicht verfügbar',
  discontinued: 'Eingestellt'
}

const availabilityColors = {
  in_stock: 'bg-green-100 text-green-800',
  limited: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800',
  discontinued: 'bg-gray-100 text-gray-800'
}

export default function ProductManagement() {
  const [products] = useState<Product[]>(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'brand' | 'price' | 'power'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch && product.isActive
    })

    return filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'name' || sortBy === 'brand') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [products, selectedCategory, searchTerm, sortBy, sortOrder])

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to="/admin" className="text-slate-500 hover:text-slate-700">Admin</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 font-medium">Produktverwaltung</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">📦 Produktverwaltung</h1>
              <p className="text-slate-600">Verwalten Sie Ihre Produktkataloge und Preise</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                + Produkt hinzufügen
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Import/Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Produkt suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-slate-400">🔍</div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Alle ({products.length})
              </button>
              {Object.entries(categoryLabels).map(([key, label]) => {
                const count = products.filter(p => p.category === key && p.isActive).length
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === key 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                )
              })}
            </div>

            {/* View & Sort Controls */}
            <div className="flex gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as typeof sortBy)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="brand-asc">Marke A-Z</option>
                <option value="price-asc">Preis niedrig-hoch</option>
                <option value="price-desc">Preis hoch-niedrig</option>
                <option value="power-desc">Leistung hoch-niedrig</option>
              </select>

              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📋
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📊
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <ProductTable products={filteredAndSortedProducts} />
        )}

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Keine Produkte gefunden</h3>
            <p className="text-slate-600">
              {searchTerm ? `Keine Produkte für "${searchTerm}"` : 'Keine Produkte in dieser Kategorie'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const getPowerDisplay = () => {
    if (product.category === 'module') return `${product.power} Wp`
    if (product.category === 'inverter') return `${formatGermanNumber(product.power! / 1000, 1)} kW`
    if (product.category === 'battery') return `${formatGermanNumber(product.power!, 1)} kWh`
    return ''
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="text-2xl">
            {product.category === 'module' && '⚡'}
            {product.category === 'inverter' && '🔄'}
            {product.category === 'battery' && '🔋'}
            {product.category === 'wallbox' && '🚗'}
            {product.category === 'mounting' && '🔧'}
            {product.category === 'cable' && '🔌'}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${availabilityColors[product.availability]}`}>
            {availabilityLabels[product.availability]}
          </span>
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <h3 className="font-semibold text-slate-900 text-sm mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-slate-600 text-xs">{product.brand} • {product.type}</p>
        </div>

        {/* Key Specs */}
        <div className="space-y-1 mb-3">
          {product.power && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Leistung:</span>
              <span className="font-medium">{getPowerDisplay()}</span>
            </div>
          )}
          {product.efficiency && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Effizienz:</span>
              <span className="font-medium">{formatGermanNumber(product.efficiency, 1)}%</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Garantie:</span>
            <span className="font-medium">{product.warranty} Jahre</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-lg font-bold text-green-600">
            {formatGermanCurrency(product.price)}
          </div>
          <div className="text-xs text-slate-500">
            netto
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
          Bearbeiten
        </button>
        <button className="px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-100 transition-colors">
          Details
        </button>
      </div>
    </div>
  )
}

// Product Table Component  
function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-900">Produkt</th>
              <th className="text-left py-3 px-4 font-medium text-slate-900">Kategorie</th>
              <th className="text-right py-3 px-4 font-medium text-slate-900">Leistung</th>
              <th className="text-right py-3 px-4 font-medium text-slate-900">Effizienz</th>
              <th className="text-right py-3 px-4 font-medium text-slate-900">Preis</th>
              <th className="text-center py-3 px-4 font-medium text-slate-900">Status</th>
              <th className="text-center py-3 px-4 font-medium text-slate-900">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-slate-900">{product.name}</div>
                    <div className="text-sm text-slate-600">{product.brand} • {product.type}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm">
                    {categoryLabels[product.category]}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {product.power && (
                    product.category === 'module' ? `${product.power} Wp` :
                    product.category === 'inverter' ? `${formatGermanNumber(product.power / 1000, 1)} kW` :
                    product.category === 'battery' ? `${formatGermanNumber(product.power, 1)} kWh` : ''
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {product.efficiency ? `${formatGermanNumber(product.efficiency, 1)}%` : '-'}
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  {formatGermanCurrency(product.price)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${availabilityColors[product.availability]}`}>
                    {availabilityLabels[product.availability]}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-1">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">✏️</button>
                    <button className="p-1 text-slate-600 hover:bg-slate-50 rounded">👁️</button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
