import React from 'react'
import { Link } from 'react-router-dom'

interface SimplePageProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export default function SimplePage({ title, description, children }: SimplePageProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {description && (
          <p className="text-slate-600 mt-2">{description}</p>
        )}
      </div>
      
      {children || (
        <div className="bg-white rounded-lg border p-6">
          <p className="text-slate-600 mb-4">
            Diese Seite ist noch in Entwicklung.
          </p>
          <Link 
            to="/home"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Zur Startseite
          </Link>
        </div>
      )}
    </div>
  )
}
