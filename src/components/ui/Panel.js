export default function Panel({ children, className = '' }) {
  return (
    <div className={`bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}