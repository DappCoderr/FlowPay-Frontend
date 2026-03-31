import { useState, useCallback, memo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/molecules';
import { Button, Input, Select } from '@/components/atoms';
import { useCreateAndScheduleStream, useGetFlowBalance } from '@/hooks';

const RECURRENCE_OPTIONS = [
  { value: '0', label: 'One-Time' },
  { value: '1', label: 'Weekly' },
  { value: '2', label: 'Monthly' },
];

function generateId() {
  return Math.random().toString(36).slice(2);
}

const RecipientRow = memo(function RecipientRow({
  recipient,
  canRemove,
  errors,
  onUpdate,
  onRemove,
}) {
  const { id, address, amount } = recipient;
  return (
    <div className="p-3 rounded-xl border border-white/20 bg-white/3 space-y-3 shrink-0 shadow-sm hover:shadow-md transition-all duration-200 hover:border-white/30\">
      <div className="flex gap-2">
        <Input
          placeholder="Recipient address (0x...)"
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
            aria-label="Remove recipient"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div>
        <Input
          type="number"
          placeholder="Amount (FLOW)"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => onUpdate(id, 'amount', e.target.value)}
          error={errors[`amount_${id}`]}
          className="text-sm"
        />
      </div>
    </div>
  );
});

/**
 * CreateStreamModal Component
 * Modal for creating a new payment stream
 * Uses useCreateAndScheduleStream hook for transaction
 */
