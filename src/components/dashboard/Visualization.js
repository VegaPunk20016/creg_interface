// src/components/dashboard/Visualization.js
'use client';
import { useState } from 'react';
import { Table, BarChart3, Map, PieChart } from 'lucide-react';

export default function Visualization({ data, columns }) {
  const [activeTab, setActiveTab] = useState('tabla');

  if (!data) return null;

  const tabs = [
    { id: 'tabla', label: 'Vista Tabla', icon: Table },
    { id: 'grafica', label: 'Gráficas', icon: BarChart3 },
    { id: 'mapa', label: 'Georreferencia', icon: Map },
    { id: 'treemap', label: 'Jerarquía', icon: PieChart },
  ];

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header de Pestañas */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all
                ${activeTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="p-6 min-h-[400px]">
        {activeTab === 'tabla' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  {columns.map(col => (
                    <th key={col.id} className="px-6 py-3">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.id} className="px-6 py-4">
                        {row[col.id] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'grafica' && (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border border-dashed">
            <p className="text-gray-400">Aquí se renderizará Chart.js con los datos mockeados</p>
          </div>
        )}

        {activeTab === 'mapa' && (
          <div className="h-80 flex items-center justify-center bg-blue-50 rounded border border-blue-100">
             <p className="text-blue-400">Aquí se renderizará el Mapa Leaflet</p>
          </div>
        )}
      </div>
    </div>
  );
}