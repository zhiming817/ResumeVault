/**
 * Allowlist 工具函数
 */
import { SuiClient } from '@mysten/sui/client';

interface AllowlistInfo {
  allowlistId: string;
  capId: string;
  name: string;
}

/**
 * 获取用户的所有 Allowlist
 */
export async function fetchUserAllowlists(
  suiClient: SuiClient,
  ownerAddress: string
): Promise<AllowlistInfo[]> {
  try {
    // TODO: 实现实际的 Allowlist 获取逻辑
    // 这里需要根据实际的智能合约接口来实现
    console.log('Fetching allowlists for:', ownerAddress);
    
    // 临时返回空数组，实际实现需要查询链上数据
    return [];
  } catch (error) {
    console.error('Error fetching allowlists:', error);
    return [];
  }
}
