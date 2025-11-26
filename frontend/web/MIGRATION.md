# ResumeVault - Next.js Migration

这是从 demo 目录的 Vite + React 项目迁移到 Next.js + React 的简历管理系统。

## 已完成的工作

### 1. 基础架构搭建 ✅

#### 依赖安装
- 安装了 Sui 生态：`@mysten/dapp-kit`, `@mysten/sui`, `@mysten/walrus`, `@mysten/seal`
- 安装了 MUI 组件库：`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`
- 安装了其他工具库：`dayjs`, `html2canvas`, `jspdf`, `react-datepicker`, `bn.js`, `bs58`, `pinata`

#### Providers 配置
- 更新了 `app/rootProvider.tsx`，集成：
  - SuiClientProvider (Sui 区块链连接)
  - WalletProvider (钱包连接)
  - QueryClientProvider (React Query)
  - ThemeProvider (MUI 主题)
  - OnchainKitProvider (保留原有功能)

### 2. 配置文件 ✅

创建了以下配置文件在 `app/lib/config/` 目录：

- **sui.config.ts**: Sui 网络配置
- **api.config.ts**: API 端点配置
- **subscription.config.ts**: 订阅模式和 USDC 配置

### 3. 服务层 ✅

创建了服务文件在 `app/lib/services/` 目录：

- **http.client.ts**: HTTP 请求封装，支持 GET/POST/PUT/DELETE

### 4. 类型定义 ✅

创建了类型定义在 `app/lib/types/` 目录：

- **resume.types.ts**: 简历相关的所有 TypeScript 类型
  - PersonalInfo, DesiredPosition, WorkExperience, etc.
  - ResumeData, ResumeFormData, ResumeSummary, ResumeDetail

### 5. 布局组件 ✅

创建了布局组件在 `app/components/layout/` 目录：

- **Navbar.tsx**: 导航栏组件
  - 支持 Sui 钱包连接
  - 响应式设计（移动端菜单）
  - 路由高亮显示
  
- **Footer.tsx**: 页脚组件
  - 品牌信息
  - 快速链接
  - 社交媒体和资源链接

- **PageLayout.tsx**: 页面布局包装器
  - 自动添加背景和遮罩
  - 集成 Navbar 和 Footer

### 6. 页面路由 ✅

创建了页面在 `app/resume/` 目录：

- **page.tsx**: 首页 (Home)
  - 动画背景
  - Hero 区块
  - CTA 按钮

### 7. 样式优化 ✅

- 更新了 `app/globals.css`，添加：
  - 背景动画 `@keyframes pan`
  - Tailwind CSS 自定义样式

## 项目结构

```
app/
├── lib/
│   ├── config/
│   │   ├── sui.config.ts
│   │   ├── api.config.ts
│   │   ├── subscription.config.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── http.client.ts
│   │   └── index.ts
│   └── types/
│       ├── resume.types.ts
│       └── index.ts
├── components/
│   └── layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── PageLayout.tsx
├── resume/
│   └── page.tsx (首页)
├── rootProvider.tsx (已更新)
└── globals.css (已更新)
```

## 下一步工作

### 待完成的组件迁移

1. **共享组件** (demo/src/components/)
   - DatePicker.jsx
   - EncryptionModeSelector.jsx
   - AllowlistManager.jsx
   - PublishBlobToAllowlist.jsx
   - ResumeEncryptionExample.jsx

2. **简历相关组件** (demo/src/resume/sections/)
   - PersonalInfo.jsx
   - Skills.jsx
   - DesiredPosition.jsx
   - WorkExperience.jsx
   - ProjectExperience.jsx
   - Education.jsx
   - Certificates.jsx
   - ResumePreview.jsx

3. **页面路由**
   - /resume/create - 创建简历
   - /resume/list - 我的简历列表
   - /resume/edit/[id] - 编辑简历
   - /resume/preview/[id] - 预览简历
   - /resume/browse - 浏览简历
   - /resume/allowlist - Allowlist 管理

4. **工具函数** (demo/src/utils/)
   - walrus.js - Walrus 存储交互
   - seal.js - Seal 加密
   - sealClient.js - Seal 客户端
   - subscription.js - 订阅逻辑

5. **服务扩展** (demo/src/services/)
   - resume.service.js - 简历服务
   - user.service.js - 用户服务
   - resume.transform.js - 数据转换
   - resumeEncryption.js - 加密逻辑

## 运行项目

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start
```

## 环境变量

需要在 `.env.local` 中配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_URL=http://localhost:3000
```

## 技术栈

- **框架**: Next.js 15.3.4 + React 19
- **区块链**: Sui Network + Walrus Storage + Seal Encryption
- **UI**: MUI (Material-UI) + Tailwind CSS
- **状态管理**: React Query (@tanstack/react-query)
- **钱包**: @mysten/dapp-kit
- **类型**: TypeScript

## 注意事项

1. 保留了原有的 OnchainKit 和 Farcaster MiniApp 功能
2. 所有新创建的文件都使用 TypeScript
3. 遵循 Next.js App Router 的最佳实践
4. 组件都使用 'use client' 标记为客户端组件
5. 路由使用 Next.js 的文件系统路由

## 构建状态

✅ 构建成功 - 所有类型检查和 Lint 通过
