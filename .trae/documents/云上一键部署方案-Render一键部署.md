# 云上一键部署方案（Render Blueprint）

目标：把当前「React/Vite 前端 + Spring Boot API + MySQL」以“点一次按钮即可创建全部云资源”的方式部署到云上，并能正常登录/增删改资产/流水（带持久化数据库）。

本方案以 **Render Blueprint** 为主（真正的一键：一次导入仓库 → 自动创建 Web/API/DB），并给出备用方案（Vercel + 托管后端）以便你根据账号/地区网络选择。

---

## 现状与关键约束

1. 前端目前通过相对路径请求 `/api/*`，本地依赖 Vite proxy 或 Nginx 反代；在云上如果前后端不同域名，会遇到：
   - 前端需要可配置 API Base URL（例如 `VITE_API_BASE_URL=https://xxx.onrender.com`）
   - 后端需要配置允许的 CORS Origin（生产域名）
2. 后端依赖 MySQL + Flyway。云上需：
   - 绑定数据库连接串（host/user/password/db）
   - 通过 Flyway 自动建表
3. 当前项目已有 Dockerfile（后端）与 Web Dockerfile（前端 Nginx 静态）可复用。

---

## 方案 A（推荐）：Render Blueprint 一键部署（Web + API + MySQL）

### A1. 产出物（需要落地到仓库的文件/改动）

1. `render.yaml`（Blueprint 配置：一个 repo 内声明 3 个服务）
   - services:
     - `api`：Docker build（Spring Boot），自动注入 `DB_URL/DB_USER/DB_PASSWORD/JWT_SECRET`
     - `web`：Static Site（或 Docker build Nginx），注入 `VITE_API_BASE_URL`
     - `mysql`：Render Managed PostgreSQL 更常见，但本项目是 MySQL：
       - 若 Render 不支持托管 MySQL：改用 Render 的“External Database”（Planetscale/TiDB Cloud/Aiven MySQL），仍可在 Blueprint 一键创建 web/api（DB 手工一次性创建）
       - 若必须“一键全含 DB”：将数据库改为 Render 托管 PostgreSQL（需要后端适配，成本更高，不建议第一版）

2. 前端支持 `VITE_API_BASE_URL`（生产环境指向云端 API）
   - `api(path)` 拼接逻辑：`baseUrl + path`（path 仍以 `/api/...` 开头）
   - 保持本地开发体验：没有 `VITE_API_BASE_URL` 时仍走相对路径 + Vite proxy

3. 后端 CORS 支持生产域名
   - `allowedOriginPatterns` 增加 `https://<render-web-domain>` 或可配置（环境变量）

4. 生产环境种子数据开关
   - 默认关闭 seed（避免云上误写演示数据）
   - 仅本地 Docker/你明确开启时才写入

### A2. Render 上的“一键部署”流程（用户操作）

1. 将仓库推到 GitHub
2. Render → New → Blueprint → 选择该仓库
3. 在 Render UI 中设置/确认环境变量（至少）：
   - `JWT_SECRET`（>=32 字节随机串）
   - `VITE_API_BASE_URL`（若 web 为 static，必须配置为 api 服务的公开 URL）
   - 数据库相关：`DB_URL/DB_USER/DB_PASSWORD`（来自你选的 MySQL 托管服务）
4. 点击 Deploy，等待 web/api 构建并上线

### A3. 验收清单

1. 打开 Web：能正常加载、登录/注册
2. API 健康检查：`GET /api/health` 返回 ok
3. 登录后：
   - `GET /api/users/me` 成功
   - `GET /api/assets` 返回列表
   - 新增资产/流水成功并刷新后仍存在（验证数据库持久化）

---

## 方案 B（备选）：Vercel（前端）+ Railway/Render（后端）+ 托管 MySQL

适用：你更偏好 Vercel 部署前端，后端走单独的后端平台（Railway/Render/Fly.io）。

关键点：
1. 前端必须支持 `VITE_API_BASE_URL`，避免 `/api` 被 Vercel rewrite 到 `index.html`
2. Vercel 环境变量设置 `VITE_API_BASE_URL=https://<your-api-domain>`
3. 后端 CORS 加上 `https://<your-vercel-domain>`

---

## 方案 C（最稳定）：云服务器一键（ECS/轻量云）+ Docker Compose

适用：你希望完全掌控、且支持 MySQL “同机部署”，一条命令完成。

流程：
1. 买一台 VM（Ubuntu）+ 放通 80/443/22
2. 安装 Docker
3. `git clone` 仓库
4. `docker compose up -d --build`
5. 绑定域名 + Nginx/Traefik 反代 + HTTPS（Let’s Encrypt）

---

## 实施计划（我接下来会做什么）

1. 先确定你要选的“一键云平台”：优先 Render Blueprint；若你坚持 DB 也“一键创建”，我会说明 DB 的可选托管服务与最少人工步骤。
2. 在仓库中新增/调整：
   - `render.yaml`
   - 前端：支持 `VITE_API_BASE_URL`
   - 后端：CORS 支持生产域名（可配置）
   - 默认关闭 seed（云上不写演示数据）
3. 给出一份“从 0 到上线”的复制粘贴式步骤（含需要填的环境变量列表）。

