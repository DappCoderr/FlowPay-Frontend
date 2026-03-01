import { Card } from '@/components/molecules'

export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About FlowPay</h1>
      <p className="text-white/80 leading-relaxed">
        FlowPay is a subscription payments app on the Flow blockchain. Create subscriptions, add recipient wallet addresses, and let auto-payments run when each period ends. It demonstrates wallet connection (FCL), routing, and a clean black-and-white UI.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Fast" size="compact">
          <p className="text-sm text-white/60">Optimized for quick micro-payments on Flow.</p>
        </Card>
        <Card title="Secure" size="compact">
          <p className="text-sm text-white/60">Wallet-based auth keeps private keys on the client.</p>
        </Card>
        <Card title="Open" size="compact">
          <p className="text-sm text-white/60">Built with FCL and Flow tooling for interoperability.</p>
        </Card>
      </div>

      <p className="text-sm text-white/50">
        Extend with real transaction flows, balance queries, and scheduled payouts.
      </p>
    </div>
  )
}
