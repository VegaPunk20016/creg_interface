'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart, FileSpreadsheet, Map as MapIcon } from 'lucide-react';
import MapWrapper from './MapWrapper';

export default function Visualization({ data, columns }) {
  const [activeTab, setActiveTab] = useState('table'); 
  const [chartType, setChartType] = useState('bar');

  // Filtrar columna ID para cálculos
  const visibleColumns = useMemo(() => {
    return columns.filter(col => col !== 'id');
  }, [columns]);

  // --- DETECCIÓN DE EJES (Lógica Corregida) ---
  const { xAxisKey, seriesKeys } = useMemo(() => {
    if (!data || data.length === 0) return { xAxisKey: '', seriesKeys: [] };

    const firstItem = data[0];
    
    // 1. Prioridad para el Eje X:
    let xKey = '';
    
    if (visibleColumns.includes('municipio')) {
        xKey = 'municipio'; // Prioridad 1: Si hay municipio, úsalo para el desglose.
    } else if (visibleColumns.includes('entidad')) {
        xKey = 'entidad';   // Prioridad 2: Si no hay municipio, usa Entidad.
    } else {
        // Fallback: busca cualquier columna de texto
        xKey = visibleColumns.find(col => isNaN(firstItem[col])) || visibleColumns[0];
    }

    // 2. Series (Datos numéricos a graficar)
    const sKeys = visibleColumns.filter(col => col !== xKey && !isNaN(firstItem[col]));

    return { xAxisKey: xKey, seriesKeys: sKeys };
  }, [data, visibleColumns]);

  const canChart = seriesKeys.length > 0;
  // Detectar si podemos mostrar mapa (necesitamos entidad o municipio)
  const canMap = columns.includes('entidad') || columns.includes('municipio');

  // --- RENDERIZADO DE GRÁFICAS ---
  const renderChart = () => {
    if (!canChart) return null;

    const ChartComponent = chartType === 'line' ? LineChart : (chartType === 'area' ? AreaChart : BarChart);
    const DataComponent = chartType === 'line' ? Line : (chartType === 'area' ? Area : Bar);

    // UX: Ajustes de densidad
    const isDense = data.length > 8;
    const showBrush = data.length > 6;

    // Cálculo dinámico del margen inferior para etiquetas rotadas y Brush
    const bottomMargin = isDense ? 70 : (showBrush ? 40 : 20);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent 
            data={data} 
            margin={{ top: 20, right: 10, left: 0, bottom: bottomMargin }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6B7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            // UX: Rotación condicional
            angle={isDense ? -45 : 0}
            textAnchor={isDense ? 'end' : 'middle'}
            height={isDense ? 60 : 30} 
            interval={isDense ? 0 : 'preserveStartEnd'} 
          />
          
          <YAxis 
            stroke="#6B7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            width={40} 
            tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
            }} 
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            cursor={{ fill: '#F3F4F6' }}
            formatter={(value) => new Intl.NumberFormat('es-MX').format(value)}
          />
          
          <Legend wrapperStyle={{ paddingTop: '0px', paddingBottom: '10px', fontSize: '12px' }} verticalAlign="top" iconSize={10} />
          
          {seriesKeys.map((key, index) => (
            <DataComponent
              key={key}
              type="monotone" 
              dataKey={key}
              fill={COLORS[index % COLORS.length]} 
              stroke={COLORS[index % COLORS.length]} 
              strokeWidth={2}
              radius={[4, 4, 0, 0]} 
              fillOpacity={chartType === 'area' ? 0.3 : 1}
              isAnimationActive={true}
            />
          ))}

          {showBrush && (
            <Brush 
                dataKey={xAxisKey} 
                height={25} 
                stroke="#2563EB" 
                fill="#EFF6FF"
                tickFormatter={() => ''} 
                travellerWidth={10}
            />
          )}

        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full w-full">
      
      {/* HEADER RESPONSIVE */}
      <div className="border-b border-gray-200 p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
        
        {/* Grupo de Botones Principal */}
        <div className="flex bg-gray-200/60 p-1 rounded-lg w-full sm:w-auto">
           <button
            onClick={() => setActiveTab('table')}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
              ${activeTab === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FileSpreadsheet size={16} /> <span className="sm:inline">Tabla</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            disabled={!canChart}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
              ${!canChart 
                ? 'text-gray-400 cursor-not-allowed opacity-60' 
                : activeTab === 'chart' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
          >
            <PieChart size={16} /> <span className="sm:inline">Gráfica</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            disabled={!canMap}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
              ${!canMap
                ? 'text-gray-400 cursor-not-allowed opacity-60' 
                : activeTab === 'map' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
          >
            <MapIcon size={16} /> <span className="sm:inline">Mapa</span>
          </button>
        </div>

        {/* Grupo Selector de Tipo de Gráfica */}
        {activeTab === 'chart' && canChart && (
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end animate-in fade-in">
            <button 
              onClick={() => setChartType('bar')} 
              title="Barras"
              className={`flex-1 sm:flex-none justify-center p-2 rounded-lg transition-colors ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500'}`}
            >
              <BarChart3 size={20} />
            </button>
            <button 
              onClick={() => setChartType('line')} 
              title="Líneas"
              className={`flex-1 sm:flex-none justify-center p-2 rounded-lg transition-colors ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500'}`}
            >
              <LineIcon size={20} />
            </button>
          </div>
        )}
      </div>

      {/* CONTENIDO RESPONSIVE */}
      <div className="p-4 md:p-6 flex-1 w-full"> 
        
        {/* 1. VISTA GRÁFICA */}
        {activeTab === 'chart' && canChart && (
          <div className="w-full h-[350px] md:h-[500px]">
             {renderChart()}
          </div>
        )}

        {/* 2. VISTA MAPA */}
        {activeTab === 'map' && canMap && (
           <div className="w-full h-[350px] md:h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
             <MapWrapper data={data} columns={columns} />
           </div>
        )}

        {/* 3. VISTA TABLA */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto animate-in fade-in duration-300 max-h-[60vh] md:max-h-[500px] overflow-y-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm text-left relative">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 md:px-6 font-medium bg-gray-50 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={`${i}-${col}`} className="px-4 py-3 md:px-6 md:py-4 text-gray-700 whitespace-nowrap">
                        {typeof row[col] === 'number' 
                            ? new Intl.NumberFormat('es-MX').format(row[col]) 
                            : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Paleta de colores
const COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#10B981', '#F59E0B', '#6366F1', '#14B8A6'];