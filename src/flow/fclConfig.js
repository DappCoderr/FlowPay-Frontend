import * as fcl from '@onflow/fcl'

// Configure FCL for Flow Testnet. Change to emulator or mainnet as needed.
fcl.config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')

export default fcl
