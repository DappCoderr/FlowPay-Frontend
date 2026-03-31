import { Layers, Clock, Smartphone, Shield, Github, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/atoms';

const FLOW_ITEMS = [
  {
    Icon: Layers,
    text: (
      <>
        <strong className="text-white">Flow Client Library (FCL)</strong> —
        wallet connection and authentication.
      </>
    ),
  },
  {
    Icon: Clock,
    text: (
      <>
        <strong className="text-white">Scheduled transactions</strong> — execute
        payments automatically when the subscription period ends.
      </>
    ),
  },
  {
    Icon: Smartphone,
    text: (
      <>
        <strong className="text-white">Flow ecosystem</strong> — native FLOW and
        compatible tokens for secure, low-fee transfers.
      </>
    ),
  },
  {
    Icon: Shield,
    text: (
      <>
        <strong className="text-white">On-chain logic</strong> — transparent,
        auditable subscription and payment rules.
      </>
    ),
  },
];

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'Flow Docs', href: 'https://docs.onflow.org', icon: ExternalLink },
  { label: 'Discord', href: 'https://discord.gg/flow', icon: ExternalLink },
];

export function Footer() {
  return (
    <footer className="border-t border-white/20 bg-black backdrop-blur-sm mt-auto relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Left Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              The Problem
            </h3>
            <p className="text-white/80 leading-relaxed text-sm md:text-base">
              Recurring payments usually mean manual invoicing, chasing due
              dates, and delayed payouts. FlowPay removes that friction: create
              a subscription once, add the recipient&apos;s wallet, and payments
              run automatically when each period ends. End users get paid on
              time; you stay hands-off.
            </p>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              Powered By Flow
            </h3>
            <ul className="space-y-3">
              {FLOW_ITEMS.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 shrink-0 mt-1 text-cyan-400/70" />
                  <span className="text-white/70 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo and Description */}
          <div className="flex-1">
            <Logo asLink={false} />
            <p className="text-xs text-white/40 mt-3">Payments on Flow · Testnet</p>
            <p className="text-xs text-white/40 mt-1">Built with care for the Flow community</p>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-white/60 hover:text-cyan-400 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="text-xs text-white/30 text-center">
            © 2026 FlowPay. Built on{' '}
            <a
              href="https://flow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              Flow Blockchain
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
