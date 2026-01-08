'use client';

import { useState } from 'react';
import { Check, Filter, Lock } from 'lucide-react';
import FilterPopup from './FilterPopup';

export default function QueryBuilder({ available = [], selected = [], activeFilters = {}, onSelectChange, onFilterChange, data = [] }) {
  const [openPopupId, setOpenPopupId] = useState(null);

  const getColType = (colId) => {
    if (!data || data.length === 0) return 'text';
    return typeof data[0][colId] === 'number' ? 'number' : 'text';
  };

  // --- LÓGICA DE BLOQUEO DE COLUMNAS (Intacta) ---
  const isColumnLocked = (colId) => {
    if (colId === 'municipio') {
      const entidadFilter = activeFilters['entidad'];
      const hasEntidadSelection = entidadFilter && entidadFilter.selectedValues && entidadFilter.selectedValues.length > 0;
      return !hasEntidadSelection; 
    }
    if (colId === 'sexo' || colId === 'edad') {
      return !selected.includes('poblacion');
    }
    return false;
  };

  const getDataForPopup = (colId) => {
    if (colId === 'municipio') {
      const entidadFilter = activeFilters['entidad'];
      if (entidadFilter && entidadFilter.selectedValues?.length > 0) {
        return data.filter(row => entidadFilter.selectedValues.includes(row.entidad));
      }
    }
    return data;
  };

  const handleColumnClick = (colId) => {
    // A. Manejo de bloqueos
    if (isColumnLocked(colId)) {
      if (colId === 'municipio') {
        alert("⚠️ Primero debes filtrar por 'Entidad' para seleccionar un Municipio.");
      } else if (colId === 'sexo' || colId === 'edad') {
        alert("⚠️ Debes seleccionar la columna 'Población Total' para habilitar este desglose.");
      }
      return;
    }

    // B. Lógica de selección/deselección
    if (selected.includes(colId)) {
      if (colId === 'poblacion') {
        const newSelected = selected.filter(id => id !== 'poblacion' && id !== 'sexo' && id !== 'edad');
        onSelectChange(newSelected);
        
        onFilterChange('poblacion', null);
        onFilterChange('sexo', null);
        onFilterChange('edad', null);

        if (openPopupId === 'poblacion') setOpenPopupId(null);
      } 
      else {
        onSelectChange(selected.filter(id => id !== colId));
        if (activeFilters[colId]) {
           onFilterChange(colId, null);
        }
        if (openPopupId === colId) setOpenPopupId(null);
      }
      
    } else {
      onSelectChange([...selected, colId]);
      setOpenPopupId(colId); 
    }
  };

  const handleFilterIconClick = (e, colId) => {
    e.stopPropagation(); 
    if (!isColumnLocked(colId) && selected.includes(colId)) {
       setOpenPopupId(openPopupId === colId ? null : colId);
    }
  };

  const isFiltered = (colId) => {
    const f = activeFilters[colId];
    if (!f) return false;
    if (f.type === 'text' && f.selectedValues?.length > 0) return true;
    if (f.type === 'number' && f.value !== '') return true;
    return false;
  };

  return (
    // 1. RESPONSIVE CONTAINER: Menos padding en móvil (p-4), más en desktop (md:p-6)
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      
      {/* 2. RESPONSIVE HEADER: Stack vertical en móvil, fila en desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shrink-0">1</span>
          Selecciona Columnas y Filtra
        </h2>
        <span className="text-xs md:text-sm text-gray-400 pl-8 sm:pl-0">
            Haz clic para activar/filtrar
        </span>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        {available.map((col) => {
          const colId = col.id || col;
          const label = col.label || col;
          const isSelected = selected.includes(colId);
          const hasActiveFilter = isFiltered(colId);
          const locked = isColumnLocked(colId);

          return (
            // Flex grow en móvil para que los botones llenen el ancho disponible
            <div key={colId} className="relative group flex-grow sm:flex-grow-0">
              
              <button
                onClick={() => handleColumnClick(colId)}
                disabled={locked && !isSelected} 
                className={`
                  w-full sm:w-auto justify-center sm:justify-start
                  flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all border select-none
                  active:scale-[0.98] md:active:scale-100
                  ${locked 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70' 
                    : isSelected 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500'
                  }
                `}
              >
                {/* Checkbox Visual */}
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0
                  ${locked ? 'border-gray-300 bg-gray-200' : isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}
                `}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>

                <span className="truncate">{label}</span>

                {/* Icono de Candado o Filtro */}
                {locked ? (
                  <Lock size={14} className="ml-1 text-gray-400 shrink-0" />
                ) : (
                  (hasActiveFilter || isSelected) && (
                    <div 
                      onClick={(e) => handleFilterIconClick(e, colId)}
                      // Área de toque aumentada para el icono de filtro en móvil
                      className={`ml-1 p-1 md:p-0.5 rounded-full hover:bg-blue-200 transition-colors cursor-pointer shrink-0 ${hasActiveFilter ? 'bg-blue-100' : ''}`}
                    >
                          <Filter 
                            size={14} 
                            className={`transition-opacity ${hasActiveFilter ? 'text-blue-600 fill-blue-600' : 'text-blue-400 opacity-70'}`} 
                          />
                    </div>
                  )
                )}
              </button>

              {openPopupId === colId && !locked && (
                <FilterPopup 
                  column={col}
                  type={getColType(colId)}
                  data={getDataForPopup(colId)} 
                  currentFilter={activeFilters[colId]}
                  onClose={() => setOpenPopupId(null)}
                  onSave={(newFilter) => onFilterChange(colId, newFilter)}
                />
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}