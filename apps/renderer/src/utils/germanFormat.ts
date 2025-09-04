/**
 * Deutsche Zahlenformatierung für die gesamte App
 */

// Zentrale deutsche Nummer-Formatierung
export const formatGermanNumber = (value: number, decimals: number = 2): string => {
  if (isNaN(value) || !isFinite(value)) return '0,00'
  
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true
  }).format(value)
}

// Formatierung für Währung (€)
export const formatGermanCurrency = (value: number, decimals: number = 2): string => {
  if (isNaN(value) || !isFinite(value)) return '0,00 €'
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

// Formatierung für ganze Zahlen (kWh, Stück, etc.)
export const formatGermanInteger = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '0'
  
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(Math.round(value))
}

// Formatierung für Prozente
export const formatGermanPercent = (value: number, decimals: number = 1): string => {
  if (isNaN(value) || !isFinite(value)) return '0,0%'
  
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

// Formatierung für kWh (Energie)
export const formatGermanKWh = (value: number): string => {
  return `${formatGermanInteger(value)} kWh`
}

// Formatierung für kWp (Leistung)
export const formatGermanKWp = (value: number, decimals: number = 1): string => {
  return `${formatGermanNumber(value, decimals)} kWp`
}

// Formatierung für €/kWh (Strompreis)
export const formatGermanElectricityPrice = (value: number): string => {
  return `${formatGermanNumber(value, 4)} €/kWh`
}

// Parse deutsche Nummer zurück zu Number (für Eingabefelder)
export const parseGermanNumber = (value: string): number | undefined => {
  if (!value || value.trim() === '') return undefined
  
  // Deutsche Formatierung zurück zu Number konvertieren
  const normalizedValue = value
    .replace(/\./g, '') // Tausenderpunkte entfernen
    .replace(',', '.') // Komma zu Punkt für Dezimal
    .trim()
  
  const parsed = parseFloat(normalizedValue)
  return isNaN(parsed) ? undefined : parsed
}

// Hilfsfunktion für Eingabefelder: formatiert während der Eingabe
export const formatGermanInputNumber = (value: string): string => {
  const parsed = parseGermanNumber(value)
  if (parsed === undefined) return value
  return formatGermanNumber(parsed)
}
