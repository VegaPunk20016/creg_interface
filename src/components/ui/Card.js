export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/90 p-3 rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}