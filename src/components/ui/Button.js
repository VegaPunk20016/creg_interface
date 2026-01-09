export default function Button({ children, variant = 'primary', size = 'lg', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 duration-200 disabled:opacity-50 disabled:pointer-events-none";
  
  const sizes = {
    sm: "h-8 px-3 text-xs rounded-lg",
    md: "h-10 px-4 text-sm rounded-xl",
    lg: "h-14 px-8 text-base rounded-2xl" // El tamaño original
  };

  const variants = {
    primary: "bg-primary hover:bg-blue-600 text-white shadow-sm",
    secondary: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50", // Nuevo para "Limpiar"
    ghost: "text-white/80 hover:text-white hover:bg-white/5",
    danger: "text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 h-auto w-auto aspect-square", // Para la X de cerrar
    link: "text-primary hover:underline p-0 h-auto bg-transparent active:scale-100"
  };

  // Combinamos estilos
  const selectedSize = (variant === 'link' || variant === 'danger') ? '' : (sizes[size] || sizes.lg);

  return (
    <button 
      className={`${baseStyles} ${selectedSize} ${variants[variant] || variants.primary} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}