import { NavLink } from 'react-router-dom'

/**
 * Atom: FlowPay logo mark + wordmark. Links to home.
 */
export function Logo({ asLink = true, className = '' }) {
  const content = (
    <>
      <div className="w-10 h-10 bg-white text-black rounded-md flex items-center justify-center font-bold shrink-0">
        FP
      </div>
      <div>
        <span className="text-xl font-semibold text-white block">FlowPay</span>
        <span className="text-xs text-white/50">Payments on Flow</span>
      </div>
    </>
  )

  if (asLink) {
    return (
      <NavLink to="/" className={`flex items-center gap-4 ${className}`}>
        {content}
      </NavLink>
    )
  }
  return <div className={`flex items-center gap-4 ${className}`}>{content}</div>
}
