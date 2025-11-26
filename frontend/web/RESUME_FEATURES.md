# ResumeVault - 简历管理功能说明

## 📋 新增功能

### 1. 后端 API
位置：`/app/api/resumes/`

#### API 端点

**GET /api/resumes?owner={address}**
- 获取指定用户的所有简历列表
- 返回：`{ resumes: ResumeMetadata[], total: number }`

**POST /api/resumes**
- 创建新的简历元数据
- 请求体：
  ```json
  {
    "blobId": "string",
    "owner": "string",
    "title": "string",
    "summary": "string",
    "encrypted": boolean
  }
  ```
- 返回：`ResumeMetadata`

**GET /api/resumes/{id}**
- 获取单个简历的元数据
- 返回：`ResumeMetadata`

**PATCH /api/resumes/{id}**
- 更新简历元数据
- 请求体：
  ```json
  {
    "title": "string (optional)",
    "summary": "string (optional)"
  }
  ```

**DELETE /api/resumes/{id}**
- 删除简历元数据
- 返回：`{ success: boolean }`

#### 数据存储
- 当前使用内存存储（`Map`）用于演示
- 生产环境需要替换为真实数据库（MongoDB、PostgreSQL 等）
- Store 位置：`/app/lib/store/resumes.store.ts`

### 2. 简历列表页
路径：`/resume/list`

**功能：**
- ✅ 展示当前用户的所有简历
- ✅ 显示简历标题、摘要、创建/更新时间
- ✅ 显示 Blob ID（截断显示）
- ✅ 显示是否加密的标签
- ✅ 查看按钮 - 跳转到详情页
- ✅ 删除按钮 - 删除简历元数据
- ✅ 创建新简历按钮
- ✅ 空状态提示
- ✅ 加载状态和错误处理

**使用：**
1. 连接钱包
2. 点击导航栏"My Resumes"
3. 查看您保存的所有简历

### 3. 简历查看页
路径：`/resume/view/{id}`

**功能：**
- ✅ 从 API 加载简历元数据
- ✅ 自动从 localStorage 读取加密密钥
- ✅ 手动输入加密密钥（如果需要）
- ✅ 从 Walrus 下载简历内容
- ✅ 自动解密（如果有密钥）
- ✅ 完整的简历预览
  - 个人信息
  - 专业技能
  - 期望职位
  - 工作经历
  - 教育经历
  - 项目经验
  - 证书

**使用：**
1. 从简历列表点击"查看"
2. 如果简历加密，输入密钥（或自动填充）
3. 点击"下载并预览简历"
4. 查看完整简历内容

### 4. 简历下载页
路径：`/resume/download`

**功能：**
- ✅ 输入任意 Blob ID
- ✅ 输入加密密钥（可选）
- ✅ 加密开关切换
- ✅ 从 Walrus 下载并解密
- ✅ 完整的简历预览
- ✅ 重置功能

**使用：**
1. 导航到"Download Resume"
2. 输入 Blob ID
3. 如果加密，输入密钥
4. 点击"下载简历"
5. 查看预览
6. 可以重置后下载其他简历

## 🔐 加密密钥管理

### 自动保存
创建简历时，加密密钥自动保存到 `localStorage`:
```javascript
const savedKeys = JSON.parse(localStorage.getItem('resumeKeys') || '{}');
savedKeys[blobId] = encryptionKey;
localStorage.setItem('resumeKeys', JSON.stringify(savedKeys));
```

### 自动读取
查看页面会自动尝试从 localStorage 读取密钥：
```javascript
const savedKeys = JSON.parse(localStorage.getItem('resumeKeys') || '{}');
if (savedKeys[blobId]) {
  setEncryptionKey(savedKeys[blobId]);
}
```

### 安全建议
⚠️ **注意：**
- localStorage 不够安全，仅用于演示
- 生产环境建议：
  - 使用硬件钱包存储密钥
  - 实现服务端密钥托管（加密存储）
  - 使用 Seal 的 Allowlist/Subscription 机制

## 📊 数据流程

### 创建简历
```
1. 用户填写表单 (ResumeData)
2. ↓
3. 加密数据 (Seal encryption)
4. ↓
5. 上传到 Walrus → 获得 blobId
6. ↓
7. 保存元数据到 API → 获得 resumeId
8. ↓
9. 保存密钥到 localStorage
10. ↓
11. 跳转到列表页
```

### 查看简历
```
1. 从 API 加载元数据 (ResumeMetadata)
2. ↓
3. 尝试从 localStorage 读取密钥
4. ↓
5. 从 Walrus 下载 blob
6. ↓
7. 解密数据 (使用密钥)
8. ↓
9. 显示预览
```

## 🔄 集成状态

### ✅ 已完成
- [x] 类型定义 (ResumeMetadata)
- [x] 后端 API 路由 (CRUD)
- [x] 内存存储实现
- [x] 简历列表页
- [x] 简历查看页（带 ID）
- [x] 简历下载页（独立）
- [x] 导航栏更新
- [x] 加密密钥管理
- [x] 完整预览 UI

### ⏳ 待完成
- [ ] 数据库集成（替换内存存储）
- [ ] Allowlist/Subscription 合约集成
- [ ] 简历浏览页（Browse）
- [ ] 搜索和筛选功能
- [ ] 简历编辑功能
- [ ] 简历分享功能
- [ ] 访问统计和收益展示

## 🚀 快速测试

### 1. 创建简历
```bash
1. npm run dev
2. 访问 http://localhost:3000
3. 连接钱包
4. 点击 "Create Resume"
5. 填写表单
6. 勾选 "使用 Seal 加密"
7. 点击 "Save Resume"
8. 保存返回的密钥
```

### 2. 查看列表
```bash
1. 点击导航栏 "My Resumes"
2. 查看已保存的简历列表
3. 点击 "查看" 按钮
```

### 3. 下载简历
```bash
1. 点击导航栏 "Download Resume"
2. 输入 Blob ID
3. 输入加密密钥
4. 点击 "下载简历"
5. 查看预览
```

## 📁 文件结构

```
app/
├── api/
│   └── resumes/
│       ├── route.ts              # GET, POST
│       └── [id]/
│           └── route.ts          # GET, PATCH, DELETE
├── lib/
│   ├── store/
│   │   └── resumes.store.ts      # 内存存储
│   └── types/
│       └── resume.types.ts       # 类型定义（已更新）
└── resume/
    ├── list/
    │   └── page.tsx              # 简历列表页
    ├── view/
    │   └── [id]/
    │       └── page.tsx          # 简历查看页（带 ID）
    └── download/
        └── page.tsx              # 简历下载页（独立）
```

## 🔧 配置

无需额外配置，所有功能开箱即用。

## 📝 注意事项

1. **内存存储**：当前使用内存存储，服务器重启后数据丢失
2. **密钥安全**：localStorage 存储不够安全，仅用于演示
3. **并发访问**：内存存储不支持多实例部署
4. **数据持久化**：生产环境需要真实数据库

## 🎯 下一步计划

1. 集成真实数据库（推荐 MongoDB 或 PostgreSQL）
2. 实现 Allowlist 合约集成
3. 添加简历浏览和搜索功能
4. 实现访问控制和付费查看
5. 添加访问统计和收益展示
6. 优化 UI/UX
7. 添加单元测试
