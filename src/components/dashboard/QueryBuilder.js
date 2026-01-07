// src/components/dashboard/QueryBuilder.js
'use client';
import { Plus, X } from 'lucide-react'; // Asegúrate de instalar: npm install lucide-react

export default function QueryBuilder({ selected, onSelectChange, available }) {

  const handleAdd = (col) => {
    if (!selected.find((c) => c.id === col.id)) {
      onSelectChange([...selected, col]);
    }
  };

  const handleRemove = (colId) => {
    onSelectChange(selected.filter((c) => c.id !== colId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      {/* Columna Izquierda: Disponibles */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Campos Disponibles
        </h3>
        <div className="flex flex-wrap gap-2">
          {available.map((col) => {
            const isSelected = selected.find((s) => s.id === col.id);
            return (
              <button
                key={col.id}
                onClick={() => handleAdd(col)}
                disabled={isSelected}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                  ${isSelected 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 shadow-sm'
                  }`}
              >
                {isSelected ? <span className="w-4" /> : <Plus size={14} />}
                {col.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Columna Derecha: Seleccionadas */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 min-h-[150px]">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex justify-between">
          <span>Columnas a Consultar</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
        </h3>
        
        <div className="space-y-2">
          {selected.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8 italic">
              Selecciona campos para comenzar
            </p>
          )}
          
          {selected.map((col, index) => (
            <div 
              key={col.id}
              className="flex items-center justify-between bg-white p-2 px-3 rounded shadow-sm border border-gray-200 group hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">{index + 1}</span>
                <span className="text-gray-700 font-medium">{col.label}</span>
              </div>
              <button 
                onClick={() => handleRemove(col.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}