import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { Modal } from '@/components/molecules'
import { Button } from '@/components/atoms'

export function ReceiveFlowModal({ open, onClose, userAddress }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!userAddress) return

    try {
      await navigator.clipboard.writeText(userAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = userAddress
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [userAddress])

  return (
    <Modal open={open} onClose={onClose} title="Receive FLOW">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-white/70 mb-4">
            Share this address to receive FLOW tokens
          </p>

          <div className="p-4 rounded-lg border border-white/20 bg-white/5">
            <p className="text-sm font-mono break-all text-white mb-4">{userAddress}</p>

            <Button
              variant="secondary"
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Address
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-white/60 space-y-2">
          <p>• Only send FLOW tokens to this address</p>
          <p>• Sending other tokens may result in permanent loss</p>
          <p>• Double-check the address before sending</p>
        </div>

        <div className="flex justify-center pt-2">
          <Button variant="primary" onClick={onClose} className="px-6">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}