import { Check, Lock, Filter } from 'lucide-react';

export default function SelectableChip({ 
  label, 
  isSelected, 
  isLocked, 
  hasActiveFilter, 
  onClick, 
  onFilterClick 
}) {
  return (
    <div className="relative group grow sm:grow-0">
      <button
        onClick={onClick}
        disabled={isLocked && !isSelected}
        className={`
          w-full sm:w-auto justify-center sm:justify-start
          flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-all border select-none
          active:scale-[0.98] md:active:scale-100
          ${isLocked 
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70' 
            : isSelected 
              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-100' 
              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500'
          }
        `}
      >
        {/* Checkbox Visual */}
        <div className={`
          size-4 rounded border flex items-center justify-center transition-colors shrink-0
          ${isLocked 
            ? 'border-gray-300 bg-gray-200' 
            : isSelected 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-gray-300 bg-white group-hover:border-blue-400'
          }
        `}>
          {isSelected && <Check size={12} className="text-white stroke-[3]" />}
        </div>

        <span className="truncate">{label}</span>

        {/* Icono de Candado o Filtro */}
        {isLocked ? (
          <Lock size={14} className="ml-1 text-gray-400 shrink-0" />
        ) : (
          (hasActiveFilter || isSelected) && (
            <div 
              role="button"
              onClick={(e) => {
                e.stopPropagation(); // Evita seleccionar/deseleccionar al hacer click en el filtro
                onFilterClick && onFilterClick(e);
              }}
              className={`
                ml-1 p-1 md:p-0.5 rounded-full hover:bg-blue-200 transition-colors cursor-pointer shrink-0 
                ${hasActiveFilter ? 'bg-blue-100' : ''}
              `}
            >
              <Filter 
                size={14} 
                className={`transition-opacity ${hasActiveFilter ? 'text-blue-600 fill-blue-600' : 'text-blue-400 opacity-70'}`} 
              />
            </div>
          )
        )}
      </button>
    </div>
  );
}