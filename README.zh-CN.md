# ResumeVault

> 掌控职业数据，每次查看都能赚钱

一个 Web3 去中心化求职平台，让求职者控制自己的加密简历，并在招聘者解锁查看时获得加密货币收益。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[English](./README.md) | 简体中文

## 🌟 功能特性

### 求职者
- **🔒 隐私优先**: 您的简历数据经过加密并安全存储
- **💰 浏览获利**: 设置价格，当招聘者解锁您的简历时赚取加密货币
- **🎨 专业模板**: 使用我们易用的表单构建器创建精美简历
- **🤖 AI 润色**: AI 驱动的简历优化，让您的简历更出色
- **📊 数据分析**: 追踪谁查看了您的简历以及查看时间

### 招聘者
- **🔍 浏览人才**: 在合格候选人池中搜索
- **💳 按需付费**: 只在解锁感兴趣的简历时付费
- **🚀 快速访问**: 付款后即时访问候选人信息
- **📈 优质候选人**: 接触重视自己数据的认真求职者

## 🏗️ 架构

```
ResumeVault/
├── frontend/web/          # Next.js 15 + React 19 + TypeScript
│   ├── app/
│   │   ├── components/    # 可复用 UI 组件
│   │   ├── resume/        # 简历创建和管理页面
│   │   ├── lib/          # 工具函数、类型、服务
│   │   └── services/     # API 集成层
│   └── public/
│
└── backend/rust_backend/  # Rust + Actix-web
    ├── src/
    │   ├── controllers/   # HTTP 请求处理器
    │   ├── services/      # 业务逻辑（AI、简历等）
    │   ├── dao/          # 数据库访问层
    │   ├── models/       # 数据模型和验证
    │   ├── entities/     # 数据库实体（SeaORM）
    │   └── routes/       # API 路由
    ├── migrations/       # 数据库迁移
    └── Cargo.toml
```

## 🚀 技术栈

### 前端
- **框架**: Next.js 15.3.4 (App Router)
- **UI 库**: React 19 + Material-UI v7
- **样式**: Tailwind CSS + Emotion
- **Web3**: Wagmi + Viem + Coinbase OnchainKit
- **状态管理**: React Hooks
- **HTTP 客户端**: Fetch API

### 后端
- **语言**: Rust 1.75+
- **Web 框架**: Actix-web 4.11
- **数据库 ORM**: SeaORM
- **数据库**: PostgreSQL 14+
- **AI 集成**: OpenAI 兼容 API (Flock.io)
- **HTTP 客户端**: Reqwest 0.12

### 区块链与存储
- **网络**: Base Sepolia (测试网)
- **钱包**: Coinbase Wallet
- **存储**: Irys (去中心化存储)
- **代币标准**: ERC-20 (用于支付)

## 📦 安装

### 前置要求

- **Node.js**: v20+ 和 pnpm
- **Rust**: 1.75+ 及 cargo
- **PostgreSQL**: 14+
- **Git**

### 1. 克隆仓库

```bash
git clone https://github.com/zhiming817/ResumeVault.git
cd ResumeVault
```

### 2. 后端设置

```bash
cd backend/rust_backend

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 配置
# - DATABASE_URL: PostgreSQL 连接字符串
# - AI_API_BASE: AI 服务端点
# - AI_API_KEY: 您的 AI API 密钥
# - AI_MODEL: AI 模型名称

# 安装依赖并运行迁移
./scripts/setup.sh

# 启动后端服务器
cargo run --release
# 服务器运行在 http://localhost:8080
```

### 3. 前端设置

```bash
cd frontend/web

# 安装依赖
pnpm install

# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 配置
# - NEXT_PUBLIC_API_URL: 后端 API 地址 (http://localhost:8080)
# - NEXT_PUBLIC_ONCHAINKIT_API_KEY: Coinbase API 密钥
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: WalletConnect 项目 ID

# 启动开发服务器
pnpm dev
# 前端运行在 http://localhost:3000
```

## 🔧 配置

### 后端环境变量

```bash
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/resumevault

# AI 服务 (Flock.io)
AI_API_BASE=https://api.flock.io/v1
AI_API_KEY=your_api_key_here
AI_MODEL=qwen3-30b-a3b-instruct-2507

# 服务器
RUST_LOG=info
HOST=0.0.0.0
PORT=8080
```

### 前端环境变量

