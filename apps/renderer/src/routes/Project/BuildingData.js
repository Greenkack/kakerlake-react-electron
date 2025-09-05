// Compatibility shim for runtime import './BuildingData.js'
// Do NOT place business logic here. The real implementation lives in 'BuildingData.tsx'.
// This exists because the compiled JS (from index.tsx) emits import "./BuildingData.js".
// When removing this file you MUST also adjust every emitted import (or keep a build step).
// After full TS migration you can: 1) adjust imports to extension-less + ensure bundler resolves TSX
// and 2) delete this shim.

// Re-export default + named (if any) from TSX source.
import BuildingData from './BuildingData.tsx';
export * from './BuildingData.tsx';
export default BuildingData;

// Debug marker (one-time on module evaluation) – helps verify shim usage without spamming renders.
// Comment out if noisy.
if (typeof console !== 'undefined') {
	console.debug('[Shim] BuildingData.js loaded (re-exporting BuildingData.tsx)');
}
