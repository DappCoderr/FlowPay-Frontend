import { NavLink } from 'react-router-dom';
import FlowLogoUI from '../../../assets/FlowLogo-UI.png';

export function Logo({ asLink = true, className = '' }) {
  const content = (
    <>
      <img src={FlowLogoUI} alt="FlowPay Logo" className="w-16 h-16 shrink-0" />
      <div className="leading-tight">
        <span className="text-xl font-semibold text-white block">FlowPay</span>
        <span className="text-xs text-white/50 block">Payments on Flow</span>
      </div>
    </>
  );

  if (asLink) {
    return (
      <NavLink to="/" className={`flex items-center gap-4 ${className}`}>
        {content}
      </NavLink>
    );
  }
  return (
    <div className={`flex items-center gap-4 ${className}`}>{content}</div>
  );
}
