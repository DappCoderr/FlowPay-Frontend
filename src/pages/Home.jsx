import { useQuery } from '@tanstack/react-query'
import { useWallet } from '../contexts/WalletContext'

export default function Home() {
  const { user } = useWallet()

  const short = (addr = '') => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-600">{user && user.addr ? `Connected: ${short(user.addr)}` : 'Not connected'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Account</h2>
          <p className="text-sm text-gray-700">{user && user.addr ? user.addr : '—'}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Balance</h2>
          <p className="text-sm text-gray-700">Testnet balance: — FLOW</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-purple-600 text-white rounded-md">Send</button>
            <button className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md">Receive</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <p className="text-sm text-gray-600">No activity yet — try connecting and performing transactions on Flow testnet.</p>
      </div>
    </div>
  )
}
