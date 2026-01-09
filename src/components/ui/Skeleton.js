export default function Skeleton({ className = '', children }) {
  return (
    <div className={`w-full h-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400 font-medium ${className}`}>
      {children}
    </div>
  );
}