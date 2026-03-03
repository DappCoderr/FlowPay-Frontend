import { useState, useCallback, memo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/molecules'
import { Button, Input, Select } from '@/components/atoms'
import { createFlowPaySchedule } from '@/flow/flowpay'

const CURRENCIES = [{ value: 'FLOW', label: 'FLOW' }]
const DISTRIBUTION_TYPES = [
  { value: 'equal', label: 'Equal split' },
  { value: 'percentage', label: 'Percentage' },
]
const RECURRENCE_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

function generateId() {
  return Math.random().toString(36).slice(2)
}

const RecipientRow = memo(function RecipientRow({
  recipient,
  canRemove,
  errors,
  onUpdate,
  onRemove,
}) {
  const { id, address, shareType, percentage } = recipient
  return (
    <div className="p-3 rounded-lg border border-white/20 bg-white/5 space-y-2 shrink-0">
      <div className="flex gap-2">
        <Input
          placeholder="Flow address (0x...)"
          value={address}
          onChange={(e) => onUpdate(id, 'address', e.target.value)}
          error={errors[`addr_${id}`]}
          className="flex-1 text-sm"
        />
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 shrink-0"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex gap-2 items-end">
        <Select
          value={shareType}
          onChange={(e) => onUpdate(id, 'shareType', e.target.value)}
          className="flex-1 text-sm py-1.5"
        >
          {DISTRIBUTION_TYPES.map((d) => (
            <option key={d.value} value={d.value} className="bg-black text-white">
              {d.label}
            </option>
          ))}
        </Select>
        {shareType === 'percentage' && (
          <div className="w-20 shrink-0">
            <Input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="%"
              value={percentage ?? ''}
              onChange={(e) => onUpdate(id, 'percentage', e.target.value)}
              error={errors[`pct_${id}`]}
              className="text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
})

export function CreateSubscriptionModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('FLOW')
  const [recipients, setRecipients] = useState([
    { id: generateId(), address: '', shareType: 'equal', percentage: null },
  ])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [recurrence, setRecurrence] = useState('once')
  const [errors, setErrors] = useState({})
  const [txLifecycle, setTxLifecycle] = useState(null)
  const [txError, setTxError] = useState(null)

  const addRecipient = useCallback(() => {
    setRecipients((prev) => [
      ...prev,
      { id: generateId(), address: '', shareType: 'equal', percentage: null },
    ])
  }, [])

  const removeRecipient = useCallback((id) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const updateRecipient = useCallback((id, field, value) => {
    setRecipients((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: value,
              ...(field === 'shareType' && value === 'equal' ? { percentage: null } : {}),
            }
          : r
      )
    )
  }, [])

  const totalPercentage = recipients
    .filter((r) => r.shareType === 'percentage' && r.percentage != null)
    .reduce((sum, r) => sum + Number(r.percentage) || 0, 0)

  const isValid = () => {
    const e = {}
    if (!amount || Number(amount) <= 0) e.amount = 'Enter a valid amount'
    if (recipients.length === 0) e.recipients = 'Add at least one recipient'
    recipients.forEach((r, i) => {
      if (!r.address?.trim()) e[`addr_${r.id}`] = 'Address required'
      if (r.shareType === 'percentage' && (r.percentage == null || Number(r.percentage) <= 0)) {
        e[`pct_${r.id}`] = 'Enter percentage'
      }
    })
    if (recipients.some((r) => r.shareType === 'percentage') && totalPercentage !== 100) {
      e.percentageTotal = 'Percentages must add up to 100%'
    }
    if (!scheduledDate) e.scheduledDate = 'Pick a date'
    if (!scheduledTime) e.scheduledTime = 'Pick a time'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid()) return

    const primaryRecipients = recipients.filter((r) => r.address.trim())
    const total = Number(amount)

    // Compute amount per recipient: equal split or percentage of total
    const recipientsWithAmounts = primaryRecipients.map((r) => {
      let amt
      if (r.shareType === 'percentage' && r.percentage != null) {
        amt = (total * Number(r.percentage)) / 100
      } else {
        amt = total / primaryRecipients.length
      }
      return { address: r.address.trim(), amount: amt }
    })

    if (recipientsWithAmounts.length === 0) return

    // Derive delayFirstPayout from selected date/time relative to now
    const now = new Date()
    const target = new Date(`${scheduledDate}T${scheduledTime}:00Z`)
    const delaySeconds = Math.max(0, (target.getTime() - now.getTime()) / 1000)

    // Map recurrence to intervalSeconds and totalPayouts
    let intervalSeconds = '0.0'
    let totalPayouts = 1
    if (recurrence === 'weekly') {
      intervalSeconds = '604800.0'
      totalPayouts = 12
    } else if (recurrence === 'monthly') {
      intervalSeconds = '2629800.0'
      totalPayouts = 12
    }

    try {
      await createFlowPaySchedule({
        recipients: recipientsWithAmounts.map((r) => ({
          address: r.address,
          amount: r.amount.toFixed(2),
        })),
        intervalSeconds,
        totalPayouts,
        label: name || 'FlowPay subscription',
        delayFirstPayout: delaySeconds.toFixed(2),
      }, (status) => {
        setTxLifecycle(status)
        if (status === 'submitting') {
          const optimistic = {
            id: `pending-${Date.now()}`,
            label: name || `Subscription (pending)`,
            totalPerPayout: recipientsWithAmounts.reduce((s, r) => s + r.amount, 0),
            recipients: recipientsWithAmounts,
            completedPayouts: 0,
            totalPayouts,
            status: 'pending',
            nextPayoutTime: new Date(Date.now() + delaySeconds * 1000).toISOString(),
          }
          try {
            onCreate?.(optimistic)
          } catch (e) {
            // ignore if parent doesn't accept optimistic param
          }
        }
      })
      setTxError(null)
      onClose()
      resetForm()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create FlowPay schedule', err)
      setTxError(err instanceof Error ? err.message : String(err))
      setTxLifecycle(null)
    }
  }

  const resetForm = () => {
    setName('')
    setAmount('')
    setCurrency('FLOW')
    setRecipients([{ id: generateId(), address: '', shareType: 'equal', percentage: null }])
    setScheduledDate('')
    setScheduledTime('12:00')
    setRecurrence('once')
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const minDate = new Date().toISOString().slice(0, 10)

  return (
    <Modal open={open} onClose={handleClose} title="Create subscription">
      <form onSubmit={handleSubmit} className="space-y-6">
        {txLifecycle && (
          <div className="p-3 mb-2 rounded bg-white/5 border border-white/10 text-sm">
            <strong className="capitalize">Status:</strong> {txLifecycle}
            {txError && <div className="text-red-400 mt-1">{txError}</div>}
          </div>
        )}
        <Input
          label="Subscription name (optional)"
          placeholder="e.g. Team payouts"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total amount"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />
          <Select
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-black text-white">
                {c.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white/80">Recipients & distribution</label>
            <Button type="button" variant="secondary" className="text-sm px-2 py-1" onClick={addRecipient}>
              <Plus className="w-4 h-4" />
              Add recipient
            </Button>
          </div>
          {errors.percentageTotal && (
            <p className="text-xs text-red-400 mb-2">{errors.percentageTotal}</p>
          )}
          <div
            className="space-y-3 max-h-52 overflow-y-auto overflow-x-hidden overscroll-contain"
            style={{ contain: 'layout paint' }}
          >
            {recipients.map((r) => (
              <RecipientRow
                key={r.id}
                recipient={r}
                canRemove={recipients.length > 1}
                errors={errors}
                onUpdate={updateRecipient}
                onRemove={removeRecipient}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Send date"
            type="date"
            min={minDate}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            error={errors.scheduledDate}
          />
          <Input
            label="Send time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            error={errors.scheduledTime}
          />
        </div>

        <Select
          label="Frequency"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        >
          {RECURRENCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-black text-white">
              {o.label}
            </option>
          ))}
        </Select>

          <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={!!txLifecycle && txLifecycle !== 'sealed'}>
            {txLifecycle === 'preparing' && 'Preparing…'}
            {txLifecycle === 'submitting' && 'Submitting…'}
            {txLifecycle === 'pending' && 'Pending…'}
            {!txLifecycle && 'Create subscription'}
            {txLifecycle === 'sealed' && 'Sealed'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
