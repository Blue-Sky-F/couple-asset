# 前后端分离重构方案（Spring Boot + MySQL）

## 目标

- 将现有单页前端应用改造成“前后端分离”架构：前端仅负责 UI/交互，后端提供统一 API。
- 后端提供：
  - 人员/帐号管理：注册、登录、帐号信息管理（含与“家庭/组”的关系）。
  - 资产数据管理：资产信息与收支流水的增删改查与统计。
- 存储层使用主流关系型数据库：MySQL；对资产/收支等对象进行表结构化设计，并以迁移脚本管理演进。
- 访问端适配：在 macOS 与 iOS（Safari/Chrome WebView）均可正常访问前端与后端服务。

## 现状梳理（基线）

- 当前是 React + Vite 的前端 SPA，数据在前端内存中维护，未持久化。
- 代码主要集中在前端入口组件中，缺少后端与数据库层。

## 总体架构

- Web 前端（React/Vite）
  - 负责：页面、交互、调用后端 API、展示统计图表
  - 不负责：密码、权限、持久化、业务规则的最终裁决
- API 后端（Java Spring Boot）
  - 负责：认证授权、业务校验、数据读写、统计聚合、审计字段、错误码
- 数据库（MySQL）
  - 负责：结构化存储、约束、索引、事务一致性

建议单仓库分目录（便于协同与部署）：

- `apps/web`：现有前端迁移至此
- `apps/api`：新增 Spring Boot 服务
- `packages/shared`（可选）：前后端共享 DTO/枚举（后续再决定是否引入）

## 领域模型（建议）

为了契合“情侣共同资产”，采用“家庭/组（Household）”作为聚合根：

- User：用户帐号
- Household：家庭/组（通常 2 人，也可扩展）
- HouseholdMember：用户与家庭的成员关系
- Asset：资产条目（可属于家庭；可标记为共同/个人；个人资产可关联到某个成员）
- Transaction：收支流水（同上）

归属策略：

- `scope = JOINT`：共同资产/共同流水（属于 household）
- `scope = PERSONAL`：个人资产/个人流水（仍属于 household，但额外关联 `owner_user_id`）

金额字段建议：

- 后端使用 `BigDecimal` 承载金额逻辑；
- 数据库存储使用 `DECIMAL(19,2)`（满足常见需求）；若未来要严控精度与币种，可改为“分”为单位的 BIGINT。

## 数据库表结构设计（初稿）

以下为首版可落地的最小集合（后续可按对话细化字段/约束）：

1) `users`
- `id` (BIGINT PK, snowflake/auto increment)
- `email` (VARCHAR, UNIQUE, NULLABLE) / `phone` (VARCHAR, UNIQUE, NULLABLE) 二选一或都支持
- `password_hash` (VARCHAR NOT NULL)
- `display_name` (VARCHAR NOT NULL)
- `status` (TINYINT NOT NULL) 例如：1=active, 0=disabled
- `created_at`, `updated_at`

2) `households`
- `id` (BIGINT PK)
- `name` (VARCHAR) 例如：小王&小徐
- `created_at`, `updated_at`

3) `household_members`
- `id` (BIGINT PK)
- `household_id` (BIGINT FK -> households.id, INDEX)
- `user_id` (BIGINT FK -> users.id, INDEX)
- `role` (VARCHAR) 例如：OWNER/MEMBER
- `created_at`, `updated_at`
- UNIQUE(`household_id`,`user_id`)

4) `assets`
- `id` (BIGINT PK)
- `household_id` (BIGINT FK, INDEX)
- `scope` (VARCHAR NOT NULL) PERSONAL/JOINT
- `owner_user_id` (BIGINT NULL, INDEX) PERSONAL 时必填，JOINT 时必须为 NULL（用应用层校验 + 约束补充）
- `type` (VARCHAR NOT NULL) 例如：CASH/BANK/STOCK/ESOP/OTHER
- `name` (VARCHAR NOT NULL) 例如：招行储蓄、某券商账户
- `amount` (DECIMAL(19,2) NOT NULL) 当前金额/余额
- `note` (VARCHAR NULL)
- `created_at`, `updated_at`

5) `transactions`
- `id` (BIGINT PK)
- `household_id` (BIGINT FK, INDEX)
- `scope` (VARCHAR NOT NULL) PERSONAL/JOINT
- `owner_user_id` (BIGINT NULL, INDEX) PERSONAL 时必填
- `direction` (VARCHAR NOT NULL) INCOME/EXPENSE
- `category` (VARCHAR NOT NULL) 例如：SALARY/RENT/FOOD/GIFT/OTHER（先用字符串，后续可表驱动）
- `amount` (DECIMAL(19,2) NOT NULL)
- `occurred_at` (DATETIME NOT NULL, INDEX) 发生时间（用于按月统计）
- `note` (VARCHAR NULL)
- `created_at`, `updated_at`

认证令牌（可选，取决于采用的登录态方案）：

