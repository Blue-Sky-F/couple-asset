# 💑 共同资产记录 APP (Couple Asset Record APP)

## 项目概述
这是一个专为情侣设计的共同资产管理 Web 应用。它允许用户注册/登录后记录和查看共同及各自的资产状况、收支流水，帮助情侣更好地规划财务。应用采用移动端优先设计，数据由后端服务写入 MySQL 做持久化存储。

## 功能需求

### 1. 总览 (Dashboard)
- **资产概览**: 显示总资产、男方资产、女方资产。
- **资产分布**: 通过甜甜圈图展示不同类型资产（股票、存款、工资等）的占比。
- **近期活动**: 展示最近的几笔收支记录。
- **月度统计**: 实时计算本月收入和支出总额。
- **视角切换**: 支持切换“总资产”、“男方”、“女方”视角，查看对应数据。

### 2. 资产管理 (Assets)
- **资产列表**: 按类型（股票、存款、嫁妆、应收借款、工资收入、其他）分组展示资产。
- **新增资产**: 支持添加新资产，需填写名称、类型、归属人（男方/女方）、金额及备注。
- **删除资产**: 支持删除已有资产条目。
- **归属标识**: 清晰标记每项资产的归属方。

### 3. 收支记录 (Transactions)
- **收支列表**: 按时间倒序展示所有收支记录。
- **新增记录**: 支持记一笔收入或支出。
  - **类型**: 收入、支出。
  - **分类**: 工资、投资收益、生活支出、其他。
  - **归属**: 男方、女方、共同。
  - **信息**: 金额、备注、日期。
- **统计**: 自动区分收入（绿色）和支出（红色）。

## 技术栈
- **Web 前端**: React 18 + Vite + JavaScript (JSX)
- **API 后端**: Java Spring Boot + Spring Security + Spring Data JPA + Flyway + JWT
- **数据库**: MySQL

## 项目结构
```
couple-asset/
├── apps/
│   └── api/           # Spring Boot 后端（API、认证、数据存储）
├── src/
│   ├── App.jsx       # 核心应用逻辑与 UI 组件
│   ├── main.jsx      # 入口文件
│   └── ...
├── index.html        # HTML 模板
├── package.json      # 项目依赖与脚本
├── vite.config.js    # Vite 配置
└── README.md         # 项目文档
```

## 本地运行

### 1) 启动前端（Web）

1. **安装依赖**
    ```bash
    npm install
    ```

2. **启动开发服务器**
    ```bash
    npm run dev
    ```

3. **访问应用**
    浏览器打开 [http://localhost:5173](http://localhost:5173)

### 2) 启动后端（API）

前置条件：

- 安装 Java 17+
- 准备 MySQL（建议 utf8mb4），创建数据库 `couple_asset`

环境变量（可选）：

- `DB_URL`（默认 `jdbc:mysql://localhost:3306/couple_asset...`）
- `DB_USER`（默认 `root`）
- `DB_PASSWORD`（默认空）
- `JWT_SECRET`（建议使用 32 字节以上随机串）

后端工程位于 `apps/api`，首次启动会通过 Flyway 自动创建表结构。

### 3) iOS/macOS 访问说明（开发期）

- 同一台 Mac 上访问：前端默认 `http://localhost:5173`，后端默认 `http://localhost:8080`
- iPhone 访问 Mac 上的开发服务器：需要让前端 dev server 监听局域网地址（例如使用 Vite 的 `--host`），并通过 `http://<你的Mac局域网IP>:5173` 访问
- 后端已放开常见局域网来源的 CORS（`localhost/127.0.0.1/*.local/192.168.*.*/10.*.*.*`），以便 iOS Safari 调用 API

## 部署 (Vercel)

推荐使用 Vercel 进行部署，支持一键上线。

### 方式一：网页操作（推荐）
1.  将代码推送到 GitHub。
2.  登录 [Vercel](https://vercel.com)，导入 GitHub 仓库。
3.  点击 "Deploy"，等待构建完成。

### 方式二：命令行
```bash
npm install -g vercel
vercel login
vercel --prod
```

## iPhone 添加到主屏幕
1.  用 Safari 打开部署后的网址。
2.  点击底部「分享」按钮。
3.  选择「添加到主屏幕」。
4.  体验如原生 App 的全屏模式。
