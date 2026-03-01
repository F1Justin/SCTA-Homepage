# 上海高校东方联合会主页 - 东方Project

这是上海高校东方联合会（上海高校东方Project同好会联盟）的官方网站，旨在展示联合会的介绍、活动、成员社团等信息。

## 网站内容

- 联合会介绍与宗旨
- 东方Project相关活动展示
- 各高校东方Project社团展示
- 联系与加入方式

## 特点

- 响应式设计，适配各种屏幕尺寸
- 现代化的用户界面，美观简洁
- 流畅的页面过渡和交互动效
- 活动展示和详情页面
- 成员社团展示

## 技术栈

- Next.js - React框架
- TypeScript - 类型安全的JavaScript
- Tailwind CSS - 实用优先的CSS框架
- Framer Motion - 动画库

## 关于东方Project

东方Project（东方プロジェクト）是由日本同人游戏社团"上海アリス幻樂団"（Shanghai Alice Fantasy Factory，上海爱丽丝幻乐团）的ZUN独立制作的一系列弹幕射击游戏。自1996年第一作发布以来，已有数十部作品，拥有庞大的世界观和丰富的角色，在全球范围内拥有众多爱好者，衍生出大量的同人作品，包括音乐、漫画、小说、动画等。

## 开发

确保您已安装 Node.js (>= 14.x)

1. 克隆仓库
```bash
git clone https://github.com/scta-sh/scta-homepage.git
cd scta-homepage
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 构建与部署

1. 构建生产版本
```bash
npm run build
```

2. 本地预览生产版本
```bash
npm run start
```

该项目可以轻松部署到Vercel平台。

## 项目结构

```
scta-homepage/
├── content/         # 内容数据 (Markdown)
│   ├── activities/  # 活动内容
│   └── blueprints/  # 活动方案内容
├── public/          # 静态资源
│   ├── content/     # 内容相关图片
│   ├── Logos/       # 联合会Logo
│   └── School-Logos/ # 学校Logo
├── src/
│   ├── app/         # Next.js应用页面
│   ├── components/  # 可复用组件
│   ├── data/        # 数据文件
│   ├── lib/         # 内容读取层
│   └── styles/      # 全局样式
├── package.json
└── README.md
```

## 内容管理

活动和方案内容以 Markdown 文件存储在 `content/` 目录中。编辑内容后 push 到 GitHub，Vercel 会自动构建部署。

### 从 Contentful 导出内容

`scripts/export-contentful.mjs` 脚本用于将 Contentful 数据一次性导出为本地 Markdown 文件并下载图片。

**⚠️ 注意：运行前请确保 Contentful API 令牌已轮换（原令牌曾泄露，需在 Contentful 控制台撤销并重新生成）。**

1. 复制 `.env.example` 为 `.env` 并填入你的 Contentful 凭据：
   ```bash
   cp .env.example .env
   # 编辑 .env，填入 CONTENTFUL_SPACE_ID 和 CONTENTFUL_ACCESS_TOKEN
   ```
2. 运行导出脚本（需要 `dotenv-cli`）：
   ```bash
   npx dotenv -e .env -- node scripts/export-contentful.mjs
   ```
   或直接通过环境变量传入：
   ```bash
   CONTENTFUL_SPACE_ID=xxx CONTENTFUL_ACCESS_TOKEN=yyy node scripts/export-contentful.mjs
   ```

`.env` 文件已被 `.gitignore` 排除，**请勿将真实凭据提交到 git**。


## 许可

© 2025 上海高校东方联合会. 保留所有权利. 
