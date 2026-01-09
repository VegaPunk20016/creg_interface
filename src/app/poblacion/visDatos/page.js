'use client';
import { useState, useMemo } from 'react'; 
import QueryBuilder from '@/components/dashboard/QueryBuilder';
import Visualization from '@/components/dashboard/Visualization';
import { MOCK_DATA, AVAILABLE_COLUMNS } from '@/lib/mockData'; 
import { Search, Trash2 } from 'lucide-react'; 

export default function DashboardPage() {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [isConsulted, setIsConsulted] = useState(false); 
  const [loading, setLoading] = useState(false);

  const processedData = useMemo(() => {

    if (!isConsulted) return null;

    let data = [...MOCK_DATA];


    Object.keys(activeFilters).forEach(colId => {
      const filter = activeFilters[colId];
      
      // Filtro de Texto (ej. Entidad = 'Hidalgo')
      if (filter.type === 'text' && filter.selectedValues?.length > 0) {
        data = data.filter(row => filter.selectedValues.includes(row[colId]));
      }
      
      // Filtro Numérico (ej. Población > 1000)
      if (filter.type === 'number' && filter.value !== '') {
        const val = parseFloat(filter.value);
        if (!isNaN(val)) {
          data = data.filter(row => {
            if (filter.operator === '>') return row[colId] > val;
            if (filter.operator === '<') return row[colId] < val;
            if (filter.operator === '=') return row[colId] == val;
            return true;
          });
        }
      }
    });

  
    if (data.length > 0) {
      const groups = {};

      data.forEach(row => {
        const groupKey = selectedColumns
          .filter(col => typeof row[col] !== 'number' && col !== 'id') 
          .map(col => row[col])
          .join('|');

        if (!groups[groupKey]) {
          groups[groupKey] = { ...row };
          selectedColumns.forEach(col => {
            if (typeof row[col] === 'number') groups[groupKey][col] = 0;
          });
        }

        selectedColumns.forEach(col => {
          if (typeof row[col] === 'number') {
            groups[groupKey][col] += row[col];
          }
        });
      });

      return Object.values(groups);
    }

    return [];
  }, [isConsulted, activeFilters, selectedColumns]); 


  const handleConsultar = () => {
    setLoading(true);
    setTimeout(() => {
      setIsConsulted(true);
      setLoading(false);
    }, 600);
  };

  const handleLimpiar = () => {
    setSelectedColumns([]);
    setActiveFilters({});
    setIsConsulted(false);
  };

  const handleFilterChange = (colId, newFilter) => {
    setActiveFilters(prev => {
      if (!newFilter) {
        const copy = { ...prev };
        delete copy[colId];
        return copy;
      }
      return { ...prev, [colId]: newFilter };
    });
  };

  return (
    <section className="min-h-[calc(100vh-2rem)] space-y-8 animate-in fade-in duration-500 p-6">
      
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-end w-full">   
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            VisDatos Población
          </h1>
          <p className="text-gray-500 mt-1">
            Explorador de Datos Censales y Financieros
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={handleLimpiar}
            disabled={loading || (!isConsulted && selectedColumns.length === 0)}
            className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg
                ${loading || (!isConsulted && selectedColumns.length === 0)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-red-500/10 hover:-translate-y-0.5'
              }`}
          >
            <Trash2 size={18} />
            Limpiar
          </button>
          <button
            onClick={handleConsultar}
            disabled={loading || selectedColumns.length === 0}
            className={`px-6 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg
                ${loading || selectedColumns.length === 0
                ? 'bg-gray-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5'
              }`}
          >
            {loading ? (
              'Procesando...'
            ) : (
              <>
                <Search size={18} /> Consultar Datos
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="w-full space-y-6">
          
          <QueryBuilder
            available={AVAILABLE_COLUMNS}
            selected={selectedColumns}
            activeFilters={activeFilters}
            data={MOCK_DATA} 
            onSelectChange={(cols) => setSelectedColumns(cols)}
            onFilterChange={handleFilterChange}
          />

          {processedData && (
            <div className="pt-4 border-t border-gray-200 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between">
                <span>Resultados de la Consulta</span>
                <span className="text-sm font-normal text-gray-500">
                    {processedData.length} registros (agrupados)
                </span>
              </h3>
              
              <Visualization data={processedData} columns={selectedColumns} />
              
            </div>
          )}
        </div>
      </div>
    </section>
  );
}