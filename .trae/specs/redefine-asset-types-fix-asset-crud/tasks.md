# Tasks
- [x] Task 1: 统一资产类型口径（前后端一致）
  - [x] SubTask 1.1: 确认后端 AssetType 仅包含 BANK/STOCK/FUND/DOWRY/LOAN/OTHER，并清理任何旧类型引用
  - [x] SubTask 1.2: 前端 assetTypeConfig 与相关下拉/分组仅展示上述 6 类
  - [x] SubTask 1.3: 前端映射兼容旧返回值（若出现 CASH/ESOP，则映射到 BANK/STOCK 以保证 UI 可用）

- [x] Task 2: 迁移数据库历史资产类型（CASH/ESOP）
  - [x] SubTask 2.1: 新增 Flyway 迁移脚本 V5__asset_type_canonicalize.sql，执行 CASH→BANK、ESOP→STOCK
  - [x] SubTask 2.2: 验证迁移在已有数据上可重复执行且无副作用（幂等或可安全重放）

- [x] Task 3: 修复并回归验证资产编辑/删除报错
  - [x] SubTask 3.1: 复现并定位编辑/删除报错的触发条件（包含历史类型/空响应体/权限等）
  - [x] SubTask 3.2: 修复前端资产编辑/删除流程（请求体、类型校验、错误提示、刷新逻辑）
  - [x] SubTask 3.3: 修复后端资产编辑/删除异常（若存在：枚举解析、实体加载、鉴权、返回码）

- [x] Task 4: 部署与验收验证
  - [x] SubTask 4.1: 本地 docker compose 重建并验证 API/WEB 正常
  - [x] SubTask 4.2: 用账号 18098863002 登录后验证新增/编辑/删除资产成功

# Task Dependencies
- Task 3 depends on Task 1
- Task 4 depends on Task 2 and Task 3
