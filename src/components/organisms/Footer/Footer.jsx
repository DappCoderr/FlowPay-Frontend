import { Layers, Clock, Smartphone, Shield, Github, ExternalLink, Twitter } from 'lucide-react';
import { Logo } from '@/components/atoms';
import { Button } from '@/components/atoms';

const FLOW_FEATURES = [
  {
    Icon: Layers,
    title: 'Flow Client Library',
    text: 'Industry-standard wallet connection and authentication.',
  },
  {
    Icon: Clock,
    title: 'Scheduled Transactions',
    text: 'Execute payments automatically at predetermined intervals.',
  },
  {
    Icon: Smartphone,
    title: 'Flow Blockchain',
    text: 'Native FLOW tokens with secure, low-fee transfers.',
  },
  {
    Icon: Shield,
    title: 'On-Chain Transparency',
    text: 'Auditable, immutable payment records on blockchain.',
  },
];

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'Flow Docs', href: 'https://docs.onflow.org', icon: ExternalLink },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
          {/* Left Column - The Problem */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400/80">
              The Challenge
            </h3>
            <p className="text-white/80 leading-relaxed text-base">
              Recurring payments traditionally require manual invoicing, chasing due dates, and complex reconciliation. 
              <span className="text-white font-medium"> FlowPay eliminates this friction.</span>
            </p>
            <p className="text-white/70 text-sm">
              Set up payment streams once, add wallet addresses, and let blockchain handle the execution automatically.
            </p>
          </div>

          {/* Right Column - Powered By Flow */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-400/80">
              Powered by Flow
            </h3>
            <ul className="space-y-3">
              {FLOW_FEATURES.map(({ Icon, title, text }, i) => (
                <li key={i} className="flex gap-3">
                  <Icon className="w-5 h-5 shrink-0 text-cyan-400/70 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{title}</p>
                    <p className="text-white/60 text-xs">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-12" />

        {/* Bottom Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo asLink={false} />
            <p className="text-xs text-white/40 leading-relaxed max-w-xs">
              A hackathon project showcasing the power of Flow blockchain for recurring payments.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Resources</h4>
            <div className="space-y-2">
              <a
                href="https://docs.onflow.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/60 hover:text-cyan-400 transition-colors"
              >
                Flow Documentation
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/60 hover:text-cyan-400 transition-colors"
              >
                GitHub Repository
              </a>
              <a
                href="/faq"
                className="block text-sm text-white/60 hover:text-cyan-400 transition-colors"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Follow Us</h4>
            <div className="flex gap-3">
              {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">
            © 2026 FlowPay. Built for the Flow community. 
            <a
              href="https://flow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/70 hover:text-cyan-400 transition-colors ml-1"
            >
              Powered by Flow Blockchain
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}