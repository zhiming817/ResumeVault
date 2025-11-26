/**
 * Walrus 去中心化存储集成
 * 使用 @mysten/walrus TypeScript SDK
 * 参考: https://sdk.mystenlabs.com/walrus
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { walrus } from '@mysten/walrus';

// Walrus 客户端实例
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let walrusClient: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let initPromise: Promise<any> | null = null;

/**
 * Walrus 上传结果
 */
export interface WalrusUploadResult {
  blobId: string;
  info: unknown;
  url: string;
}

/**
 * Walrus Blob 信息
 */
export interface WalrusBlobInfo {
  exists: boolean;
  blobId: string;
  size: string | null;
  contentType: string | null;
}

/**
 * 初始化 Walrus 客户端
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function initWalrusClient(): Promise<any> {
  if (walrusClient) {
    return walrusClient;
  }
  
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = (async () => {
    try {
      console.log('🔧 Initializing Walrus client...');
      
      // 获取网络配置 (testnet 或 mainnet)
      const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet';
      
      const suiClient = new SuiClient({
        url: getFullnodeUrl(network),
      });
      
      // 使用 network 参数初始化 Walrus 扩展
      const client = suiClient.$extend(walrus({
        network,
      }));
      
      walrusClient = client;
      
      console.log(`✅ Walrus client initialized for ${network}`);
      
      return client;
    } catch (error) {
      console.error('❌ Failed to initialize Walrus client:', error);
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

/**
 * 获取 Walrus 客户端
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getWalrusClient(): Promise<any> {
  return await initWalrusClient();
}

/**
 * 上传数据到 Walrus
 * @param blob - 要上传的数据
 * @param metadata - 元数据
 * @param signer - 可选的签名者（用于 SDK writeBlob）
 * @returns 上传结果 { blobId, info, url }
 */
export async function uploadToWalrus(
  blob: Blob,
  metadata: Record<string, unknown> = {},
  signer?: unknown
): Promise<WalrusUploadResult> {
  try {
    console.log('📤 Uploading to Walrus...');
    console.log('📦 Size:', blob.size, 'bytes');
    console.log('📋 Metadata:', metadata);

    const client = await getWalrusClient();

    // 将 Blob 转换为 Uint8Array
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const epochs = process.env.NEXT_PUBLIC_WALRUS_EPOCHS
      ? Number(process.env.NEXT_PUBLIC_WALRUS_EPOCHS)
      : 5;

    // 如果传入 signer，优先使用 SDK 的 writeBlob（需要 signer）
    if (signer) {
      try {
        console.log('⬆️  Uploading via Walrus SDK (writeBlob) with signer...');
        const result = await client.walrus.writeBlob({
          blob: uint8Array,
          deletable: false,
          epochs,
          signer,
        });

        console.log('✅ Upload successful (SDK)!');
        console.log('🆔 Blob ID:', result.blobId);

        const aggregatorUrl = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR ||
          'https://aggregator.walrus-testnet.walrus.space';

        return {
          blobId: result.blobId,
          info: result.blobObject,
          url: `${aggregatorUrl}/v1/${result.blobId}`,
        };
      } catch (err) {
        console.warn('Walrus SDK writeBlob failed, falling back to publisher HTTP:', err);
        // fallthrough to HTTP publisher below
      }
    }

    // Fallback: 使用 HTTP Publisher API（适用于不提供 signer 的情况）
    console.log('⬆️  Uploading via Publisher HTTP (fallback)...');
    const publisherUrl = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER ||
      'https://publisher.walrus-testnet.walrus.space';

    const response = await fetch(`${publisherUrl}/v1/store?epochs=${epochs}`, {
      method: 'PUT',
      body: uint8Array,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Walrus upload failed: ${response.status} ${errorText}`);
    }

    const result = await response.json() as {
      newlyCreated?: { blobObject?: { blobId: string } };
      alreadyCertified?: { blobId: string };
    };
    
    console.log('✅ Upload result (publisher):', result);

    // 提取 blobId
    const blobId = result.newlyCreated?.blobObject?.blobId ||
      result.alreadyCertified?.blobId;

    if (!blobId) {
      throw new Error('No blob ID returned from Walrus');
    }

    console.log('✅ Upload successful (publisher)!');
    console.log('🆔 Blob ID:', blobId);

    const aggregatorUrl = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR ||
      'https://aggregator.walrus-testnet.walrus.space';

    return {
      blobId,
      info: result,
      url: `${aggregatorUrl}/v1/${blobId}`,
    };
  } catch (error) {
    console.error('❌ Upload to Walrus failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Walrus upload failed: ${message}`);
  }
}

/**
 * 从 Walrus 下载数据
 * @param blobId - Blob ID
 * @returns 下载的数据
 */
export async function downloadFromWalrus(blobId: string): Promise<Blob> {
  try {
    console.log('📥 Downloading from Walrus...');
    console.log('🆔 Blob ID:', blobId);
    
    const client = await getWalrusClient();
    
    console.log('⬇️  Downloading blob from Walrus storage nodes...');
    
    // 使用 Walrus SDK 的 readBlob 方法
    const uint8Array = await client.walrus.readBlob({ blobId });
    
    console.log('✅ Download successful!');
    console.log('📦 Size:', uint8Array.length, 'bytes');
    
    // 转换为 Blob
    const blob = new Blob([uint8Array]);
    
    return blob;
  } catch (error) {
    console.error('❌ Download from Walrus failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Walrus download failed: ${message}`);
  }
}

/**
 * 检查 Blob 状态
 * @param blobId - Blob ID
 * @returns Blob 信息
 */
export async function getBlobInfo(blobId: string): Promise<WalrusBlobInfo> {
  try {
    console.log('ℹ️  Getting blob info...');
    console.log('🆔 Blob ID:', blobId);
    
    const aggregatorUrl = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR || 
      'https://aggregator.walrus-testnet.walrus.space';
    
    const response = await fetch(`${aggregatorUrl}/v1/${blobId}`, {
      method: 'HEAD',
    });
    
    if (!response.ok) {
      throw new Error(`Get blob info failed: ${response.status}`);
    }
    
    return {
      exists: true,
      blobId,
      size: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
    };
  } catch (error) {
    console.error('❌ Get blob info failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Get blob info failed: ${message}`);
  }
}

/**
 * 从 Walrus 下载数据（使用 HTTP Aggregator）
 * 备用方法，直接通过 HTTP 下载
 * @param blobId - Blob ID
 * @returns 下载的数据
 */
export async function downloadFromWalrusHttp(blobId: string): Promise<Blob> {
  try {
    console.log('📥 Downloading from Walrus (HTTP)...');
    console.log('🆔 Blob ID:', blobId);
    
    const aggregatorUrl = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR || 
      'https://aggregator.walrus-testnet.walrus.space';
    
    const response = await fetch(`${aggregatorUrl}/v1/${blobId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP download failed: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    console.log('✅ Download successful (HTTP)!');
    console.log('📦 Size:', blob.size, 'bytes');
    
    return blob;
  } catch (error) {
    console.error('❌ Download from Walrus (HTTP) failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Walrus HTTP download failed: ${message}`);
  }
}
