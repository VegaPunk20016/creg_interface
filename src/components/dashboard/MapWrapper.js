'use client';
import dynamic from 'next/dynamic';

const MapChart = dynamic(() => import('./MapChart'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
      Cargando Mapa...
    </div>
  )
});

export default MapChart;