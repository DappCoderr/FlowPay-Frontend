export function Card({ title, children, size = 'default', className = '' }) {
  const padding = size === 'compact' ? 'p-4' : 'p-6';
  return (
    <div
      className={`bg-white/[3%] backdrop-blur-sm border border-white/10 rounded-xl shadow-sm hover:shadow-md hover:border-white/20 transition-all duration-300 ${padding} ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
