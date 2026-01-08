'use client';
import { Trash2, PlusCircle, Filter } from 'lucide-react';
import { useMemo } from 'react';

export default function FilterSection({ filters, onFiltersChange, availableColumns, data = [] }) {

  const addRow = () => {
    onFiltersChange([...filters, { id: Date.now(), logica: 'AND', campo: '', operador: '=', valor: '' }]);
  };

  const removeRow = (id) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id, key, value) => {
    if (key === 'campo') {
        const newFilters = filters.map(f => 
            f.id === id ? { ...f, [key]: value, valor: '', operador: '=' } : f
        );
        onFiltersChange(newFilters);
    } else {
        const newFilters = filters.map(f => 
            f.id === id ? { ...f, [key]: value } : f
        );
        onFiltersChange(newFilters);
    }
  };

  // --- AYUDANTES (Lógica intacta) ---
  const getFieldType = (fieldName) => {
    if (!data || data.length === 0 || !fieldName) return 'text';
    const sampleVal = data[0][fieldName];
    return typeof sampleVal === 'number' ? 'number' : 'text';
  };

  const getUniqueValues = (dataset, fieldName) => {
    if (!dataset || !fieldName) return [];
    const values = [...new Set(dataset.map(item => item[fieldName]))];
    return values.sort((a, b) => String(a).localeCompare(String(b)));
  };

  const applySingleFilter = (dataset, filter) => {
    if (!filter.campo || !filter.valor) return dataset;
    return dataset.filter(row => {
        const rowVal = row[filter.campo];
        const filterVal = filter.valor;
        if (filter.operador === '=') return String(rowVal) == String(filterVal);
        if (filter.operador === '>') return parseFloat(rowVal) > parseFloat(filterVal);
        if (filter.operador === '<') return parseFloat(rowVal) < parseFloat(filterVal);
        return true;
    });
  };

  let currentDataForDropdowns = data; 

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter size={20} className="text-blue-600"/>
            Filtros de Búsqueda
        </h3>
        <button 
          onClick={addRow}
          className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors font-medium"
        >
          <PlusCircle size={16} /> Agregar filtro
        </button>
      </div>

      <div className="space-y-4">
        {filters.map((filtro, index) => {
            const fieldType = getFieldType(filtro.campo);
            const dropdownOptions = getUniqueValues(currentDataForDropdowns, filtro.campo);

            if (filtro.campo && filtro.valor && filtro.operador === '=') {
                currentDataForDropdowns = applySingleFilter(currentDataForDropdowns, filtro);
            }

            return (
                // WRAPPER RESPONSIVE:
                // Móvil: Fondo gris, borde y padding (parece una tarjeta).
                // Desktop (md): Fondo blanco, sin borde, grid horizontal.
                <div 
                    key={filtro.id} 
                    className="
                        p-4 rounded-lg border border-gray-200 bg-gray-50 
                        md:bg-transparent md:border-none md:p-0 
                        grid grid-cols-12 gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-300
                    "
                >
                    
                    {/* 1. LÓGICA (AND/OR/DONDE) */}
                    <div className="col-span-12 md:col-span-2 lg:col-span-1">
                        {index > 0 ? (
                            <div className="flex items-center gap-2">
                                <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Lógica:</span>
                                <select 
                                    value={filtro.logica}
                                    onChange={(e) => updateFilter(filtro.id, 'logica', e.target.value)}
                                    className="w-full md:w-auto p-2 md:p-0 bg-white md:bg-transparent border border-gray-300 md:border-none rounded md:font-bold text-gray-700 md:text-gray-500 text-sm focus:ring-0"
                                >
                                    <option value="AND">Y (AND)</option>
                                </select>
                            </div>
                        ) : (
                            <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                Donde
                            </span>
                        )}
                    </div>

                    {/* 2. CAMPO (Entidad, Municipio...) */}
                    <div className="col-span-12 md:col-span-3">
                        <select 
                            value={filtro.campo}
                            onChange={(e) => updateFilter(filtro.id, 'campo', e.target.value)}
                            className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow shadow-sm"
                        >
                            <option value="">Seleccionar campo...</option>
                            {availableColumns.map(col => (
                                <option key={col.id || col} value={col.id || col}>
                                {col.label || col}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. OPERADOR (=, <, >) */}
                    <div className="col-span-4 md:col-span-2 lg:col-span-1">
                        <select 
                            value={filtro.operador}
                            onChange={(e) => updateFilter(filtro.id, 'operador', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-center font-medium focus:ring-2 focus:ring-blue-500 shadow-sm"
                        >
                            <option value="=">=</option>
                            {fieldType === 'number' && (
                                <>
                                    <option value=">">{'>'}</option>
                                    <option value="<">{'<'}</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* 4. VALOR (Input o Dropdown) */}
                    <div className="col-span-8 md:col-span-4 lg:col-span-6">
                        {fieldType === 'number' && filtro.operador !== '=' ? (
                            <input 
                                type="number" 
                                value={filtro.valor}
                                onChange={(e) => updateFilter(filtro.id, 'valor', e.target.value)}
                                placeholder="Escribe un valor..." 
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                        ) : (
                            <select
                                value={filtro.valor}
                                onChange={(e) => updateFilter(filtro.id, 'valor', e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm disabled:bg-gray-100 disabled:text-gray-400"
                                disabled={!filtro.campo}
                            >
                                <option value="">{filtro.campo ? 'Selecciona una opción...' : 'Primero elige campo'}</option>
                                {dropdownOptions.map((val, i) => (
                                    <option key={i} value={val}>{val}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* 5. BOTÓN ELIMINAR */}
                    <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center">
                        <button 
                            onClick={() => removeRow(filtro.id)}
                            className="w-full md:w-auto p-2 flex items-center justify-center gap-2 text-red-500 bg-white md:bg-transparent border md:border-none border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                            <Trash2 size={18} />
                            <span className="md:hidden font-medium">Eliminar filtro</span>
                        </button>
                    </div>
                </div>
            );
        })}
        
        {filters.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400 text-sm">No hay filtros activos actualmente.</p>
                <p className="text-gray-300 text-xs mt-1">Usa el botón superior para refinar tu búsqueda.</p>
            </div>
        )}
      </div>
    </div>
  );
}