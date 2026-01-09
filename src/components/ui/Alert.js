import { AlertCircle } from 'lucide-react';

export default function Alert({ title, message, className = '' }) {
  return (
    <div className={`absolute inset-0 z-[1000] flex flex-col items-center justify-center text-gray-400 text-sm bg-gray-50 p-4 text-center rounded-xl ${className}`}>
        <AlertCircle className="text-red-400 mb-2" size={32} />
        {title && <p className="font-semibold text-gray-700 mb-1">{title}</p>}
        {message && <p className="text-xs text-gray-500 max-w-xs">{message}</p>}
    </div>
  );
}