import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Cargando...', className = '' }) {
  return (
    <div className={`absolute inset-0 z-[1001] bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl ${className}`}>
       <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={40} />
          <span className="text-sm font-semibold text-gray-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
             {text}
          </span>
       </div>
    </div>
  );
}