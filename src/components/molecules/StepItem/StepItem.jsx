export function StepItem({ step, title, description }) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-sm font-medium text-white">
        {step}
      </span>
      <div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </li>
  );
}
