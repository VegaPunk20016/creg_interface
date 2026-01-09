'use client';

import { useState, useMemo, useEffect } from 'react';
import { Filter, X, Search as SearchIcon, ListChecks } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';

export default function FilterPopup({ column, type, data, currentFilter, onSave, onClose }) {
  // Estado local
  const [localFilter, setLocalFilter] = useState(currentFilter || { 
    type, 
    selectedValues: [], 
    operator: '>', 
    value: '' 
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Bloqueo de scroll en móvil
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Lógica de opciones (Memoizada)
  const allOptions = useMemo(() => {
    return type === 'text' 
      ? [...new Set(data.map(item => item[column.id]))].sort() 
      : [];
  }, [data, column, type]);

  const filteredOptions = allOptions.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center md:absolute md:inset-auto md:top-12 md:left-0 md:block pointer-events-auto">
      
      {/* BACKDROP Móvil */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden transition-opacity" 
        onClick={onClose}
      />

      {/* CONTENEDOR POPUP */}
      <div className="
        relative bg-white 
        w-full sm:w-[90%] max-w-sm md:w-80 
        max-h-[85vh] md:max-h-none
        rounded-t-2xl sm:rounded-xl md:rounded-xl 
        shadow-2xl border border-gray-200 
        flex flex-col 
        animate-in slide-in-from-bottom-10 fade-in duration-200 md:animate-in md:fade-in md:zoom-in-95
        overflow-hidden
      ">
      
        {/* HEADER */}
        <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
             {type === 'text' ? <ListChecks size={16} className="text-primary"/> : <Filter size={16} className="text-primary"/>}
             Filtros: <span className="text-gray-900">{column.label}</span>
          </h3>
          <Button variant="danger" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* --- UI PARA TEXTO (LISTA) --- */}
        {type === 'text' && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Buscador */}
            <div className="p-2 border-b border-gray-100 shrink-0">
              <Input 
                icon={SearchIcon}
                placeholder={`Buscar ${column.label}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* Acciones Rápidas */}
            <div className="flex justify-between px-3 py-1.5 bg-gray-50/50 text-xs shrink-0 border-b border-gray-100">
              <button onClick={handleSelectAll} className="text-primary font-bold hover:underline">Seleccionar todos</button>
              <button onClick={handleDeselectAll} className="text-gray-500 hover:text-gray-700 hover:underline">Borrar selección</button>
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-[150px] md:max-h-60 md:min-h-0">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => (
                  <Checkbox 
                    key={opt}
                    label={opt}
                    checked={localFilter.selectedValues?.includes(opt)}
                    onChange={() => handleTextToggle(opt)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm italic flex flex-col items-center gap-2">
                  <SearchIcon size={24} className="opacity-20"/>
                  Sin resultados
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- UI PARA NÚMEROS --- */}
        {type === 'number' && (
          <div className="p-4 bg-gray-50/30">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Condición Numérica</label>
            <div className="flex gap-2">
              <select 
                value={localFilter.operator}
                onChange={(e) => setLocalFilter({...localFilter, operator: e.target.value})}
                className="w-20 p-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value=">">Mayor que {'>'}</option>
                <option value="<">Menor que {'<'}</option>
                <option value="=">Igual a {'='}</option>
              </select>
              <Input 
                type="number"
                placeholder="Valor..."
                value={localFilter.value}
                onChange={(e) => setLocalFilter({...localFilter, value: e.target.value})}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* FOOTER ACCIONES */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0 safe-area-bottom">
          <span className="text-xs text-gray-400 hidden md:inline font-medium ml-1">
             {type === 'text' ? `${localFilter.selectedValues?.length || 0} seleccionados` : ''}
          </span>
          <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => { onSave(null); onClose(); }}
                className="flex-1 md:flex-none"
              >
                  Limpiar
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => { onSave(localFilter); onClose(); }}
                className="flex-1 md:flex-none"
              >
                  Aplicar Filtros
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}