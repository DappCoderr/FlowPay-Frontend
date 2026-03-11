import { Card } from '@/components/molecules'

export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About FlowPay</h1>
      <p className="text-white/80 leading-relaxed">
        FlowPay is a purpose-built subscription payment layer on Flow. We bridge the gap between recurring billing and blockchain efficiency by automatically executing scheduled token transfers, removing manual reconciliation and failed invoice risk.
      </p>

      <section className="rounded-2xl bg-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Why FlowPay exists</h2>
        <ul className="list-disc list-inside text-white/80 space-y-2">
          <li>Subscription automation is hard in decentralized apps; FlowPay makes it predictable.</li>
          <li>Users expect reliable payments; we provide a transparent on-chain ledger for every payout.</li>
          <li>Developers need a reusable pattern; this project is a clean foundation for production flows.</li>
        </ul>
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Fast" size="compact">
          <p className="text-sm text-white/60">Automatic cycles reduce latency and reduce manual edits.</p>
        </Card>
        <Card title="Secure" size="compact">
          <p className="text-sm text-white/60">Flow’s wallet-based auth and strong token primitives protect funds.</p>
        </Card>
        <Card title="Composable" size="compact">
          <p className="text-sm text-white/60">Built with FCL, FlowToken, and Cadence contracts for extensible integration.</p>
        </Card>
      </div>

      <p className="text-sm text-white/50">
        Try it as a prototype for recurring payouts, escrow logic, or subscription schedulers in your next Flow app.
      </p>
    </div>
  )
}
