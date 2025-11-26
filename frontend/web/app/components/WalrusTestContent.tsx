'use client';

import React, { useState } from 'react';
import { uploadToWalrus, downloadFromWalrus, getBlobInfo } from '@/app/lib/utils/walrus';
import { encryptWithSeal, decryptWithSeal } from '@/app/lib/utils/seal';

export default function WalrusTestContent() {
  const [testData, setTestData] = useState('Hello, Walrus!');
  const [blobId, setBlobId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [downloadedData, setDownloadedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useEncryption, setUseEncryption] = useState(true);

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      let blobToUpload: Blob;
      let key = '';

      if (useEncryption) {
        // 加密数据
        console.log('🔐 Encrypting data...');
        const result = await encryptWithSeal({ message: testData });
        blobToUpload = result.encryptedBlob;
        key = result.key;
        setEncryptionKey(key);
        console.log('✅ Encryption complete');
      } else {
        // 不加密
        blobToUpload = new Blob([testData], { type: 'text/plain' });
      }

      // 上传到 Walrus
      console.log('📤 Uploading to Walrus...');
      const uploadResult = await uploadToWalrus(blobToUpload, {
        type: 'test',
        encrypted: useEncryption,
      });

      setBlobId(uploadResult.blobId);
      console.log('✅ Upload successful!');
      console.log('Blob ID:', uploadResult.blobId);
      console.log('URL:', uploadResult.url);

      alert(`上传成功！\n\nBlob ID: ${uploadResult.blobId}\n${key ? `加密密钥: ${key.substring(0, 30)}...` : ''}`);
    } catch (error) {
      console.error('Upload failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`上传失败: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!blobId) {
      alert('请先输入 Blob ID');
      return;
    }

    setIsLoading(true);
    try {
      // 从 Walrus 下载
      console.log('📥 Downloading from Walrus...');
      const blob = await downloadFromWalrus(blobId);
      console.log('✅ Download complete');

      if (useEncryption && encryptionKey) {
        // 解密数据
        console.log('🔓 Decrypting data...');
        const decrypted = await decryptWithSeal<{ message: string }>(blob, encryptionKey);
        setDownloadedData(decrypted.message);
        console.log('✅ Decryption complete');
      } else {
        // 直接读取
        const text = await blob.text();
        setDownloadedData(text);
      }

      alert('下载成功！');
    } catch (error) {
      console.error('Download failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`下载失败: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetInfo = async () => {
    if (!blobId) {
      alert('请先输入 Blob ID');
      return;
    }

    setIsLoading(true);
    try {
      const info = await getBlobInfo(blobId);
      alert(
        `Blob 信息:\n\n` +
        `ID: ${info.blobId}\n` +
        `存在: ${info.exists}\n` +
        `大小: ${info.size} bytes\n` +
        `类型: ${info.contentType || 'N/A'}`
      );
    } catch (error) {
      console.error('Get info failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`获取信息失败: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Walrus 存储测试</h1>
        <p className="text-white/80">测试 Walrus 上传/下载和 Seal 加密/解密功能</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Encryption Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="useEncryption"
            checked={useEncryption}
            onChange={(e) => setUseEncryption(e.target.checked)}
            className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
          />
          <label htmlFor="useEncryption" className="text-lg font-medium text-gray-900">
            使用 Seal 加密
          </label>
        </div>

        {/* Test Data Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            测试数据
          </label>
          <textarea
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
            placeholder="输入要上传的测试数据"
          />
        </div>

        {/* Upload Button */}
        <div>
          <button
            onClick={handleUpload}
            disabled={isLoading || !testData}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '上传中...' : '📤 上传到 Walrus'}
          </button>
        </div>

        {/* Blob ID Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blob ID
          </label>
          <input
            type="text"
            value={blobId}
            onChange={(e) => setBlobId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
            placeholder="输入 Blob ID"
          />
        </div>

        {/* Encryption Key Input */}
        {useEncryption && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              加密密钥
            </label>
            <input
              type="text"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black font-mono text-sm"
              placeholder="加密密钥（自动生成或手动输入）"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleDownload}
            disabled={isLoading || !blobId}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '下载中...' : '📥 下载并解密'}
          </button>
          <button
            onClick={handleGetInfo}
            disabled={isLoading || !blobId}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '查询中...' : 'ℹ️  获取信息'}
          </button>
        </div>

        {/* Downloaded Data Display */}
        {downloadedData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              下载的数据
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black whitespace-pre-wrap">
              {downloadedData}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">使用说明：</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>勾选&quot;使用 Seal 加密&quot;可启用端到端加密</li>
            <li>输入测试数据，点击&quot;上传到 Walrus&quot;</li>
            <li>保存返回的 Blob ID 和加密密钥</li>
            <li>输入 Blob ID（和密钥），点击&quot;下载并解密&quot;</li>
            <li>查看下载的数据是否与原始数据一致</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
