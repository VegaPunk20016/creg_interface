import { Check } from 'lucide-react';

export default function Checkbox({ label, checked, onChange, className = '' }) {
  return (
    <div 
      onClick={onChange}
      className={`
        flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm transition-all select-none group
        ${checked 
          ? 'bg-blue-50 border border-blue-200 text-primary' 
          : 'hover:bg-gray-50 border border-transparent text-gray-600'
        }
        ${className}
      `}
    >
      {/* Caja del Check */}
      <div className={`
        size-5 rounded flex items-center justify-center border transition-colors shrink-0
        ${checked ? 'bg-primary border-primary' : 'bg-white border-gray-300 group-hover:border-gray-400'}
      `}>
        {checked && <Check size={12} className="text-white stroke-[3]" />}
      </div>
      
      <span className="font-medium truncate">{label}</span>
    </div>
  );
}