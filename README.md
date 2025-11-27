# ResumeVault

> Own Your Career Data, Earn From Every View

A Web3 decentralized job platform where job seekers control their encrypted resumes and earn micropayments when recruiters unlock them.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🌟 Features

### For Job Seekers
- **🔒 Privacy First**: Your resume data is encrypted and stored securely
- **💰 Earn From Views**: Set your price and earn cryptocurrency when recruiters unlock your resume
- **🎨 Professional Templates**: Create beautiful resumes with our easy-to-use form builder
- **🤖 AI Polish**: AI-powered resume optimization for better presentation
- **📊 Analytics**: Track who viewed your resume and when

### For Recruiters
- **🔍 Browse Talent**: Search through a pool of qualified candidates
- **💳 Pay-per-View**: Only pay when you unlock a resume that interests you
- **🚀 Fast Access**: Instant access to candidate information after payment
- **📈 Quality Candidates**: Access to serious job seekers who value their data

## 🏗️ Architecture

```
ResumeVault/
├── frontend/web/          # Next.js 15 + React 19 + TypeScript
│   ├── app/
│   │   ├── components/    # Reusable UI components
│   │   ├── resume/        # Resume creation & management pages
│   │   ├── lib/          # Utilities, types, services
│   │   └── services/     # API integration layer
│   └── public/
│
└── backend/rust_backend/  # Rust + Actix-web
    ├── src/
    │   ├── controllers/   # HTTP request handlers
    │   ├── services/      # Business logic (AI, Resume, etc.)
    │   ├── dao/          # Database access layer
    │   ├── models/       # Data models & validation
    │   ├── entities/     # Database entities (SeaORM)
    │   └── routes/       # API routing
    ├── migrations/       # Database migrations
    └── Cargo.toml
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **UI Library**: React 19 + Material-UI v7
- **Styling**: Tailwind CSS + Emotion
- **Web3**: Wagmi + Viem + Coinbase OnchainKit
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Backend
- **Language**: Rust 1.75+
- **Web Framework**: Actix-web 4.11
- **Database ORM**: SeaORM
- **Database**: PostgreSQL 14+
- **AI Integration**: OpenAI-compatible API (Flock.io)
- **HTTP Client**: Reqwest 0.12

### Blockchain & Storage
- **Network**: Base Sepolia (Testnet)
- **Wallet**: Coinbase Wallet
- **Storage**: Irys (Decentralized storage)
- **Token Standard**: ERC-20 (for payments)

## 📦 Installation

### Prerequisites

- **Node.js**: v20+ and pnpm
- **Rust**: 1.75+ with cargo
- **PostgreSQL**: 14+
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/zhiming817/ResumeVault.git
cd ResumeVault
```

### 2. Backend Setup

```bash
cd backend/rust_backend

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# - DATABASE_URL: PostgreSQL connection string
# - AI_API_BASE: AI service endpoint
# - AI_API_KEY: Your AI API key
# - AI_MODEL: AI model name

# Install dependencies and run migrations
./scripts/setup.sh

# Start the backend server
cargo run --release
# Server runs on http://localhost:8080
```

### 3. Frontend Setup

```bash
cd frontend/web

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# - NEXT_PUBLIC_API_URL: Backend API URL (http://localhost:8080)
# - NEXT_PUBLIC_ONCHAINKIT_API_KEY: Coinbase API key
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: WalletConnect project ID

# Start the development server
pnpm dev
# Frontend runs on http://localhost:3000
```

## 🔧 Configuration

### Backend Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resumevault

# AI Service (Flock.io)
AI_API_BASE=https://api.flock.io/v1
AI_API_KEY=your_api_key_here
AI_MODEL=qwen3-30b-a3b-instruct-2507

