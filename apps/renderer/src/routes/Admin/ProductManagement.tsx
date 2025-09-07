import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatGermanNumber, formatGermanCurrency } from '../../utils/germanFormat'

// Kanonisches Produkt gemäß Vorgabe (deutsche Keys)
interface ProduktStd {
  id: number
  kategorie: string
  produkt_modell: string
  hersteller: string
  preis_stück?: number
  pv_modul_leistung?: number
  kapazitaet_speicher_kwh?: number
  wr_leistung_kw?: number
  ladezyklen_speicher?: number
  garantie_zeit?: number
  mass_laenge?: number
  mass_breite?: number
  mass_gewicht_kg?: number
  wirkungsgrad_prozent?: number
  hersteller_land?: string
  beschreibung_info?: string
  eigenschaft_info?: string
  spezial_merkmal?: string
  rating_null_zehn?: number
  image_base64?: string | null
  created_at?: string | null
  updated_at?: string | null
}

async function loadProducts(): Promise<ProduktStd[]> {
  const api = (window as any).productsAPI
  if (!api) return []
  try {
    const res = await api.list()
    if (res?.success && Array.isArray(res.items)) return res.items
  } catch (e) {
    console.error('Produkte laden fehlgeschlagen', e)
  }
  return []
}

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
  const [products, setProducts] = useState<ProduktStd[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'produkt_modell' | 'hersteller' | 'preis' | 'leistung'>('produkt_modell')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [loading, setLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newProduct, setNewProduct] = useState({
    kategorie: '', hersteller: '', produkt_modell: '', preis_stück: '',
    pv_modul_leistung: '', wr_leistung_kw: '', kapazitaet_speicher_kwh: ''
  } as Record<string, string>)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    loadProducts().then(items => {
      if (!mounted) return
      setProducts(items as ProduktStd[])
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const search = searchTerm.toLowerCase()
    let filtered = products.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.kategorie === selectedCategory
      const matchesSearch = (
        (p.produkt_modell || '').toLowerCase().includes(search) ||
        (p.hersteller || '').toLowerCase().includes(search) ||
        (p.beschreibung_info || '').toLowerCase().includes(search)
      )
      return matchesCategory && matchesSearch
    })

    return filtered.sort((a, b) => {
      let aValue: any
      let bValue: any
      if (sortBy === 'produkt_modell') {
        aValue = (a.produkt_modell || '').toLowerCase()
        bValue = (b.produkt_modell || '').toLowerCase()
      } else if (sortBy === 'hersteller') {
        aValue = (a.hersteller || '').toLowerCase()
        bValue = (b.hersteller || '').toLowerCase()
      } else if (sortBy === 'preis') {
        aValue = a.preis_stück ?? 0
        bValue = b.preis_stück ?? 0
      } else {
        // leistung: priorisiere pv_modul_leistung, sonst wr_leistung_kw (in kW -> Wp nicht gemischt), dann kapazitaet_speicher_kwh
        aValue = a.pv_modul_leistung ?? a.wr_leistung_kw ?? a.kapazitaet_speicher_kwh ?? 0
        bValue = b.pv_modul_leistung ?? b.wr_leistung_kw ?? b.kapazitaet_speicher_kwh ?? 0
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
              <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">+ Produkt hinzufügen</button>
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
              {[...new Set(products.map(p => p.kategorie).filter(Boolean))].map((kat) => {
                const count = products.filter(p => p.kategorie === kat).length
                return (
                  <button
                    key={kat as string}
                    onClick={() => setSelectedCategory(kat as string)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === kat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {kat} ({count})
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
        {loading ? (
          <div className="text-center py-12 text-slate-600">Lade Produkte…</div>
        ) : viewMode === 'grid' ? (
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

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Neues Produkt anlegen</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-800">✖</button>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-3">
                <label className="text-sm">Kategorie*
                  <select className="w-full px-3 py-2 border rounded" value={newProduct.kategorie} onChange={(e) => setNewProduct({ ...newProduct, kategorie: e.target.value })}>
                    <option value="">-- wählen --</option>
                    {Array.from(new Set(['PV Modul','Wechselrichter','Batteriespeicher','Wallbox','Energiemanagementsystem','Leistungsoptimierer','Carport','Notstromversorgung','Tierabwehrschutz','Extrakosten']))
                      .map(k => (<option key={k} value={k}>{k}</option>))}
                  </select>
                </label>
                <label className="text-sm">Hersteller*
                  <input className="w-full px-3 py-2 border rounded" value={newProduct.hersteller} onChange={(e) => setNewProduct({ ...newProduct, hersteller: e.target.value })} />
                </label>
                <label className="text-sm">Produktmodell*
                  <input className="w-full px-3 py-2 border rounded" value={newProduct.produkt_modell} onChange={(e) => setNewProduct({ ...newProduct, produkt_modell: e.target.value })} />
                </label>
                <label className="text-sm">Preis (€/Stück)
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded" value={newProduct.preis_stück} onChange={(e) => setNewProduct({ ...newProduct, preis_stück: e.target.value })} />
                </label>
                <label className="text-sm">PV-Leistung (Wp)
                  <input type="number" className="w-full px-3 py-2 border rounded" value={newProduct.pv_modul_leistung} onChange={(e) => setNewProduct({ ...newProduct, pv_modul_leistung: e.target.value })} />
                </label>
                <label className="text-sm">WR-Leistung (kW)
                  <input type="number" step="0.1" className="w-full px-3 py-2 border rounded" value={newProduct.wr_leistung_kw} onChange={(e) => setNewProduct({ ...newProduct, wr_leistung_kw: e.target.value })} />
                </label>
                <label className="text-sm">Speicher (kWh)
                  <input type="number" step="0.1" className="w-full px-3 py-2 border rounded" value={newProduct.kapazitaet_speicher_kwh} onChange={(e) => setNewProduct({ ...newProduct, kapazitaet_speicher_kwh: e.target.value })} />
                </label>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">Abbrechen</button>
              <button
                onClick={async () => {
                  if (!newProduct.kategorie || !newProduct.produkt_modell || !newProduct.hersteller) { alert('Kategorie, Produktmodell und Hersteller sind Pflicht'); return }
                  const payload: Record<string, any> = {}
                  for (const [k, v] of Object.entries(newProduct)) {
                    if (v && String(v).trim() !== '') payload[k] = v
                  }
                  const api = (window as any).productsAPI
                  if (!api) { alert('productsAPI nicht verfügbar'); return }
                  const res = await api.addSingle(payload)
                  if (!res?.success) { alert('Speichern fehlgeschlagen: ' + (res?.error || 'Unbekannt')); return }
                  setShowAdd(false)
                  setNewProduct({ kategorie: '', hersteller: '', produkt_modell: '', preis_stück: '', pv_modul_leistung: '', wr_leistung_kw: '', kapazitaet_speicher_kwh: '' })
                  // reload list
                  setLoading(true)
                  const items = await loadProducts()
                  setProducts(items)
                  setLoading(false)
                }}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >Speichern</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: ProduktStd }) {
  const getIcon = () => {
    const k = (product.kategorie || '').toLowerCase()
    if (k.includes('modul') || k.includes('pv')) return '⚡'
    if (k.includes('wechselrichter') || k.includes('inverter')) return '🔄'
    if (k.includes('speicher') || k.includes('batter')) return '🔋'
    if (k.includes('wallbox')) return '🚗'
    if (k.includes('montage')) return '🔧'
    return '📦'
  }
  const getPowerDisplay = () => {
    const k = (product.kategorie || '').toLowerCase()
    if (k.includes('modul') || k.includes('pv')) return product.pv_modul_leistung ? `${product.pv_modul_leistung} Wp` : ''
    if (k.includes('wechselrichter') || k.includes('inverter')) return product.wr_leistung_kw ? `${formatGermanNumber(product.wr_leistung_kw, 1)} kW` : ''
    if (k.includes('speicher') || k.includes('batter')) return product.kapazitaet_speicher_kwh ? `${formatGermanNumber(product.kapazitaet_speicher_kwh, 1)} kWh` : ''
    return ''
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="text-2xl">{getIcon()}</div>
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <h3 className="font-semibold text-slate-900 text-sm mb-1 leading-tight">
            {product.produkt_modell}
          </h3>
          <p className="text-slate-600 text-xs">{product.hersteller} {product.spezial_merkmal ? `• ${product.spezial_merkmal}` : ''}</p>
        </div>

        {/* Key Specs */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Leistung:</span>
            <span className="font-medium">{getPowerDisplay() || '-'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Effizienz:</span>
            <span className="font-medium">{product.wirkungsgrad_prozent != null ? `${formatGermanNumber(product.wirkungsgrad_prozent, 1)}%` : '-'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Garantie:</span>
            <span className="font-medium">{product.garantie_zeit ?? 0} Jahre</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-lg font-bold text-green-600">
            {formatGermanCurrency(product.preis_stück ?? 0)}
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
function ProductTable({ products }: { products: ProduktStd[] }) {
  const [workingId, setWorkingId] = useState<string | null>(null)
  const refresh = async () => {
    const items = await loadProducts()
  // schnelle Lösung: Seite neu laden
  window.location.reload()
  }
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
              <th className="text-center py-3 px-4 font-medium text-slate-900">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-slate-900">{product.produkt_modell}</div>
                    <div className="text-sm text-slate-600">{product.hersteller} {product.spezial_merkmal ? `• ${product.spezial_merkmal}` : ''}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm">{product.kategorie}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  {(() => {
                    const k = (product.kategorie || '').toLowerCase()
                    if (k.includes('modul') || k.includes('pv')) return product.pv_modul_leistung ? `${product.pv_modul_leistung} Wp` : ''
                    if (k.includes('wechselrichter') || k.includes('inverter')) return product.wr_leistung_kw ? `${formatGermanNumber(product.wr_leistung_kw, 1)} kW` : ''
                    if (k.includes('speicher') || k.includes('batter')) return product.kapazitaet_speicher_kwh ? `${formatGermanNumber(product.kapazitaet_speicher_kwh, 1)} kWh` : ''
                    return ''
                  })()}
                </td>
                <td className="py-3 px-4 text-right">
                  {product.wirkungsgrad_prozent != null ? `${formatGermanNumber(product.wirkungsgrad_prozent, 1)}%` : '-'}
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  {formatGermanCurrency(product.preis_stück ?? 0)}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-1">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">✏️</button>
                    <button className="p-1 text-slate-600 hover:bg-slate-50 rounded">👁️</button>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      disabled={workingId === String(product.id)}
                      onClick={async () => {
                        if (!confirm('Produkt wirklich löschen?')) return
                        const api = (window as any).productsAPI
                        if (!api) return
                        setWorkingId(String(product.id))
                        try {
                          const res = await api.deleteSingle(Number(product.id))
                          if (!res?.success) alert('Löschen fehlgeschlagen')
                          else await refresh()
                        } finally {
                          setWorkingId(null)
                        }
                      }}
                    >🗑️</button>
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
