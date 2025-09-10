import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDynamicData } from '../lib/dynamicDataSystem';
export const PdfConfiguration = ({ onConfigChange }) => {
    const { getAllCategories, setPdfInclusion, getTotalPdfBytes, exportForPdf } = useDynamicData();
    const [categories, setCategories] = useState(getAllCategories());
    const [totalBytes, setTotalBytes] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    useEffect(() => {
        const updateData = () => {
            setCategories(getAllCategories());
            setTotalBytes(getTotalPdfBytes());
        };
        updateData();
        const interval = setInterval(updateData, 1000);
        return () => clearInterval(interval);
    }, []);
    const toggleItemInclusion = (key, included) => {
        setPdfInclusion(key, included);
        setCategories(getAllCategories());
        setTotalBytes(getTotalPdfBytes());
        if (onConfigChange) {
            onConfigChange(exportForPdf());
        }
    };
    const toggleCategoryInclusion = (categoryKey, included) => {
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
        if (selectedCategory !== 'all' && category.key !== selectedCategory)
            return false;
        if (searchTerm) {
            return category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.items.some(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.key.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return true;
    });
    const formatBytes = (bytes) => {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    return (_jsxs("div", { className: "pdf-configuration p-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "PDF-Ausgabe Konfiguration" }), _jsx("p", { className: "text-gray-600", children: "W\u00E4hlen Sie individuell aus, welche Daten und Berechnungen in die PDF aufgenommen werden sollen." }), _jsx("div", { className: "mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-medium text-blue-800", children: "Gesamtgr\u00F6\u00DFe der PDF-Daten:" }), _jsx("span", { className: "text-lg font-bold text-blue-900", children: formatBytes(totalBytes) })] }) })] }), _jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Suche nach Elementen:" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Suchen Sie nach Daten, Berechnungen, Diagrammen...", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "sm:w-64", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Kategorie filtern:" }), _jsxs("select", { value: selectedCategory, title: "Kategorie zum Filtern ausw\u00E4hlen", onChange: (e) => setSelectedCategory(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "Alle Kategorien" }), categories.map(cat => (_jsxs("option", { value: cat.key, children: [cat.label, " (", cat.items.length, " Elemente)"] }, cat.key)))] })] })] }), _jsx("div", { className: "space-y-6", children: filteredCategories.map(category => (_jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-gray-50 px-4 py-3 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("input", { type: "checkbox", title: `Alle Elemente in Kategorie ${category.label} auswählen`, checked: category.items.length > 0 && category.items.every(item => item.includedInPdf), onChange: (e) => toggleCategoryInclusion(category.key, e.target.checked), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: category.label }), _jsx("p", { className: "text-sm text-gray-600", children: category.description })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm text-gray-500", children: [category.items.length, " Elemente"] }), _jsx("div", { className: "text-sm font-medium text-gray-700", children: formatBytes(category.totalBytes) })] })] }) }), _jsxs("div", { className: "bg-white", children: [category.items.map(item => (_jsx("div", { className: "px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3 flex-1", children: [_jsx("input", { type: "checkbox", title: `${item.label} in PDF einschließen`, checked: item.includedInPdf, onChange: (e) => toggleItemInclusion(item.key, e.target.checked), className: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 truncate", children: item.label }), _jsx("span", { className: `px-2 py-1 text-xs rounded-full border ${getPriorityColor(item.priority)}`, children: item.priority }), _jsx("span", { className: "px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded", children: item.dataType })] }), item.description && (_jsx("p", { className: "text-xs text-gray-500 mt-1 truncate", children: item.description })), _jsxs("div", { className: "text-xs text-gray-400 mt-1", children: ["Key: ", _jsx("code", { className: "bg-gray-100 px-1 rounded", children: item.key })] })] })] }), _jsxs("div", { className: "text-right ml-4", children: [_jsx("div", { className: "text-xs text-gray-500", children: formatBytes(item.pdfBytes) }), _jsx("div", { className: "text-xs text-gray-400", children: new Date(item.lastUpdated).toLocaleString('de-DE') })] })] }) }, item.key))), category.items.length === 0 && (_jsxs("div", { className: "px-4 py-8 text-center text-gray-500", children: [_jsx("p", { children: "Keine Daten in dieser Kategorie vorhanden" }), _jsx("p", { className: "text-xs mt-1", children: "Daten werden automatisch hinzugef\u00FCgt, wenn sie in der App eingegeben werden." })] }))] })] }, category.key))) }), _jsxs("div", { className: "mt-8 p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "PDF-Zusammenfassung" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: categories.reduce((sum, cat) => sum + cat.items.filter(i => i.includedInPdf).length, 0) }), _jsx("div", { className: "text-sm text-gray-600", children: "Ausgew\u00E4hlte Elemente" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: formatBytes(totalBytes) }), _jsx("div", { className: "text-sm text-gray-600", children: "Gesamtgr\u00F6\u00DFe" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: categories.length }), _jsx("div", { className: "text-sm text-gray-600", children: "Kategorien" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: categories.reduce((sum, cat) => sum + cat.items.length, 0) }), _jsx("div", { className: "text-sm text-gray-600", children: "Verf\u00FCgbare Elemente" })] })] })] }), _jsxs("div", { className: "mt-6 flex justify-between", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => {
                                    categories.forEach(cat => toggleCategoryInclusion(cat.key, true));
                                }, className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500", children: "Alles ausw\u00E4hlen" }), _jsx("button", { onClick: () => {
                                    categories.forEach(cat => toggleCategoryInclusion(cat.key, false));
                                }, className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500", children: "Alles abw\u00E4hlen" })] }), _jsx("button", { onClick: () => {
                            const config = exportForPdf();
                            console.log('PDF Config:', config);
                            if (onConfigChange)
                                onConfigChange(config);
                        }, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "PDF Konfiguration speichern" })] })] }));
};
export default PdfConfiguration;
