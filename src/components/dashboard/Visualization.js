'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';
import { 
  BarChart3, LineChart as LineIcon, PieChart, 
  FileSpreadsheet, Map as MapIcon 
} from 'lucide-react';

// UI Components
import Panel from '../ui/Panel';
import SegmentedControl from '../ui/SegmentedControl';
import Table from '../ui/Table';
import MapWrapper from './MapWrapper';

export default function Visualization({ data, columns }) {
  const [activeTab, setActiveTab] = useState('table'); 
  const [chartType, setChartType] = useState('bar');

  // Filtrar columna ID para cálculos
  const visibleColumns = useMemo(() => columns.filter(col => col !== 'id'), [columns]);

  // --- DETECCIÓN DE EJES (Lógica de Negocio Recharts) ---
  const { xAxisKey, seriesKeys } = useMemo(() => {
    if (!data || data.length === 0) return { xAxisKey: '', seriesKeys: [] };
    const firstItem = data[0];
    
    // 1. Eje X
    let xKey = '';
    if (visibleColumns.includes('municipio')) xKey = 'municipio';
    else if (visibleColumns.includes('entidad')) xKey = 'entidad';
    else xKey = visibleColumns.find(col => isNaN(firstItem[col])) || visibleColumns[0];

    // 2. Series
    const sKeys = visibleColumns.filter(col => col !== xKey && !isNaN(firstItem[col]));
    return { xAxisKey: xKey, seriesKeys: sKeys };
  }, [data, visibleColumns]);

  const canChart = seriesKeys.length > 0;
  const canMap = columns.includes('entidad') || columns.includes('municipio');


  const mainTabs = [
    { value: 'table', label: 'Tabla', icon: FileSpreadsheet },
    { value: 'chart', label: 'Gráfica', icon: PieChart, disabled: !canChart },
    { value: 'map', label: 'Mapa', icon: MapIcon, disabled: !canMap },
  ];

  const chartTypeTabs = [
    { value: 'bar', icon: BarChart3 },
    { value: 'line', icon: LineIcon },
  ];

  // --- RENDERIZADO DE GRÁFICAS ---
  const renderChart = () => {
    if (!canChart) return null;

    const ChartComponent = chartType === 'line' ? LineChart : (chartType === 'area' ? AreaChart : BarChart);
    const DataComponent = chartType === 'line' ? Line : (chartType === 'area' ? Area : Bar);

    const isDense = data.length > 8;
    const showBrush = data.length > 6;
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
    <Panel className="p-0 overflow-hidden flex flex-col h-full w-full"> {/* Override padding del Panel */}
      
      {/* HEADER: Controles */}
      <div className="border-b border-gray-200 p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
        
        {/* Selector Principal (Tabla/Gráfica/Mapa) */}
        <SegmentedControl 
          options={mainTabs}
          value={activeTab}
          onChange={setActiveTab}
        />

        {/* Selector Tipo de Gráfica (Solo visible en tab gráfica) */}
        {activeTab === 'chart' && canChart && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <SegmentedControl 
              options={chartTypeTabs}
              value={chartType}
              onChange={setChartType}
            />
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-4 md:p-6 flex-1 w-full min-h-0 flex flex-col"> 
        
        {/* 1. VISTA GRÁFICA */}
        {activeTab === 'chart' && canChart && (
          <div className="w-full flex-1 min-h-350px">
            {renderChart()}
          </div>
        )}

        {/* 2. VISTA MAPA */}
        {activeTab === 'map' && canMap && (
          <div className="w-full flex-1 min-h-350px rounded-xl overflow-hidden border border-gray-200 shadow-inner">
            <MapWrapper data={data} columns={columns} />
          </div>
        )}

        {/* 3. VISTA TABLA */}
        {activeTab === 'table' && (
          <div className="flex-1 overflow-hidden flex flex-col animate-in fade-in duration-300">
            <Table 
              columns={columns} 
              data={data} 
              className="max-h-[60vh] md:max-h-500px"
            />
          </div>
        )}
      </div>
    </Panel>
  );
}

const COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#10B981', '#F59E0B', '#6366F1', '#14B8A6'];