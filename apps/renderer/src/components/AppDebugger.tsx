import React from 'react'
import { useLocation } from 'react-router-dom'

export default function AppDebugger() {
  const location = useLocation()
  
  return (
    <div className="fixed top-0 left-0 bg-black text-white p-2 text-xs z-50 font-mono">
      <div>Path: {location.pathname}</div>
      <div>Search: {location.search}</div>
      <div>Timestamp: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}
