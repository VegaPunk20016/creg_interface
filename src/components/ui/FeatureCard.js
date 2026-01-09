export default function FeatureCard({ icon: Icon, title, description, step }) {
  return (
    <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300 relative group">
      {/* Icono con fondo */}
      <div className={`size-20 mb-6 rounded-2xl flex items-center justify-center shadow-inner transition-colors
        ${step === 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-blue-100 text-primary'}
      `}>
         <Icon className="size-10" />
      </div>
      
      <h3 className="text-xl font-bold text-[#051733] mb-3">
        {step}. {title}
      </h3>
      <p className="text-[#64748b] leading-relaxed">
        {description}
      </p>
    </div>
  );
}