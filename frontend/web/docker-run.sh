#!/bin/bash

# 构建并运行 ResumeVault 前端 Docker 容器

set -e

# 配置
IMAGE_NAME="resumevault-frontend"
CONTAINER_NAME="resumevault-web"
PORT=3000

echo "🐳 开始构建 Docker 镜像..."

# 构建镜像
docker build -t $IMAGE_NAME .

echo "✅ 镜像构建完成"

# 停止并删除旧容器（如果存在）
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🔄 停止并删除旧容器..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
fi

echo "🚀 启动新容器..."

# 运行容器
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:3000 \
  --restart unless-stopped \
  --env-file .env.production \
  $IMAGE_NAME

echo "✅ 容器已启动"
echo "📍 应用运行在: http://localhost:$PORT"
echo ""
echo "常用命令:"
echo "  查看日志: docker logs -f $CONTAINER_NAME"
echo "  停止容器: docker stop $CONTAINER_NAME"
echo "  重启容器: docker restart $CONTAINER_NAME"
echo "  删除容器: docker rm -f $CONTAINER_NAME"
