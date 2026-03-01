import { ArrowRight } from 'lucide-react'
import { useUI } from '@/contexts/UIContext'
import { Modal, StepItem } from '@/components/molecules'

const STEPS = [
  { step: 1, title: 'Create a subscription', description: 'Set amount, currency, and billing interval (e.g. monthly).' },
  { step: 2, title: 'Add recipient wallet address', description: 'Enter the Flow address that should receive each payment.' },
  { step: 3, title: 'Auto-payments when period ends', description: 'When the time period ends, FlowPay executes the payment to the end user automatically — no manual action needed.' },
]

export function HowItWorksModal() {
  const { howItWorksOpen, setHowItWorksOpen } = useUI()

  return (
    <Modal
      open={howItWorksOpen}
      onClose={() => setHowItWorksOpen(false)}
      title="How FlowPay works"
    >
      <div className="space-y-6">
        <ol className="space-y-4 list-none">
          {STEPS.map((s) => (
            <StepItem key={s.step} step={s.step} title={s.title} description={s.description} />
          ))}
        </ol>
        <div className="pt-2">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Built on Flow
          </h3>
          <p className="text-white/70 text-sm">
            FlowPay uses Flow&apos;s native capabilities for secure, programmable payments so you can focus on your product instead of payment logistics.
          </p>
        </div>
      </div>
    </Modal>
  )
}
