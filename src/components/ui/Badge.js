export default function Badge({ icon: Icon, text, pulsing = false, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${className}`}>
      {pulsing && <span className="size-2 rounded-full bg-accent animate-pulse"></span>}
      {Icon && <Icon className="size-4 md:size-5" />}
      <span className="text-xs font-bold uppercase tracking-wider">{text}</span>
    </div>
  );
}