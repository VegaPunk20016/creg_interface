import { Search } from 'lucide-react';

export default function Input({ 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  ...props 
}) {
  return (
    <div className={`relative ${containerClassName}`}>
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <input 
        className={`
          w-full bg-white border border-gray-200 text-gray-700 
          rounded-xl text-sm transition-all
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          placeholder:text-gray-400
          ${Icon ? 'pl-9 pr-3' : 'px-3'} py-2
          ${className}
        `}
        {...props}
      />
    </div>
  );
}