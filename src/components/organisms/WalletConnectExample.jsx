import { useAuth } from '@/hooks';

export function WalletConnectExample() {
  const {
    isConnected,
    userAddress,
    balance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useAuth();

  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Wallet Status</h2>

      {/* Connection Status */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Status:</p>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-white font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* User Address */}
      {isConnected && userAddress && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Address:</p>
          <p className="text-white font-mono bg-gray-800 p-3 rounded break-all">
            {userAddress}
          </p>
        </div>
      )}

      {/* Balance */}
      {isConnected && balance !== null && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">FLOW Balance:</p>
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
            <span className="text-white text-lg font-semibold">
              {balance} FLOW
            </span>
            <button
              onClick={refreshBalance}
              disabled={isLoading}
              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded transition"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium rounded transition"
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect Wallet'}
          </button>
        )}
      </div>
    </div>
  );
}

export default WalletConnectExample;
