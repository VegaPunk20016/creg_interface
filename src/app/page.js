'use client'; // Indica que este archivo es un componente del lado del cliente
import { useState } from 'react'; // Importa el hook useState de React que sircve para manejar estado en componentes funcionales
import QueryBuilder from '@/components/dashboard/QueryBuilder';
import FilterSection from '@/components/dashboard/FilterSection';
import Visualization from '@/components/dashboard/Visualization';
import { MOCK_DATA, AVAILABLE_COLUMNS } from '@/lib/mockData'; //importa datos de prueba
import { Search } from 'lucide-react'; //importa icono de lupa


export default function DashboardPage() {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConsultar = () => {
    // Simular carga de red
    setLoading(true);
    setTimeout(() => {
      setResults(MOCK_DATA); // Cargar datos falsos
      setLoading(false);
    }, 1000);
  };

  const handleLimpiar = () => {
    setSelectedColumns([]);
    setResults(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">VisDatos Poblacion</h1>
            <p className="text-gray-500 mt-1">Explorador de Datos Censales y Financieros</p>
          </div>
          <div className="space-x-3">
             <button 
                onClick={handleLimpiar}
                className="bg-red-500/50 rounded-lg text-black px-6 py-2 font-medium shadow-lg shadow-red-500/30 hover:bg-red-600 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Limpiar
             </button>
             <button 
                onClick={handleConsultar}
                disabled={loading || selectedColumns.length === 0}
                className={`px-6 py-2 rounded-lg text-white font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all
                  ${loading || selectedColumns.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
                  }`}
              >
                {loading ? 'Procesando...' : <><Search size={18}/> Consultar Datos</>}
             </button>
          </div>
        </div>

        {/* Sección de Construcción de Consulta */}
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <QueryBuilder 
                  available={AVAILABLE_COLUMNS}
                  selected={selectedColumns}
                  onSelectChange={setSelectedColumns}
                />
                <FilterSection />
            </div>

            {/* Panel lateral informativo (opcional, para llenar espacio visual) */}
            <div className="hidden lg:block bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl">
               <h3 className="font-bold text-lg mb-2">Resumen de Consulta</h3>
               <p className="text-slate-300 text-sm mb-4">
                 Configura los parámetros a la izquierda para generar reportes dinámicos.
               </p>
               <div className="border-t border-slate-700 pt-4 mt-4">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-slate-400">Dataset:</span>
                   <span className="font-mono text-emerald-400">Población 2024</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Campos:</span>
                   <span>{selectedColumns.length} seleccionados</span>
                 </div>
               </div>
            </div>
        </div>

        {/* Resultados */}
        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Visualization data={results} columns={selectedColumns} />
          </div>
        )}

      </div>
    </main>
  );
}
