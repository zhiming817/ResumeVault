/**
 * Sui 网络配置
 */
export const SUI_NETWORK_CONFIG = {
  NETWORK: 'testnet',
  COMMITMENT: 'confirmed'
} as const;

export const NETWORK_CONFIG = {
  testnet: { url: 'https://fullnode.testnet.sui.io' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io' },
} as const;
