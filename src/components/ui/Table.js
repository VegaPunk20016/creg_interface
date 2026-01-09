export default function Table({ columns = [], data = [], className = '' }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-400">No hay datos para mostrar</div>;
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-100 ${className}`}>
      <table className="w-full text-sm text-left relative">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 md:px-6 font-medium bg-gray-50 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={`${i}-${col}`} className="px-4 py-3 md:px-6 md:py-4 text-gray-700 whitespace-nowrap">
                  {typeof row[col] === 'number' 
                    ? new Intl.NumberFormat('es-MX').format(row[col]) 
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}