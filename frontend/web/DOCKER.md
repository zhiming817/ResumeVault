# ResumeVault 前端 Docker 部署指南

## 文件说明

- `Dockerfile` - 多阶段构建的 Docker 镜像定义文件
- `.dockerignore` - Docker 构建时忽略的文件
- `docker-run.sh` - 一键构建和运行脚本

## 使用方法

### 方法一：使用脚本（推荐）

```bash
# 赋予执行权限
chmod +x docker-run.sh

# 运行脚本
./docker-run.sh
```

### 方法二：手动构建和运行

#### 1. 构建镜像

```bash
docker build -t resumevault-frontend .
```

#### 2. 运行容器

```bash
docker run -d \
  --name resumevault-web \
  -p 3000:3000 \
  --restart unless-stopped \
  --env-file .env.production \
  resumevault-frontend
```

## Docker Compose 部署（可选）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  frontend:
    build: .
    container_name: resumevault-web
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

使用 Docker Compose：

```bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 查看日志
docker-compose logs -f
```

## 常用 Docker 命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs -f resumevault-web

# 进入容器
docker exec -it resumevault-web sh

# 停止容器
docker stop resumevault-web

# 启动容器
docker start resumevault-web

# 重启容器
docker restart resumevault-web

# 删除容器
docker rm -f resumevault-web

# 删除镜像
docker rmi resumevault-frontend

# 清理未使用的镜像
docker image prune -a
```

## 镜像优化特性

1. **多阶段构建** - 将依赖安装、构建和运行分离，最小化最终镜像体积
2. **Standalone 模式** - 使用 Next.js standalone 输出，只包含必要文件
3. **非 root 用户** - 以 nextjs 用户运行，提高安全性
4. **Alpine Linux** - 使用轻量级 Alpine 基础镜像

## 环境变量

确保 `.env.production` 文件包含所有必要的环境变量：

```env
NEXT_PUBLIC_API_URL=https://miniapp.egtoy.xyz/backend
NEXT_PUBLIC_URL=https://miniapp.egtoy.xyz
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_EPOCHS=5
```

## 生产部署注意事项

1. **HTTPS** - 生产环境建议配置 Nginx 或 Traefik 作为反向代理，提供 HTTPS
2. **资源限制** - 可以通过 `--memory` 和 `--cpus` 限制容器资源
3. **健康检查** - 添加健康检查确保服务可用性
4. **日志管理** - 配置日志驱动或使用日志收集工具

## 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker logs resumevault-web

# 查看完整日志
docker logs --tail 100 resumevault-web
```

### 端口冲突

```bash
# 查看端口占用
lsof -i :3000

# 使用其他端口
docker run -p 3001:3000 ...
```

### 镜像构建失败

```bash
# 清理缓存重新构建
docker build --no-cache -t resumevault-frontend .
```
