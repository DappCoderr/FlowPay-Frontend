import { useCallback, useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { shortAddress } from '@/utils/format'
import { Button } from '@/components/atoms'
import { Card } from '@/components/molecules'
import { CreateSubscriptionModal } from '@/components/organisms'
import { Plus } from 'lucide-react'

export default function Home() {
  const { user } = useWallet()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])

  const handleCreateSubscription = useCallback((payload) => {
    setSubscriptions((prev) => [...prev, { id: Date.now(), ...payload }])
  }, [])

  const openCreateModal = useCallback(() => setCreateModalOpen(true), [])
  const closeCreateModal = useCallback(() => setCreateModalOpen(false), [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">
            {user?.addr ? `Connected: ${shortAddress(user.addr)}` : 'Not connected'}
          </span>
          <Button
            variant="primary"
            className="text-sm px-4 py-2"
            onClick={openCreateModal}
          >
            <Plus className="w-4 h-4" />
            Create subscription
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Account">
          <p className="text-sm text-white/70 font-mono break-all">{user?.addr ?? '—'}</p>
        </Card>
        <Card title="Balance">
          <p className="text-sm text-white/70">Testnet balance: — FLOW</p>
        </Card>
        <Card title="Quick Actions">
          <div className="flex gap-2">
            <Button variant="primary" className="px-3 py-2 text-sm">Send</Button>
            <Button variant="ghost" className="px-3 py-2 text-sm">Receive</Button>
          </div>
        </Card>
      </div>

      <Card title="Your subscriptions">
        {subscriptions.length === 0 ? (
          <p className="text-sm text-white/60">
            No subscriptions yet. Create one to schedule payments to multiple addresses with equal or percentage-based distribution.
          </p>
        ) : (
          <ul className="space-y-3">
            {subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="p-3 rounded-lg border border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <span className="font-medium text-white">
                    {sub.name || `Subscription #${sub.id}`}
                  </span>
                  <span className="text-white/60 ml-2">
                    {sub.amount} {sub.currency} · {sub.recipients?.length} recipient(s)
                  </span>
                </div>
                <span className="text-xs text-white/50">
                  {sub.recurrence === 'once' ? 'Once' : sub.recurrence} · {sub.scheduledAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent Activity">
        <p className="text-sm text-white/60">
          No activity yet — try connecting and performing transactions on Flow testnet.
        </p>
      </Card>

      <CreateSubscriptionModal
        open={createModalOpen}
        onClose={closeCreateModal}
        onCreate={handleCreateSubscription}
      />
    </div>
  )
}
