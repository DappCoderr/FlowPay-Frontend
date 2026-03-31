export function Badge({ children, className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-sm text-white/80 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
