import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { shortAddress } from '@/utils/format'
import { Button } from '@/components/atoms'
import { Card } from '@/components/molecules'
import { CreateSubscriptionModal } from '@/components/organisms'
import { Plus } from 'lucide-react'
import {
  getAllSchedulesForUser,
  getFlowPayStats,
  pauseFlowPaySchedule,
  resumeFlowPaySchedule,
  cancelFlowPaySchedule,
  topUpFlowPaySchedule,
} from '@/flow/flowpay'

export default function Home() {
  const { user, isSettingUp, setupError } = useWallet()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('nextPayoutAsc')
  const address = user?.addr

  const loadData = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const [allSchedules, contractStats] = await Promise.all([
        getAllSchedulesForUser(address),
        getFlowPayStats(),
      ])
      setSchedules(allSchedules ?? [])
      setStats(contractStats ?? null)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load FlowPay data', err)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateSubscription = useCallback(() => {
    // The modal will handle submitting the transaction via FCL.
    // After it closes, reload on-chain data. If an optimistic schedule is
    // supplied, insert it into state immediately for responsive UI.
    return async (optimistic) => {
      if (optimistic) {
        setSchedules((prev) => [optimistic, ...(prev ?? [])])
      }
      await loadData()
    }
  }, [loadData])

  const handlePause = useCallback(
    async (id) => {
      setTxStatus('Pausing schedule...')
      try {
        await pauseFlowPaySchedule(id)
        await loadData()
      } finally {
        setTxStatus(null)
      }
    },
    [loadData]
  )

  const handleResume = useCallback(
    async (id) => {
      setTxStatus('Resuming schedule...')
      try {
        await resumeFlowPaySchedule(id)
        await loadData()
      } finally {
        setTxStatus(null)
      }
    },
    [loadData]
  )

  const handleCancel = useCallback(
    async (id) => {
      setTxStatus('Cancelling schedule...')
      try {
        await cancelFlowPaySchedule(id)
        await loadData()
      } finally {
        setTxStatus(null)
      }
    },
    [loadData]
  )

  const handleTopUp = useCallback(
    async (id) => {
      const amount = window.prompt('Enter top-up amount (UFix64, e.g. 10.0)')
      if (!amount) return
      setTxStatus('Topping up schedule...')
      try {
        // Pass string like '10.0' directly; helper expects UFix64 literal.
        await topUpFlowPaySchedule(id, amount)
        await loadData()
      } finally {
        setTxStatus(null)
      }
    },
    [loadData]
  )

  const filteredSchedules = useMemo(() => {
    const all = schedules ?? []

    const byStatus = all.filter((sub) => {
      if (statusFilter === 'all') return true
      const status = String(sub.status ?? '').toLowerCase()
      if (statusFilter === 'active') return status === 'active' || status === 'pending'
      return status === statusFilter
    })

    const sorted = [...byStatus].sort((a, b) => {
      const aTime = Number(new Date(a.nextPayoutTime).getTime() || 0)
      const bTime = Number(new Date(b.nextPayoutTime).getTime() || 0)

      if (sortOrder === 'nextPayoutAsc') return aTime - bTime
      if (sortOrder === 'nextPayoutDesc') return bTime - aTime
      if (sortOrder === 'createdAsc') return (a.id ?? 0) - (b.id ?? 0)
      if (sortOrder === 'createdDesc') return (b.id ?? 0) - (a.id ?? 0)
      return 0
    })

    return sorted
  }, [schedules, statusFilter, sortOrder])

  const hasSchedules = filteredSchedules.length > 0

  const statusLabel = useCallback((status) => {
    // FlowPay.Status values map to UInt8; scripts return a rich struct
    if (typeof status === 'string') return status
    return String(status)
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
            disabled={!address || isSettingUp}
          >
            <Plus className="w-4 h-4" />
            {isSettingUp ? 'Setting up FlowPay…' : 'Create subscription'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Account">
          <p className="text-sm text-white/70 font-mono break-all">{user?.addr ?? '—'}</p>
        </Card>
        <Card title="Flows & stats">
          <p className="text-sm text-white/70">
            Total schedules: {stats?.totalSchedulesCreated ?? '—'}
          </p>
          <p className="text-sm text-white/70">
            Total payouts executed: {stats?.totalPayoutsExecuted ?? '—'}
          </p>
        </Card>
        <Card title="Quick Actions">
          <div className="flex gap-2">
            <Button variant="primary" className="px-3 py-2 text-sm">Send</Button>
            <Button variant="ghost" className="px-3 py-2 text-sm">Receive</Button>
          </div>
        </Card>
      </div>

      <Card title="Filter & sort">
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="block text-xs text-white/60">Status</label>
            <select
              className="bg-black/25 border border-white/10 rounded px-2 py-1 text-sm text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60">Sort by</label>
            <select
              className="bg-black/25 border border-white/10 rounded px-2 py-1 text-sm text-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="nextPayoutAsc">Next payout ↑</option>
              <option value="nextPayoutDesc">Next payout ↓</option>
              <option value="createdAsc">Created ↑</option>
              <option value="createdDesc">Created ↓</option>
            </select>
          </div>
        </div>
      </Card>

      {setupError && (
        <Card title="Setup error">
          <p className="text-sm text-red-400">
            FlowPay account setup failed: {setupError}. You may need a FlowToken vault and storage
            before using FlowPay.
          </p>
        </Card>
      )}

      <Card title="Your subscriptions">
        {loading ? (
          <p className="text-sm text-white/60">Loading schedules from chain…</p>
        ) : !hasSchedules ? (
          <p className="text-sm text-white/60">
            No subscriptions match the selected filters.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredSchedules.map((sub) => (
              <li
                key={sub.id}
                className="p-3 rounded-lg border border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <span className="font-medium text-white">
                    {sub.label || `Schedule #${sub.id}`}
                  </span>
                  <span className="text-white/60 ml-2">
                    {sub.totalPerPayout ?? sub.amountPerPayout} FLOW total per payout ·{' '}
                    {(sub.recipients ?? []).length || 1} recipient(s) ·{' '}
                    {sub.completedPayouts}/{sub.totalPayouts} payouts
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-white/50">
                    Status: {statusLabel(sub.status)} · Next at {sub.nextPayoutTime}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => handlePause(sub.id)}
                    >
                      Pause
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => handleResume(sub.id)}
                    >
                      Resume
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => handleTopUp(sub.id)}
                    >
                      Top up
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs text-red-400"
                      onClick={() => handleCancel(sub.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent Activity">
        <p className="text-sm text-white/60">
          {txStatus || 'No activity yet — create or manage a subscription to see updates.'}
        </p>
      </Card>

      <CreateSubscriptionModal
        open={createModalOpen}
        onClose={closeCreateModal}
        onCreate={handleCreateSubscription()}
      />
    </div>
  )
}
