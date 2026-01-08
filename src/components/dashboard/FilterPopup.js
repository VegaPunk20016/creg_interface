'use client';

import { useState, useMemo, useEffect } from 'react';
import { Check, Filter, X, Search as SearchIcon, ListChecks } from 'lucide-react';

export default function FilterPopup({ column, type, data, currentFilter, onSave, onClose }) {
  const [localFilter, setLocalFilter] = useState(currentFilter || { 
    type, 
    selectedValues: [], 
    operator: '>', 
    value: '' 
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Bloquear el scroll del body cuando se abre en móvil
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Bloquear scroll al montar
    return () => {
      document.body.style.overflow = 'unset'; // Desbloquear al cerrar
    };
  }, []);

  const allOptions = useMemo(() => {
    return type === 'text' 
      ? [...new Set(data.map(item => item[column.id]))].sort() 
      : [];
  }, [data, column, type]);

  const filteredOptions = allOptions.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTextToggle = (val) => {
    const currentSelected = localFilter.selectedValues || [];
    const newSelected = currentSelected.includes(val)
      ? currentSelected.filter(v => v !== val)
      : [...currentSelected, val];
    setLocalFilter({ ...localFilter, selectedValues: newSelected });
  };

  const handleSelectAll = () => {
    const currentSelected = localFilter.selectedValues || [];
    const newSelected = [...new Set([...currentSelected, ...filteredOptions])];
    setLocalFilter({ ...localFilter, selectedValues: newSelected });
  };

  const handleDeselectAll = () => {
    const currentSelected = localFilter.selectedValues || [];
    const newSelected = currentSelected.filter(val => !filteredOptions.includes(val));
    setLocalFilter({ ...localFilter, selectedValues: newSelected });
  };

  return (
    // 1. WRAPPER EXTERNO: 
    // - Móvil: fixed inset-0 (ocupa toda la pantalla) + flex center (centra el contenido)
    // - Desktop (md): absolute (se pega al botón padre) + block
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center md:absolute md:inset-auto md:top-12 md:left-0 md:block pointer-events-auto">
      
      {/* 2. BACKDROP (Fondo oscuro): Solo visible en móvil para cerrar al hacer click fuera */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden transition-opacity" 
        onClick={onClose}
      />

      {/* 3. CARD PRINCIPAL: */}
      {/* - Móvil: Ancho casi total, animación desde abajo, bordes redondeados */}
      {/* - Desktop: Ancho fijo (w-80), sin animación de slide, sombra específica */}
      <div className="
        relative 
        bg-white 
        w-full sm:w-[90%] max-w-sm md:w-80 
        max-h-[85vh] md:max-h-none
        rounded-t-2xl sm:rounded-xl md:rounded-xl 
        shadow-2xl border border-gray-200 
        flex flex-col 
        animate-in slide-in-from-bottom-10 fade-in duration-200 md:animate-in md:fade-in md:zoom-in-95
        overflow-hidden
      ">
      
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 md:p-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-700 text-base md:text-sm flex items-center gap-2">
             {type === 'text' ? <ListChecks size={18}/> : <Filter size={18}/>}
             {column.label}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 bg-gray-200/50 rounded-full md:bg-transparent md:p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X size={20} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        {/* --- UI PARA TEXTO --- */}
        {type === 'text' && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Buscador */}
            <div className="p-3 md:p-2 border-b border-gray-100 relative shrink-0">
              <SearchIcon className="absolute left-5 md:left-4 top-5 md:top-4 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder={`Buscar ${column.label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Botones rápidos */}
            <div className="flex justify-between px-4 py-2 md:px-3 md:py-1 bg-gray-50/50 text-xs text-blue-600 font-semibold border-b border-gray-100 shrink-0">
              <button onClick={handleSelectAll} className="hover:underline p-1">Todos</button>
              <button onClick={handleDeselectAll} className="hover:underline text-gray-500 p-1">Ninguno</button>
            </div>

            {/* Lista Scrollable */}
            {/* Ajuste de altura para móvil (flex-1) vs Desktop (max-h-60) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[150px] md:max-h-60 md:min-h-0">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => {
                  const isSelected = localFilter.selectedValues?.includes(opt);
                  return (
                    <div 
                      key={opt} 
                      onClick={() => handleTextToggle(opt)}
                      className={`
                        flex items-center gap-3 p-3 md:p-2 rounded-lg cursor-pointer text-sm transition-all select-none
                        active:scale-[0.98] md:active:scale-100
                        ${isSelected 
                          ? 'bg-blue-50 border border-blue-200 text-blue-800' 
                          : 'hover:bg-gray-50 border border-transparent text-gray-600'
                        }
                      `}
                    >
                      <div className={`
                        w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0
                        ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}
                      `}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      
                      <span className="font-medium truncate">{opt}</span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  No se encontraron resultados.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- UI PARA NÚMEROS --- */}
        {type === 'number' && (
          <div className="p-5 md:p-4">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-3 block">Condición</label>
            <div className="flex gap-2 mb-2">
              <select 
                value={localFilter.operator}
                onChange={(e) => setLocalFilter({...localFilter, operator: e.target.value})}
                className="w-24 p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value="=">{'='}</option>
              </select>
              <input 
                type="number" 
                value={localFilter.value}
                onChange={(e) => setLocalFilter({...localFilter, value: e.target.value})}
                placeholder="Valor..."
                className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* FOOTER ACCIONES */}
        <div className="p-4 md:p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0 safe-area-bottom">
          <span className="text-xs text-gray-400 hidden md:inline">
             {type === 'text' && `${localFilter.selectedValues?.length || 0} selec.`}
          </span>
          <div className="flex gap-3 w-full md:w-auto">
              <button 
                  onClick={() => { onSave(null); onClose(); }} 
                  className="flex-1 md:flex-none px-4 py-2.5 md:py-1.5 text-sm md:text-xs font-medium text-gray-600 bg-white border border-gray-300 md:border-transparent md:bg-transparent hover:bg-gray-200 rounded-lg transition-colors"
              >
                  Limpiar
              </button>
              <button 
                  onClick={() => { onSave(localFilter); onClose(); }} 
                  className="flex-1 md:flex-none px-4 py-2.5 md:py-1.5 text-sm md:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors active:scale-95 md:active:scale-100"
              >
                  Aplicar Filtro
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}