# 资产类型重定义与资产编辑/删除修复 Spec

## Why
当前资产类型口径不一致会导致前后端类型校验失败或历史数据无法兼容，进而出现资产编辑/删除时报错。需要统一资产类型并对旧数据做兼容迁移，保证资产 CRUD 稳定可用。

## What Changes
- 资产类型统一为：存款/股票/基金/嫁妆/借款/其他（落库枚举：BANK/STOCK/FUND/DOWRY/LOAN/OTHER）
- 对历史资产类型做兼容迁移：CASH → BANK，ESOP → STOCK
- 修复资产编辑与删除在存在历史类型/不一致类型时的报错，确保 UI 可操作且 API 返回正常
- **BREAKING**：不再支持旧类型值 CASH、ESOP 作为对外 API 的 type 入参

## Impact
- Affected specs: 资产类型体系、资产列表展示、资产新增/编辑/删除、资产趋势快照同步（间接受影响）
- Affected code:
  - 后端枚举与解析：[AssetType.java](file:///Users/a1/projects/trae-project/couple-asset/apps/api/src/main/java/com/coupleasset/api/entity/AssetType.java)、[AssetService.java](file:///Users/a1/projects/trae-project/couple-asset/apps/api/src/main/java/com/coupleasset/api/service/AssetService.java)
  - 数据迁移：`apps/api/src/main/resources/db/migration/V5__*.sql`（新增）
  - 前端类型配置与映射：[App.jsx](file:///Users/a1/projects/trae-project/couple-asset/src/App.jsx)

## ADDED Requirements
### Requirement: Asset Type Canonicalization
系统 SHALL 使用以下资产类型作为唯一口径：
- BANK（存款）
- STOCK（股票）
- FUND（基金）
- DOWRY（嫁妆）
- LOAN（借款）
- OTHER（其他）

#### Scenario: UI 显示
- **WHEN** 用户查看资产列表或总览
- **THEN** 前端以中文标签展示上述 6 种类型

### Requirement: Legacy Type Migration
系统 SHALL 在数据库层面迁移历史资产类型值：
- CASH → BANK
- ESOP → STOCK

#### Scenario: 迁移后兼容
- **WHEN** 用户访问 `/api/assets`
- **THEN** 后端不会因历史枚举值导致实体反序列化失败
- **AND THEN** 前端能正常展示并对迁移后的资产进行编辑/删除

### Requirement: Asset CRUD Robustness
系统 SHALL 保证资产编辑与删除不因资产类型口径问题报错。

#### Scenario: 编辑成功
- **WHEN** 用户在“资产”页编辑任意资产并保存
- **THEN** `PUT /api/assets/{id}` 返回 200，且资产内容更新生效

#### Scenario: 删除成功
- **WHEN** 用户在“资产”页删除任意资产并确认
- **THEN** `DELETE /api/assets/{id}` 返回 200/204，且该资产不再出现在 `GET /api/assets`

## MODIFIED Requirements
### Requirement: Create/Update Asset API Type Validation
系统 SHALL 仅接受 canonical 资产类型作为 `type` 入参（大小写不敏感，但必须可映射到 BANK/STOCK/FUND/DOWRY/LOAN/OTHER）。

#### Scenario: 非法类型拒绝
- **WHEN** 客户端以 `type=CASH` 或 `type=ESOP` 调用创建/更新资产
- **THEN** 返回 400（INVALID_REQUEST / invalid type）

## REMOVED Requirements
### Requirement: Old Asset Types (CASH, ESOP)
**Reason**: 口径不一致导致前后端解析与 UI 展示不稳定。
**Migration**: 通过 Flyway 迁移将旧值转换为 canonical 值（CASH→BANK，ESOP→STOCK）。

