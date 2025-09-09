import React, { useState, useEffect } from 'react';
import { useDynamicData } from '../lib/dynamicDataSystem';

interface PdfConfigurationProps {
  onConfigChange?: (config: any) => void;
}

export const PdfConfiguration: React.FC<PdfConfigurationProps> = ({ onConfigChange }) => {
  const {
    getAllCategories,
    setPdfInclusion,
    getTotalPdfBytes,
    exportForPdf
  } = useDynamicData();

  const [categories, setCategories] = useState(getAllCategories());
  const [totalBytes, setTotalBytes] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const updateData = () => {
      setCategories(getAllCategories());
      setTotalBytes(getTotalPdfBytes());
    };
    
    updateData();
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleItemInclusion = (key: string, included: boolean) => {
    setPdfInclusion(key, included);
    setCategories(getAllCategories());
    setTotalBytes(getTotalPdfBytes());
    
    if (onConfigChange) {
      onConfigChange(exportForPdf());
    }
  };

  const toggleCategoryInclusion = (categoryKey: string, included: boolean) => {
    const category = categories.find(c => c.key === categoryKey);
    if (category) {
      category.items.forEach(item => {
        setPdfInclusion(item.key, included);
      });
      setCategories(getAllCategories());
      setTotalBytes(getTotalPdfBytes());
      
      if (onConfigChange) {
        onConfigChange(exportForPdf());
      }
    }
  };

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== 'all' && category.key !== selectedCategory) return false;
    
    if (searchTerm) {
      return category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.items.some(item => 
               item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.key.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="pdf-configuration p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PDF-Ausgabe Konfiguration
        </h2>
        <p className="text-gray-600">
          Wählen Sie individuell aus, welche Daten und Berechnungen in die PDF aufgenommen werden sollen.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">
              Gesamtgröße der PDF-Daten:
            </span>
            <span className="text-lg font-bold text-blue-900">
              {formatBytes(totalBytes)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter und Suche */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suche nach Elementen:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suchen Sie nach Daten, Berechnungen, Diagrammen..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorie filtern:
          </label>
          <select
            value={selectedCategory}
            title="Kategorie zum Filtern auswählen"
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map(cat => (
              <option key={cat.key} value={cat.key}>
                {cat.label} ({cat.items.length} Elemente)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kategorien und Items */}
      <div className="space-y-6">
        {filteredCategories.map(category => (
          <div key={category.key} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Kategorie Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    title={`Alle Elemente in Kategorie ${category.label} auswählen`}
                    checked={category.items.length > 0 && category.items.every(item => item.includedInPdf)}
                    onChange={(e) => toggleCategoryInclusion(category.key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {category.items.length} Elemente
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {formatBytes(category.totalBytes)}
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white">
              {category.items.map(item => (
                <div key={item.key} className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        title={`${item.label} in PDF einschließen`}
                        checked={item.includedInPdf}
                        onChange={(e) => toggleItemInclusion(item.key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.label}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {item.dataType}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {item.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Key: <code className="bg-gray-100 px-1 rounded">{item.key}</code>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-gray-500">
                        {formatBytes(item.pdfBytes)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.lastUpdated).toLocaleString('de-DE')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {category.items.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p>Keine Daten in dieser Kategorie vorhanden</p>
                  <p className="text-xs mt-1">
                    Daten werden automatisch hinzugefügt, wenn sie in der App eingegeben werden.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zusammenfassung */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">PDF-Zusammenfassung</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {categories.reduce((sum, cat) => sum + cat.items.filter(i => i.includedInPdf).length, 0)}
            </div>
            <div className="text-sm text-gray-600">Ausgewählte Elemente</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatBytes(totalBytes)}
            </div>
            <div className="text-sm text-gray-600">Gesamtgröße</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">Kategorien</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {categories.reduce((sum, cat) => sum + cat.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Verfügbare Elemente</div>
          </div>
        </div>
      </div>

      {/* Aktionen */}
      <div className="mt-6 flex justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              categories.forEach(cat => toggleCategoryInclusion(cat.key, true));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Alles auswählen
          </button>
          <button
            onClick={() => {
              categories.forEach(cat => toggleCategoryInclusion(cat.key, false));
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Alles abwählen
          </button>
        </div>
        <button
          onClick={() => {
            const config = exportForPdf();
            console.log('PDF Config:', config);
            if (onConfigChange) onConfigChange(config);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          PDF Konfiguration speichern
        </button>
      </div>
    </div>
  );
};

export default PdfConfiguration;
