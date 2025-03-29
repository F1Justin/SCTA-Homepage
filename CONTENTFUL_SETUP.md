# Contentful 设置指南

本指南将帮助您设置 Contentful 内容管理系统，以便管理网站的活动内容。

## 1. 创建 Contentful 账户和空间

1. 访问 [Contentful 官网](https://www.contentful.com/) 并注册账户
2. 创建新的空间（Space）
3. 选择"空白空间"（Empty Space）模板

## 2. 创建内容模型

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

### 富文本字段（description）设置：

1. 在 description 字段的设置中，启用以下功能：
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

1. 进入 Content（内容）页面
2. 点击 "Add entry"（添加条目）
3. 选择 "Activity" 内容类型
4. 填写示例活动信息：
   - 使用富文本编辑器编写描述
   - 可以添加标题、格式化文本等
   - 在描述中插入相关图片
   - 确保填写所有必需字段

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
2. 访问活动列表页面
3. 确认：
   - 活动列表正确显示
   - 富文本内容正确渲染
   - 图片正确加载

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