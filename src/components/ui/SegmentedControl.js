export default function SegmentedControl({ 
  options = [], 
  value, 
  onChange, 
  className = '' 
}) {
  return (
    <div className={`flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => !opt.disabled && onChange(opt.value)}
          disabled={opt.disabled}
          title={opt.label || opt.value}
          className={`
            flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2
            ${opt.disabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : value === opt.value 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
            }
          `}
        >
          {opt.icon && <opt.icon size={16} />}
          {opt.label && <span className="hidden sm:inline">{opt.label}</span>}
        </button>
      ))}
    </div>
  );
}