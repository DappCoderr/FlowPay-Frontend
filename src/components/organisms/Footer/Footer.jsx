import { Layers, Clock, Smartphone, Shield } from 'lucide-react'
import { Logo } from '@/components/atoms'

const FLOW_ITEMS = [
  { Icon: Layers, text: <><strong className="text-white">Flow Client Library (FCL)</strong> — wallet connection and authentication.</> },
  { Icon: Clock, text: <><strong className="text-white">Scheduled transactions</strong> — execute payments automatically when the subscription period ends.</> },
  { Icon: Smartphone, text: <><strong className="text-white">Flow ecosystem</strong> — native FLOW and compatible tokens for secure, low-fee transfers.</> },
  { Icon: Shield, text: <><strong className="text-white">On-chain logic</strong> — transparent, auditable subscription and payment rules.</> },
]

export function Footer() {
  return (
    <footer className="border-t border-white/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              The problem we solve
            </h3>
            <p className="text-white/90 leading-relaxed">
              Recurring payments usually mean manual invoicing, chasing due dates, and delayed payouts. FlowPay removes that friction: create a subscription once, add the recipient&apos;s wallet, and payments run automatically when each period ends. End users get paid on time; you stay hands-off.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              Flow components we use
            </h3>
            <ul className="space-y-3 text-white/90">
              {FLOW_ITEMS.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 shrink-0 mt-0.5 text-white/80" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Logo asLink={false} />
          <p className="text-sm text-white/50">Payments on Flow · Testnet</p>
        </div>
      </div>
    </footer>
  )
}
