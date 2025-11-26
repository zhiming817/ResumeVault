/**
 * 订阅模式配置
 */

// USDC 合约配置
export const USDC_CONFIG = {
  // Sui Testnet USDC 地址
  PACKAGE_ID: '0x2', // 根据实际情况替换
  COIN_TYPE: '0x2::sui::SUI', // 使用 SUI 代币作为支付
  DECIMALS: 9, // SUI 的小数位
} as const;

/**
 * 将 USDC 金额转换为微单位
 * @param amount - USDC 金额 (如 5.00)
 * @returns 微单位金额
 */
export function usdcToMicroUnits(amount: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, USDC_CONFIG.DECIMALS)));
}

/**
 * 将微单位转换为 USDC 金额
 * @param microUnits - 微单位金额
 * @returns USDC 金额
 */
export function microUnitsToUsdc(microUnits: bigint): number {
  return Number(microUnits) / Math.pow(10, USDC_CONFIG.DECIMALS);
}
