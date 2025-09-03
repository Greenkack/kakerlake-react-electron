/* DEF: einfache, side-effect-freie Hilfsrechner */
export function toNumberOrNull(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function annualCostFromMonthly(m?: number | null): number | null {
  if (m == null) return null
  return Math.max(0, m * 12)
}

export function sumNullable(a?: number | null, b?: number | null): number | null {
  const x = (a ?? 0) + (b ?? 0)
  if (a == null && b == null) return null
  return Math.max(0, x)
}

export function pricePerKWh(annualCostEuro: number | null, annualKWh: number | null): number | null {
  if (annualCostEuro == null || annualKWh == null || annualKWh <= 0) return null
  return annualCostEuro / annualKWh
}
