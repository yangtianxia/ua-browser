# 从 v0.x 迁移

## 破坏性变更

### API 拼写修正

```typescript
// v0.x
result.platfrom  // 拼写错误

// v1.0
result.platform  // 已修正
```

### 类型变更

| v0.x | v1.0 |
| :-- | :-- |
| `EnvPart` 类型 | 已移除，直接使用 `EnvOption` |
| `device: 'Pc'` | `device: 'PC'` |
| 仅默认导出 | 新增命名导出（tree-shakeable） |
| 单例类，有状态突变 | `parseUA()` 纯函数 |

## 新增字段

v1.0 在 `EnvOption` 中新增了以下字段：

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `arch` | `ArchName` | CPU 架构 |
| `isBot` | `boolean` | 是否为爬虫 |
| `botName` | `BotName` | 爬虫名称 |
| `isHeadless` | `boolean` | 是否为无头浏览器 |

## 调用方式不变

默认导出的调用方式与 v0.x 完全兼容：

```typescript
// v0.x 和 v1.0 均可
import uaBrowser from 'ua-browser'
const info = uaBrowser()
const info = uaBrowser(customUA)
```