6) `refresh_tokens`（如采用 refresh token 轮换）
- `id` (BIGINT PK)
- `user_id` (BIGINT FK, INDEX)
- `token_hash` (VARCHAR NOT NULL, UNIQUE)
- `expires_at` (DATETIME NOT NULL, INDEX)
- `revoked_at` (DATETIME NULL)
- `created_at`

## API 设计（初稿）

统一前缀：`/api`

### 认证与帐号

- `POST /api/auth/register`
  - 入参：email/phone、password、displayName、（可选）householdName 或邀请加入
  - 出参：用户基础信息 + accessToken（以及 refreshToken cookie，若启用）
- `POST /api/auth/login`
- `POST /api/auth/refresh`（若启用 refresh token）
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PUT /api/users/me`

### 家庭/组与成员

- `GET /api/households/me`：获取当前用户所在 household 与成员列表
- `POST /api/households`（可选）：创建 household
- `POST /api/households/{id}/members`（可选）：邀请/添加成员（后续再做）

### 资产

- `GET /api/assets?scope=&ownerUserId=`：列表（支持过滤）
- `POST /api/assets`
- `PUT /api/assets/{id}`
- `DELETE /api/assets/{id}`

### 收支流水

- `GET /api/transactions?month=YYYY-MM`：按月列表
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`
- `GET /api/stats/monthly?month=YYYY-MM`：返回收入/支出汇总与（可选）分类汇总

## 后端实现分层（建议）

- Controller：HTTP 层（DTO、参数校验、状态码）
- Service：业务层（权限、归属、跨表校验、统计聚合）
- Repository：数据访问层（Spring Data JPA）
- Entity：持久化实体（与表结构对应）
- Mapper：Entity 与 DTO 转换（可手写或引入 MapStruct，后续再决定）

## 认证与安全策略（面向 macOS/iOS）

推荐 JWT Access Token + Refresh Token（HttpOnly Cookie）组合：

- Access Token：短时效，前端放内存或 sessionStorage，通过 `Authorization: Bearer ...` 发送
- Refresh Token：HttpOnly + Secure + SameSite=Lax（或 None + Secure，视跨站情况），更适配 iOS Safari 对第三方 cookie 的限制
- CORS：
  - 允许前端域名（开发期 `http://localhost:5173`）
  - 允许携带凭证（若 refresh token 用 cookie）
- 密码存储：BCrypt（Spring Security 默认推荐）
- 风控（最小集）：
  - 登录接口限流（可先做应用级简化，后续接入网关/Redis）
  - 统一错误响应（避免泄露用户是否存在）

## 前端改造点

- 新增登录/注册页面与路由守卫（未登录引导登录）
- 将资产/流水的数据源从 `useState` 初始数据迁移为 API 调用
- 增加 API Client（统一 baseURL、错误处理、自动刷新 token（若启用））
- 保持移动端体验：适配 iOS Safari 的 viewport、安全区（safe-area-inset）

## 迁移与实施步骤（执行计划）

1) 仓库结构重组
- 将现有前端代码迁移到 `apps/web`
- 新增 `apps/api` Spring Boot 工程（Maven/Gradle）
- 明确本地开发启动方式（web 与 api 端口、代理策略）

2) 数据库与迁移脚本
- 确定 MySQL 版本与字符集（建议 utf8mb4）
- 引入 Flyway 或 Liquibase
- 落地首版表结构与索引（users/households/household_members/assets/transactions）

3) 认证模块（auth）
- 注册：创建 user、创建 household（或加入）、初始化成员关系
- 登录：校验密码、签发 token
- 当前用户：基于 token 鉴权返回 `me`

4) 人员管理模块（user/household）
- `GET/PUT users/me`
- `GET households/me`（返回成员列表，用于前端“视角切换”）

5) 资产模块（assets）
- CRUD + 归属/权限校验（只能操作所在 household 的数据）
- 列表接口支持 scope 与 ownerUserId 过滤

6) 收支模块（transactions）
- CRUD + 归属/权限校验
- 按月查询与汇总统计接口（复用 occurred_at 索引）

7) 前端接入与替换
- 接入认证流程与 token 管理
- 替换资产/流水读写为 API
- 保留原有图表与 UI，数据来自后端

8) 测试与验收
- 后端：关键 service 单元测试 + controller 集成测试（登录、鉴权、CRUD）
- 前端：关键页面 smoke 测试（登录后查看总览/资产/流水）
- 兼容性：macOS Safari/Chrome 与 iOS Safari 实测（登录态、列表滚动、输入框、日期选择）

## 需要你补充确认的细节（下一轮对话建议）

1) 注册时的“家庭/组”策略：默认创建一个 household 还是必须通过邀请码加入？
2) 成员上限：固定 2 人还是支持更多成员？
3) 金额与币种：是否只考虑人民币？是否需要多币种与汇率？
4) 分类体系：交易分类/资产类型是否需要可配置（表驱动）还是先内置枚举？

