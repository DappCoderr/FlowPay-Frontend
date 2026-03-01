import * as fcl from '@onflow/fcl'

// Configure FCL for Flow Testnet. For production, use env vars to avoid committing secrets:
// .put('accessNode.api', import.meta.env.VITE_FLOW_ACCESS_NODE ?? 'https://rest-testnet.onflow.org')
fcl.config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')

export default fcl
