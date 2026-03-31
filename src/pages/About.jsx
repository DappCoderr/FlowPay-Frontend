import { Card } from '@/components/molecules';

export default function About() {
  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header Section */}
      <div className="col-span-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">About FlowPay</h1>
        <p className="text-white/70 leading-relaxed text-sm md:text-base max-w-3xl">
          FlowPay is a purpose-built subscription payment layer on Flow. We bridge
          the gap between recurring billing and blockchain efficiency by
          automatically executing scheduled token transfers, removing manual
          reconciliation and failed invoice risk.
        </p>
      </div>

      {/* Problem Section */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 rounded-2xl bg-white/10 border border-white/20 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Why FlowPay exists</h2>
          <ul className="space-y-3 text-white/80 text-sm md:text-base">
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>
                Subscription automation is hard in decentralized apps; FlowPay makes
                it predictable.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>
                Users expect reliable payments; we provide a transparent on-chain
                ledger for every payout.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>
                Developers need a reusable pattern; this project is a clean
                foundation for production flows.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Features Grid - 12 Column */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Feature 1 */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="⚡ Fast"
            className="bg-white/5 border border-white/10 h-full"
          >
            <p className="text-sm text-white/70 leading-relaxed">
              Automatic cycles reduce latency and eliminate manual edits. Payments happen when they're supposed to.
            </p>
          </Card>
        </div>

        {/* Feature 2 */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="🔒 Secure"
            className="bg-white/5 border border-white/10 h-full"
          >
            <p className="text-sm text-white/70 leading-relaxed">
              Flow's wallet-based auth and strong token primitives protect funds. Transactions are on-chain and verifiable.
            </p>
          </Card>
        </div>

        {/* Feature 3 */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="🧩 Composable"
            className="bg-white/5 border border-white/10 h-full"
          >
            <p className="text-sm text-white/70 leading-relaxed">
              Built with FCL, FlowToken, and Cadence contracts for extensible integration with other dApps.
            </p>
          </Card>
        </div>
      </div>

      {/* Vision Section */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12">
          <div className="rounded-xl bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Our Vision</h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              We believe recurring payments on blockchain should be as simple and reliable as traditional payment systems, 
              but with the transparency, security, and efficiency that only decentralized protocols can provide. FlowPay is 
              the foundation for a new generation of subscription-based services on Flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
