import { CreditCard, Zap, Calendar, Wallet, Play } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { Button, Badge } from '@/components/atoms'
import { IconLabel } from '@/components/molecules'

export function HeroSection({ onConnect }) {
  const { setHowItWorksOpen } = useUI()

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-4xl w-full mx-auto text-center">
        <Badge className="mb-6">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Subscription payments on Flow
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          FlowPay
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
          Create subscriptions, add wallet addresses, and let auto-payments run when each period ends. No manual chasing — just flow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="primary" onClick={onConnect} className="px-6 py-3">
            <Wallet className="w-5 h-5" />
            Connect Flow Wallet
          </Button>
          <Button variant="secondary" onClick={() => setHowItWorksOpen(true)} className="px-6 py-3">
            <Play className="w-5 h-5" />
            How it works
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-white/60">
          <IconLabel icon={CreditCard}>Seamless checkout</IconLabel>
          <IconLabel icon={Zap}>Low fees</IconLabel>
          <IconLabel icon={Calendar}>Scheduled payouts</IconLabel>
        </div>
      </div>
    </section>
  )
}
