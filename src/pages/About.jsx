export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About FlowPay</h1>
      <p className="text-gray-700">FlowPay is a demo payments UI built on the Flow blockchain. It demonstrates wallet connection, basic account UI, and routing in a React + Vite app.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Fast</h3>
          <p className="text-sm text-gray-600">Optimized for quick micro-payments on Flow.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Secure</h3>
          <p className="text-sm text-gray-600">Wallet-based authentication keeps private keys on the client.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold">Open</h3>
          <p className="text-sm text-gray-600">Built with open Flow tooling and FCL for interoperability.</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">This project is intended as a starting point — extend it with real transaction flows, balance queries, and richer UX.</p>
    </div>
  )
}