export function CreateStreamModal({ open, onClose, userAddress }) {
  const [recipients, setRecipients] = useState([
    { id: generateId(), address: '', amount: '' },
  ]);
  const [delaySeconds, setDelaySeconds] = useState('0');
  const [recurrenceRaw, setRecurrenceRaw] = useState('0');
  const [totalRounds, setTotalRounds] = useState('1');
  const [errors, setErrors] = useState({});
  const [txStatus, setTxStatus] = useState(null);

  const { mutate: createStream, isPending } = useCreateAndScheduleStream();
  const { data: balance } = useGetFlowBalance(userAddress);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate recipients
    if (recipients.length === 0) {
      newErrors.recipients = 'At least one recipient required';
    }

    recipients.forEach((recipient) => {
      if (!recipient.address) {
        newErrors[`addr_${recipient.id}`] = 'Address required';
      } else if (!recipient.address.match(/^0x[a-fA-F0-9]{16}$/)) {
        newErrors[`addr_${recipient.id}`] = 'Invalid address format';
      }

      if (!recipient.amount || parseFloat(recipient.amount) <= 0) {
        newErrors[`amount_${recipient.id}`] = 'Amount must be positive';
      }
    });

    // Validate other fields
    if (!delaySeconds || parseFloat(delaySeconds) < 0) {
      newErrors.delaySeconds = 'Delay must be non-negative';
    }

    if (!totalRounds || parseInt(totalRounds) <= 0) {
      newErrors.totalRounds = 'Rounds must be at least 1';
    }

    if (recurrenceRaw === '0' && totalRounds !== '1') {
      newErrors.totalRounds = 'One-time streams must have 1 round';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [recipients, delaySeconds, recurrenceRaw, totalRounds]);

  const calculateEscrow = useCallback(() => {
    const totalAmount = recipients.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );
    const platformFee = totalAmount * 0.01;
    const cost = (totalAmount + platformFee) * parseInt(totalRounds);
    return cost;
  }, [recipients, totalRounds]);

  const handleAddRecipient = useCallback(() => {
    setRecipients([
      ...recipients,
      { id: generateId(), address: '', amount: '' },
    ]);
  }, [recipients]);

  const handleRemoveRecipient = useCallback(
    (id) => {
      setRecipients(recipients.filter((r) => r.id !== id));
    },
    [recipients]
  );

  const handleUpdateRecipient = useCallback(
    (id, field, value) => {
      setRecipients(
        recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    },
    [recipients]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const recipientAddresses = recipients.map((r) => r.address);
    const amounts = recipients.map((r) => parseFloat(r.amount).toFixed(2));

    createStream(
      {
        recipients: recipientAddresses,
        amounts,
        delaySeconds: parseFloat(delaySeconds).toFixed(2),
        recurrenceRaw: recurrenceRaw,
        totalRounds: totalRounds,
        onStatus: setTxStatus,
      },
      {
        onSuccess: () => {
          setTxStatus('success');
          setTimeout(() => {
            onClose();
            // Reset form
            setRecipients([{ id: generateId(), address: '', amount: '' }]);
            setDelaySeconds('0');
            setRecurrenceRaw('0');
            setTotalRounds('1');
            setTxStatus(null);
          }, 2000);
        },
        onError: (error) => {
          setTxStatus(null);
          setErrors({ submit: error.message });
        },
      }
    );
  };

  const escrowAmount = calculateEscrow();
  const hasInsufficientBalance = balance && parseFloat(balance) < escrowAmount;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Payment Stream"
      className="max-w-3xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-7 max-h-[70vh] overflow-y-auto pr-2"
      >
        {/* Recipients Section */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Payment Recipients
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
              {recipients.map((recipient) => (
                <RecipientRow
                  key={recipient.id}
                  recipient={recipient}
                  canRemove={recipients.length > 1}
                  errors={errors}
                  onUpdate={handleUpdateRecipient}
                  onRemove={handleRemoveRecipient}
                />
              ))}
            </div>
            {errors.recipients && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.recipients}</p>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddRecipient}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Recipient
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Payment Schedule */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Payment Schedule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Recurrence
              </label>
              <Select
                value={recurrenceRaw}
                onChange={(e) => setRecurrenceRaw(e.target.value)}
                className="text-sm"
              >
                {RECURRENCE_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-black text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Total Rounds
              </label>
              <Input
                type="number"
                min="1"
                value={totalRounds}
                onChange={(e) => setTotalRounds(e.target.value)}
                error={errors.totalRounds}
                className="text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Delay (seconds)
              </label>
              <Input
                type="number"
                min="0"
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(e.target.value)}
                error={errors.delaySeconds}
                className="text-sm"
                placeholder="0 for immediate"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Escrow Summary */}
        <div className="space-y-4 bg-white/3 rounded-xl p-4 border border-white/10 shadow-sm">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Per Round</p>
              <p className="text-lg font-bold text-white">
                {recipients
                  .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
                  .toFixed(2)}{' '}
                <span className="text-xs">FLOW</span>
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Fee (1%)</p>
              <p className="text-lg font-bold text-orange-400">
                {(
                  recipients.reduce(
                    (sum, r) => sum + (parseFloat(r.amount) || 0),
                    0
                  ) * 0.01
                ).toFixed(2)}{' '}
                FLOW
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400/70 text-sm mb-1">
                Total Escrow Required
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {escrowAmount.toFixed(2)} FLOW
              </p>
              {balance && (
                <p
                  className={`text-xs mt-1 ${hasInsufficientBalance ? 'text-red-400' : 'text-green-400'}`}
                >
                  {hasInsufficientBalance
                    ? `Insufficient balance. You have ${parseFloat(balance).toFixed(2)} FLOW`
                    : `Available: ${parseFloat(balance).toFixed(2)} FLOW`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
            {errors.submit}
          </div>
        )}
        {txStatus === 'preparing' && (
          <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm">
            Preparing transaction...
          </div>
        )}
        {txStatus === 'pending' && (
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 text-sm">
            Transaction pending...
          </div>
        )}
        {txStatus === 'success' && (
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400 text-sm">
            Stream created successfully!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 border-t border-white/10 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || hasInsufficientBalance}
            className="flex-1"
          >
            {isPending ? 'Creating...' : 'Create Stream'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateStreamModal;
