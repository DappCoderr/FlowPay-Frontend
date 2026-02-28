import React from 'react'
import { useWallet } from '../contexts/WalletContext'
import { CreditCard, Zap } from 'lucide-react'

export default function Landing() {
  const { login } = useWallet()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <div className="max-w-5xl w-full mx-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="p-8 bg-white/10 rounded-2xl backdrop-blur-md shadow-lg">
          <h1 className="text-5xl font-extrabold mb-4">FlowPay</h1>
          <p className="text-lg mb-6 text-white/90">Fast, secure payments on Flow — connect your wallet and start sending micro-payments in seconds.</p>

          <div className="flex gap-3 items-center mb-6">
            <div className="flex items-center gap-2 bg-white/8 px-3 py-2 rounded-md">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-sm">Seamless Checkout</span>
            </div>
            <div className="flex items-center gap-2 bg-white/8 px-3 py-2 rounded-md">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-sm">Low Fees</span>
            </div>
          </div>

          <button
            onClick={login}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow hover:scale-105 transform transition"
          >
            <span>Connect Flow Wallet</span>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="p-8 bg-white/10 rounded-2xl backdrop-blur-md shadow-lg flex flex-col items-center justify-center">
          <div className="w-56 h-56 rounded-xl bg-white/20 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Ready to flow?</h2>
              <p className="mt-2 text-sm text-white/90">Connect and view your account, balances, and history.</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-white/80">Powered by Flow · Testnet</p>
        </div>
      </div>
    </div>
  )
}
