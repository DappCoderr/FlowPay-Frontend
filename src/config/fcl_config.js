import { config } from '@onflow/fcl';

export const configureFlow = () => {
  const commonConfig = {
    'app.detail.title': 'Flow Pay',
    'app.detail.icon': 'https://example.com/icon.png',
    'app.detail.description': 'Flow Pay',
    'discovery.authn.include': [],
  };

  const networkConfig = {
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'flow.network': 'testnet',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
    '0xFlowPay': '0xe0c7dc1075c0f1f9',
    '0xFlowPayScheduler': '0xe0c7dc1075c0f1f9',
    '0xFlowTransactionScheduler': '0x8c5303eaa26202d6',
    '0xFlowTransactionSchedulerUtils': '0x8c5303eaa26202d6',

    // Flow core contract standard
    '0xFlowToken': '0x7e60df042a9c0868',
    '0xFungibleToken': '0x9a0766d93b6608b7',
    '0xNonFungibleToken': '0x631e88ae7f1d7c20',
    '0xMetadataViews': '0x631e88ae7f1d7c20',
  };

  config({ ...commonConfig, ...networkConfig });
};

configureFlow();
