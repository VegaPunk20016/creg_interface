'use client';

import { useState } from 'react';
import FilterPopup from './FilterPopup';
import Panel from '../ui/Panel'; // Nuevo
import SelectableChip from '../ui/SelectableChip'; // Nuevo

export default function QueryBuilder({ available = [], selected = [], activeFilters = {}, onSelectChange, onFilterChange, data = [] }) {
  const [openPopupId, setOpenPopupId] = useState(null);

  // --- LÓGICA DE NEGOCIO (Sin cambios) ---
  const getColType = (colId) => {
    if (!data || data.length === 0) return 'text';
    return typeof data[0][colId] === 'number' ? 'number' : 'text';
  };

  const isColumnLocked = (colId) => {
    if (colId === 'municipio') {
      const entidadFilter = activeFilters['entidad'];
      return !(entidadFilter && entidadFilter.selectedValues && entidadFilter.selectedValues.length > 0);
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
    // Manejo de bloqueos
    if (isColumnLocked(colId)) {
      if (colId === 'municipio') {
        alert("⚠️ Primero debes filtrar por 'Entidad' para seleccionar un Municipio.");
      } else if (colId === 'sexo' || colId === 'edad') {
        alert("⚠️ Debes seleccionar la columna 'Población Total' para habilitar este desglose.");
      }
      return;
    }

    // Lógica de selección
    if (selected.includes(colId)) {
      if (colId === 'poblacion') {
        const newSelected = selected.filter(id => id !== 'poblacion' && id !== 'sexo' && id !== 'edad');
        onSelectChange(newSelected);
        onFilterChange('poblacion', null);
        onFilterChange('sexo', null);
        onFilterChange('edad', null);
        if (openPopupId === 'poblacion') setOpenPopupId(null);
      } else {
        onSelectChange(selected.filter(id => id !== colId));
        if (activeFilters[colId]) onFilterChange(colId, null);
        if (openPopupId === colId) setOpenPopupId(null);
      }
    } else {
      onSelectChange([...selected, colId]);
      setOpenPopupId(colId); 
    }
  };

  const handleFilterIconClick = (colId) => {
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

  // --- RENDER ---
  return (
    <Panel className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shrink-0">
            1
          </span>
          Selecciona Columnas y Filtra
        </h2>
        <span className="text-xs md:text-sm text-gray-400 pl-8 sm:pl-0">
           Haz clic para activar/filtrar
        </span>
      </div>

      {/* Lista de Chips */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {available.map((col) => {
          const colId = col.id || col;
          const label = col.label || col;
          const locked = isColumnLocked(colId);

          return (
            <div key={colId} className="relative">
              <SelectableChip 
                label={label}
                isSelected={selected.includes(colId)}
                isLocked={locked}
                hasActiveFilter={isFiltered(colId)}
                onClick={() => handleColumnClick(colId)}
                onFilterClick={() => handleFilterIconClick(colId)}
              />

              {/* Popup de Filtro */}
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
    </Panel>
  );
}