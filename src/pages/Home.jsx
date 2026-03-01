import { useWallet } from '@/contexts/WalletContext'
import { shortAddress } from '@/utils/format'
import { Button } from '@/components/atoms'
import { Card } from '@/components/molecules'

export default function Home() {
  const { user } = useWallet()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-white/60">
          {user?.addr ? `Connected: ${shortAddress(user.addr)}` : 'Not connected'}
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

      <Card title="Recent Activity">
        <p className="text-sm text-white/60">
          No activity yet — try connecting and performing transactions on Flow testnet.
        </p>
      </Card>
    </div>
  )
}
