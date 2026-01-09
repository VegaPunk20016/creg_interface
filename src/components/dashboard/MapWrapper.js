'use client';
import dynamic from 'next/dynamic';
import { Map } from 'lucide-react';
import Skeleton from '../ui/Skeleton'; // Ajusta la ruta si es necesario

const MapChart = dynamic(() => import('./MapChart'), { 
  ssr: false,
  loading: () => (
    <Skeleton className="min-h-400px border border-gray-100">
       <div className="flex flex-col items-center gap-2 opacity-50">
          <Map size={32} />
          <span className="text-sm">Preparando Mapa...</span>
       </div>
    </Skeleton>
  )
});

export default MapChart;