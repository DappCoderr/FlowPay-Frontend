import { useState } from 'react';
import { Modal } from '@/components/molecules';
import { Button, Input } from '@/components/atoms';
import { send_flow_tokens } from '../../../flow/send_flow_tokens.txn';

export function SendFlowModal({ open, onClose, userAddress, balance }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [txLifecycle, setTxLifecycle] = useState(null);
  const [txError, setTxError] = useState(null);

  const isValid = () => {
    const e = {};
    if (!recipient?.trim()) e.recipient = 'Recipient address required';
    if (!amount || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (balance && Number(amount) > Number(balance))
      e.amount = 'Insufficient balance';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      setTxLifecycle('preparing');
      await send_flow_tokens(recipient.trim(), amount);
      setTxError(null);
      onClose();
      resetForm();
    } catch (err) {
      console.error('Failed to send FLOW', err);
      setTxError(err instanceof Error ? err.message : String(err));
      setTxLifecycle(null);
    }
  };

  const resetForm = () => {
    setRecipient('');
    setAmount('');
    setErrors({});
    setTxLifecycle(null);
    setTxError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const maxAmount = balance ? Math.floor(Number(balance) * 100) / 100 : 0;

  return (
    <Modal open={open} onClose={handleClose} title="Send FLOW">
      <form onSubmit={handleSubmit} className="space-y-6">
        {txLifecycle && (
          <div className="p-3 mb-2 rounded bg-white/5 border border-white/10 text-sm">
            <strong className="capitalize">Status:</strong> {txLifecycle}
            {txError && <div className="text-red-400 mt-1">{txError}</div>}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white/80">From</label>
            <span className="text-xs text-white/60">
              Balance: {balance ? `${balance} FLOW` : '—'}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-white/20 bg-white/5">
            <p className="text-sm font-mono break-all text-white/70">
              {userAddress}
            </p>
          </div>
        </div>

        <Input
          label="Recipient address"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          error={errors.recipient}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white/80">
              Amount (FLOW)
            </label>
            <button
              type="button"
              onClick={() => setAmount(maxAmount.toString())}
              className="text-xs text-blue-400 hover:text-blue-300"
              disabled={!balance}
            >
              Max
            </button>
          </div>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!!txLifecycle && txLifecycle !== 'sealed'}
          >
            {txLifecycle === 'preparing' && 'Sending…'}
            {!txLifecycle && 'Send FLOW'}
            {txLifecycle === 'sealed' && 'Sent'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