```bash
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8080

# 区块链 (Base Sepolia 测试网)
NEXT_PUBLIC_CHAIN_ID=84532

# OnchainKit (Coinbase)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🎯 使用指南

### 创建简历

1. **连接钱包**: 点击导航栏中的"连接钱包"
2. **导航**: 从菜单进入"创建简历"
3. **填写信息**: 完成表单各部分：
   - 个人信息
   - 技能（支持 AI 润色）
   - 期望职位
   - 工作经历（支持 AI 润色）
   - 项目经验
   - 教育背景
   - 证书
4. **保存**: 点击"保存简历"存储到区块链
5. **设置价格**: 进入"我的简历"设置查看价格

### 浏览简历

1. **浏览**: 导航到"浏览简历"
2. **搜索**: 按技能、职位或地点筛选
3. **预览**: 免费查看基本信息
4. **解锁**: 支付设定价格查看完整简历详情

### AI 简历润色

- 在技能和工作经历部分可用
- 点击文本字段旁的"润色"按钮
- AI 分析并改进您的内容
- 可以应用或重新润色

## 📚 API 文档

### 简历接口

```
POST   /api/resumes              # 创建简历
GET    /api/resumes/summaries    # 获取简历列表（公开）
GET    /api/resumes/my/:owner    # 获取我的简历
GET    /api/resumes/detail/:id/:owner  # 获取简历详情
PUT    /api/resumes/:id          # 更新简历
DELETE /api/resumes/:id/:owner   # 删除简历
PUT    /api/resumes/price        # 设置简历价格
PUT    /api/resumes/name         # 更新简历名称
```

### AI 接口

```
POST   /api/ai/polish            # 使用 AI 润色文本
```

### 解锁记录接口

```
POST   /api/unlock-records       # 创建解锁记录
GET    /api/unlock-records/check/:resume_id/:buyer_id
GET    /api/unlock-records/buyer/:wallet
GET    /api/unlock-records/resume/:resume_id
```

## 🧪 测试

### 后端测试

```bash
cd backend/rust_backend
cargo test
```

### 前端测试

```bash
cd frontend/web
pnpm test
```

### API 测试

```bash
# 使用提供的测试脚本
cd backend/rust_backend/scripts
./test_api.sh
```

## 🚢 部署

### 后端部署

```bash
# 构建发布版本
cargo build --release

# 二进制文件位于 target/release/rust_backend
./target/release/rust_backend
```

### 前端部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### Docker 部署（即将推出）

```bash
docker-compose up -d
```

## 🤝 贡献

我们欢迎贡献！请查看我们的[贡献指南](CONTRIBUTING.md)了解详情。

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加某个很棒的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 链接

- **网站**: [resumevault.io](https://resumevault.io) (即将推出)
- **文档**: [docs.resumevault.io](https://docs.resumevault.io) (即将推出)
- **Discord**: [加入我们的社区](https://discord.gg/resumevault) (即将推出)
- **Twitter**: [@ResumeVault](https://twitter.com/resumevault) (即将推出)

## 👥 团队

- **首席开发者**: [@zhiming817](https://github.com/zhiming817)

## 🙏 致谢

- [Coinbase OnchainKit](https://github.com/coinbase/onchainkit) - Web3 集成
- [Actix-web](https://actix.rs/) - Rust Web 框架
- [Next.js](https://nextjs.org/) - React 框架
- [Material-UI](https://mui.com/) - UI 组件库
- [SeaORM](https://www.sea-ql.org/SeaORM/) - Rust ORM

## 📊 项目状态

🚧 **状态**: 活跃开发中

- ✅ 基础简历创建和管理
- ✅ AI 驱动的简历润色
- ✅ 简历价格设置
- ✅ 钱包集成（Coinbase Wallet）
- 🚧 支付系统（x402 集成）
- 🚧 去中心化存储（Irys/IPFS）
- 🚧 简历加密
- 📋 高级搜索和筛选
- 📋 分析仪表板
- 📋 移动应用

## 💡 未来路线图

### 2025 年第一季度
- [ ] 完成 x402 支付集成
- [ ] 实现简历加密
- [ ] 添加高级搜索筛选
- [ ] 在 Base 主网上线

### 2025 年第二季度
- [ ] 移动应用（React Native）
- [ ] 分析仪表板
- [ ] 招聘者仪表板
- [ ] 批量操作

### 2025 年第三季度
- [ ] 多链支持
- [ ] DAO 治理
- [ ] 代币奖励计划
- [ ] 企业功能

## 📞 支持

如需支持，请：
- 在 [GitHub](https://github.com/zhiming817/ResumeVault/issues) 上开启 issue
- 发送邮件: support@resumevault.io (即将推出)
- 加入我们的 [Discord](https://discord.gg/resumevault) (即将推出)

---

由 ResumeVault 团队用 ❤️ 制作
