# Contentful 设置指南

本指南将帮助您设置 Contentful 内容管理系统，以便管理网站的活动内容。

## 1. 创建 Contentful 账户和空间

1. 访问 [Contentful 官网](https://www.contentful.com/) 并注册账户
2. 创建新的空间（Space）
3. 选择"空白空间"（Empty Space）模板

## 2. 创建内容模型

### 2.1 活动内容模型 (Activity)

在 Contentful 中创建 `Activity`（活动）内容模型：

1. 进入 Content model（内容模型）页面
2. 点击 "Add content type"（添加内容类型）
3. 命名为 "Activity"，系统 ID 设为 "activity"
4. 添加以下字段：

| 字段名 | 字段 ID | 类型 | 说明 |
|-------|---------|------|------|
| 标题 | title | Short text | 活动标题 |
| 描述 | description | Rich Text | 活动详细描述，支持富文本格式 |
| 日期 | date | Date | 活动日期 |
| 图片链接 | imageUrl | Short text | 活动封面图片的 URL |
| 分类 | category | Short text | 活动分类 |

### 2.2 活动方案内容模型 (Activity Blueprint)

为活动方案库创建 `Activity Blueprint`（活动方案）内容模型：

1. 进入 Content model（内容模型）页面
2. 点击 "Add content type"（添加内容类型）
3. 命名为 "活动方案"（Activity Blueprint），系统 ID 设为 "activityBlueprint"
4. 添加以下字段：

| 字段名称 | 字段 ID | 类型 | 是否必填 | 描述 |
|---------|---------|-----|---------|------|
| 标题 | title | 短文本（Short text） | 是 | 活动方案的名称 |
| 分类 | category | 短文本（Short text），多项 | 是 | 活动分类，如"游戏"、"交流"等 |
| 概要 | summary | 短文本（Short text） | 是 | 活动简短介绍 |
| 封面图 | coverImage | 媒体（Media） | 否 | 活动方案封面图 |
| 每轮时长 | durationPerRound | 短文本（Short text） | 否 | 每轮活动时长，如"30分钟" |
| 轮次 | rounds | 短文本（Short text） | 否 | 活动轮次，如"3轮" |
| 每轮人数 | participantsPerRound | 短文本（Short text） | 否 | 每轮参与人数，如"4-6人" |
| 参与条件 | participantCriteria | 短文本（Short text） | 否 | 参与者条件要求 |
| 硬件需求 | hardwareRequirements | 短文本（多行）| 否 | 硬件设备需求，每行一项 |
| 软件需求 | softwareRequirements | 短文本（多行）| 否 | 软件需求，每行一项 |
| 物料需求 | materialsNeeded | 短文本（多行）| 否 | 所需物料，每行一项 |
| 奖励建议 | rewardSuggestion | 短文本（Short text） | 否 | 奖励或奖品建议 |
| 活动规则 | rules | 富文本（Rich text） | 是 | 活动规则详细说明 |
| 活动流程 | procedure | 富文本（Rich text） | 是 | 活动流程步骤说明 |
| 注意事项 | tips | 富文本（Rich text） | 否 | 执行活动时的注意事项或建议 |

5. 字段验证设置：
   - 为必填字段（title、category、summary、rules、procedure）设置"该字段为必填项"

### 2.3 关于URL和内容标识

活动方案的URL将使用Contentful自动生成的系统ID（System ID），这是Contentful为每个条目自动创建的唯一标识符，无需手动设置。

**优势**:
- 无需手动创建和管理标识符或ID
- 避免命名冲突和重复问题
- 简化内容创建流程
- Contentful自动确保每个条目的唯一性

**URL格式示例**:
- 活动方案详情页: `/activities-library/6KE8RF7xEO6AmSu48GK2CS`

**注意事项**:
- 系统ID是一串随机生成的字母和数字组合，而非人类可读的格式
- 前端代码已配置为使用这些系统ID作为URL参数
- 创建内容时无需关注URL，只需填写活动方案内容即可

### 富文本字段设置

对于富文本字段（description、rules、procedure、tips），在编辑字段设置时：

1. 在字段设置中，启用以下功能：
   - Headings（标题）
   - Bold（粗体）
   - Italic（斜体）
   - Underline（下划线）
   - Lists（列表）
   - Links（链接）
   - Embedded Assets（嵌入资产）- 用于插入图片
   - 其他您需要的富文本功能

### 富文本中添加图片：

1. 图片上传：
   - 进入 Media（媒体）页面
   - 点击 "Add asset"（添加资产）
   - 上传您的图片
   - 为图片添加标题和描述（可选）

2. 在富文本编辑器中插入图片：
   - 将光标放在想要插入图片的位置
   - 点击工具栏中的 "Insert Media"（插入媒体）按钮
   - 从媒体库中选择要插入的图片
   - 可以调整图片大小和对齐方式

3. 图片设置建议：
   - 建议图片宽度不超过 800px
   - 使用适当的图片格式（JPG 用于照片，PNG 用于图标和截图）
   - 压缩图片以优化加载速度
   - 添加有意义的替代文本（Alt text）
   

## 3. 创建示例内容

### 3.1 创建活动内容

1. 进入 Content（内容）页面
2. 点击 "Add entry"（添加条目）
3. 选择 "Activity" 内容类型
4. 填写示例活动信息：
   - 使用富文本编辑器编写描述
   - 可以添加标题、格式化文本等
   - 在描述中插入相关图片
   - 确保填写所有必需字段

### 3.2 创建活动方案内容

1. 进入 Content（内容）页面
2. 点击 "Add entry"（添加条目）
3. 选择 "Activity Blueprint" 内容类型
4. 填写所有必填字段：
   - 标题：例如"东方主题团队对抗问答"
   - 分类：添加相关分类，如"问答"、"团队"
   - 概要：简短描述活动内容和特点
   - 活动规则：详细的活动规则说明
   - 活动流程：步骤化的活动流程说明

5. 填写可选字段：
   - 上传封面图片：点击"封面图"字段的"添加媒体"，可以上传新图片或使用已有媒体
   - 填写时长、轮次、参与人数等信息
   - 添加硬件、软件、物料需求（每行一项）
   - 填写注意事项
  
6. 点击"发布"（Publish）使内容生效

7. **查看系统ID**:
   - 发布内容后，您可以在条目列表或编辑界面查看系统ID
   - 系统ID通常显示在URL中或内容信息面板
   - 格式类似: `6KE8RF7xEO6AmSu48GK2CS`

## 4. 获取 API 密钥

1. 进入 Settings（设置） > API keys
2. 创建新的 API 密钥或使用默认密钥
3. 记录以下信息：
   - Space ID
   - Content Delivery API - access token

## 5. 环境变量设置

在项目根目录创建 `.env.local` 文件（如果还没有的话），添加以下内容：

```
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=您的_SPACE_ID
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=您的_ACCESS_TOKEN
```

## 6. 验证设置

1. 重启开发服务器
2. 访问活动列表页面和活动方案库页面
3. 确认：
   - 活动列表正确显示
   - 活动方案库正确显示
   - 富文本内容正确渲染
   - 图片正确加载
   - 分类筛选功能正常工作
   - URL格式符合预期 (例如: `/activities-library/6KE8RF7xEO6AmSu48GK2CS`)

## 7. 内容管理最佳实践

1. **分类标准化**：
   - 为活动方案创建一套统一的分类标准
   - 避免创建过于相似的分类
   - 保持分类名称简洁明了
   
2. **富文本格式**：
   - 使用标题层级（H2、H3）组织内容结构
   - 使用列表呈现步骤或条款
   - 适当使用粗体强调重要信息
   - 插入的图片应当与文本内容相关
   
3. **内容质量**：
   - 确保活动方案描述清晰、完整
   - 定期审查和更新活动方案
   - 移除过时或不再相关的内容
   - 保持封面图风格的一致性

## 注意事项

1. 富文本编辑器支持：
   - 标题（H1-H3）
   - 文本格式化（粗体、斜体、下划线）
   - 段落样式
   - 列表
   - 链接

2. 图片处理：
   - 建议使用统一的图片尺寸
   - 图片 URL 应该是可公开访问的
   - 可以使用 Contentful 的媒体管理功能

3. 内容管理：
   - 定期备份内容
   - 在发布前预览内容
   - 使用适当的内容分类

## 故障排除

如果遇到问题：

1. 确认环境变量正确设置
2. 检查 API 密钥权限
3. 验证内容模型字段名称
4. 查看浏览器控制台错误信息
5. 对于活动方案库页面的分类筛选问题，检查：
   - 类别名称是否一致
   - Contentful中的分类字段是否正确设置为多值
   - 客户端筛选代码是否正确处理分类数组

## 本地开发

如果环境变量未设置，系统将使用模拟数据进行开发。要切换到实际数据：

1. 确保 `.env.local` 文件存在
2. 环境变量正确设置
3. 重启开发服务器

## 安全注意事项

1. 不要在代码中硬编码 API 密钥
2. 使用环境变量管理敏感信息
3. 定期更新 API 密钥
4. 设置适当的 API 密钥权限 