# Server
RUST_LOG=info
HOST=0.0.0.0
PORT=8080
```

### Frontend Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Blockchain (Base Sepolia Testnet)
NEXT_PUBLIC_CHAIN_ID=84532

# OnchainKit (Coinbase)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🎯 Usage

### Creating a Resume

1. **Connect Wallet**: Click "Connect Wallet" in the navigation bar
2. **Navigate**: Go to "Create Resume" from the menu
3. **Fill Information**: Complete the form sections:
   - Personal Info
   - Skills (with AI polish support)
   - Desired Position
   - Work Experience (with AI polish support)
   - Projects
   - Education
   - Certificates
4. **Save**: Click "Save Resume" to store on the blockchain
5. **Set Price**: Go to "My Resumes" and set viewing price

### Browsing Resumes

1. **Browse**: Navigate to "Browse Resumes"
2. **Search**: Filter by skills, position, or location
3. **Preview**: See basic information for free
4. **Unlock**: Pay the set price to view full resume details

### AI Resume Polish

- Available in Skills and Work Experience sections
- Click the "Polish" button next to text fields
- AI analyzes and improves your content
- Apply or re-polish as needed

## 📚 API Documentation

### Resume Endpoints

```
POST   /api/resumes              # Create resume
GET    /api/resumes/summaries    # Get resume list (public)
GET    /api/resumes/my/:owner    # Get my resumes
GET    /api/resumes/detail/:id/:owner  # Get resume detail
PUT    /api/resumes/:id          # Update resume
DELETE /api/resumes/:id/:owner   # Delete resume
PUT    /api/resumes/price        # Set resume price
PUT    /api/resumes/name         # Update resume name
```

### AI Endpoints

```
POST   /api/ai/polish            # Polish text with AI
```

### Unlock Record Endpoints

```
POST   /api/unlock-records       # Create unlock record
GET    /api/unlock-records/check/:resume_id/:buyer_id
GET    /api/unlock-records/buyer/:wallet
GET    /api/unlock-records/resume/:resume_id
```

## 🧪 Testing

### Backend Tests

```bash
cd backend/rust_backend
cargo test
```

### Frontend Tests

```bash
cd frontend/web
pnpm test
```

### API Testing

```bash
# Use the provided test scripts
cd backend/rust_backend/scripts
./test_api.sh
```

## 🚢 Deployment

### Backend Deployment

```bash
# Build release binary
cargo build --release

# The binary will be at target/release/rust_backend
./target/release/rust_backend
```

### Frontend Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Docker Deployment (Coming Soon)

```bash
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [resumevault.io](https://resumevault.io) (Coming Soon)
- **Documentation**: [docs.resumevault.io](https://docs.resumevault.io) (Coming Soon)
- **Discord**: [Join our community](https://discord.gg/resumevault) (Coming Soon)
- **Twitter**: [@ResumeVault](https://twitter.com/resumevault) (Coming Soon)

## 👥 Team

- **Lead Developer**: [@zhiming817](https://github.com/zhiming817)

## 🙏 Acknowledgments

- [Coinbase OnchainKit](https://github.com/coinbase/onchainkit) - Web3 integration
- [Actix-web](https://actix.rs/) - Rust web framework
- [Next.js](https://nextjs.org/) - React framework
- [Material-UI](https://mui.com/) - UI components
- [SeaORM](https://www.sea-ql.org/SeaORM/) - Rust ORM

## 📊 Project Status

🚧 **Status**: In Active Development

- ✅ Basic resume creation and management
- ✅ AI-powered resume polishing
- ✅ Price setting for resumes
- ✅ Wallet integration (Coinbase Wallet)
- 🚧 Payment system (x402 integration)
- 🚧 Decentralized storage (Irys/IPFS)
- 🚧 Resume encryption
- 📋 Advanced search and filtering
- 📋 Analytics dashboard
- 📋 Mobile app

## 💡 Future Roadmap

### Q1 2025
- [ ] Complete x402 payment integration
- [ ] Implement resume encryption
- [ ] Add advanced search filters
- [ ] Launch on Base mainnet

### Q2 2025
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Recruiter dashboard
- [ ] Batch operations

### Q3 2025
- [ ] Multi-chain support
- [ ] DAO governance
- [ ] Token rewards program
- [ ] Enterprise features

## 📞 Support

For support, please:
- Open an issue on [GitHub](https://github.com/zhiming817/ResumeVault/issues)
- Email: support@resumevault.io (Coming Soon)
- Join our [Discord](https://discord.gg/resumevault) (Coming Soon)

---

Made with ❤️ by the ResumeVault Team
