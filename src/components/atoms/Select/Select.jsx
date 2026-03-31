export function Select({ label, id, className = '', children, ...props }) {
  const selectId = id || props.name;
  const selectClasses = `w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-white/80 mb-1"
        >
          {label}
        </label>
      )}
      <select id={selectId} className={selectClasses} {...props}>
        {children}
      </select>
    </div>
  );
}
