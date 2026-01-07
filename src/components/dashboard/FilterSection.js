// src/components/dashboard/FilterSection.js
'use client';
import { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

export default function FilterSection() {
  const [filtros, setFiltros] = useState([{ id: 1, campo: '', operador: '', valor: '' }]);

  const addRow = () => {
    setFiltros([...filtros, { id: Date.now(), campo: '', operador: '', valor: '' }]);
  };

  const removeRow = (id) => {
    setFiltros(filtros.filter(f => f.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
        <button 
          onClick={addRow}
          className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <PlusCircle size={16} /> Agregar filtro
        </button>
      </div>

      <div className="space-y-3">
        {filtros.map((filtro, index) => (
          <div key={filtro.id} className="flex gap-2 items-center flex-wrap md:flex-nowrap">
            {/* Conector lógico (AND/OR) solo si no es el primero */}
            <div className="w-20">
              {index > 0 && (
                <select className="w-full text-xs font-bold text-gray-500 bg-gray-50 border-none rounded">
                  <option>Y (AND)</option>
                  <option>O (OR)</option>
                </select>
              )}
            </div>

            <select className="flex-1 p-2 bg-white text-black border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Selecciona Campo...</option>
              <option value="entidad">Entidad</option>
              <option value="poblacion">Población</option>
            </select>

            <select className="w-32 p-2 bg-white border text-black text-center border-gray-300 rounded text-sm">
              <option>=</option>
              <option>{'>'}</option>
              <option>{'<'}</option>
              <option>Contiene</option>
            </select>

            <input 
              type="text" 
              placeholder="Valor..." 
              className="flex-1 p-2 border border-gray-300 text-black rounded text-sm focus:border-blue-500 outline-none"
            />

            <button 
              onClick={() => removeRow(filtro.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}