/* DEF: PDF-Angebotsausgabe – Platzhalter für Standard/Erweitert/Multi */
import React from 'react'

export default function PdfHub() {
  return (
    <div>
      <h2 className="text-xl font-semibold">PDF-Angebotsausgabe</h2>
      <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
        <li>Standard-PDF (7 Seiten) – Templates: nt_nt_*, hp_nt_*</li>
        <li>Erweiterte PDF-Ausgabe – Datenblätter, Firmen-Dokumente, Diagramme</li>
        <li>Multi-PDF – Multi-Firmenangebote mit Rotation/Staffelung</li>
      </ul>
    </div>
  )
}
