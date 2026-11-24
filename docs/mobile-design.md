# SCTA 移动端设计

访问者通常从群聊、活动分享或搜索进入。首页负责交代联合会是什么，活动页负责快速识别海报、日期和活动名。长文、QQ群介绍和徽章操作各自在对应页面或弹窗展开。

## 参考界面

参考截图沿真实屏幕边缘裁切到相同的 390 px 宽度。以下尺寸是截图读数，取整后用于构图比较。

| 场景 | 截图来源与时间 | 观察 |
| --- | --- | --- |
| Instagram Explore 与账户媒体网格 | Explore 取自欧盟案卷图 2，原画面采于 2022-09。另在 2026-11-24 查看 Instagram 官方账户的移动 Web 页面，公开网格可见并有登录浮层 | 三列、近 2 px 细缝和少量文字让图像占主导。统一缩略图可以快速浏览，边缘文字会被裁掉 |
| 小红书发现与搜索 | RedNote Studio 的发现页画面，以及 Bellingcat 2026-04-20 记录的发现、搜索和语言场景 | 发现页截图两列约 189 px，列缝约 5 px。图下用标题和低对比的作者行收束卡片，图高在列内自然变化 |
| Pinterest Discover | Pinterest 2023 年 Investor Day 第 32 页的 Discover 原画面。对照 2026-11-24 查看时的官方应用商店截图 | 两列约 180–185 px。错落的图高与窄缝使滚动时始终有一部分下一张图片可见 |
| Behance Galleries 与 Gallery Mode | Adobe Google Play 商店页，标注更新于 2026-08-13。详情图参考 Behance 的 2022-08 iOS 更新页 | Galleries 的封面约 172 px 宽、列缝约 12 px。详情将作品展示与正文阅读拆成各自清楚的阶段 |

来源 [Instagram Explore 图 2](https://ec.europa.eu/competition/antitrust/cases1/202513/AT_40684_10582539_13405_4.pdf) · [Instagram 官方账户](https://www.instagram.com/instagram/) · [RedNote Studio](https://www.rednotestudio.com/blog/-rednote-layout) · [Bellingcat 小红书实测](https://www.bellingcat.com/resources/2026/04/20/xiaohongshu-rednote-open-source-guide/) · [Pinterest Investor Day](https://d18rn0p25nwr6d.cloudfront.net/CIK-0001506293/87682f59-ea65-4b0b-928f-bc1bcf0bb3de.pdf) · [Pinterest 商店页](https://apps.apple.com/us/app/pinterest/id429047995) · [Behance 商店页](https://play.google.com/store/apps/details?id=com.behance.behance) · [Behance Gallery Mode](https://www.behance.net/blog/behance-ios-app-august-2022-update)

触控入口在手机上以 44 CSS px 为目标，文字允许放大和重排。短横屏压缩装饰空间并保留标题和操作。校验采用 WCAG 2.2 的 320 CSS px 重排、200% 文字缩放、普通文字 4.5:1 对比度和 24 CSS px 最低目标尺寸。44 px 触控目标参照 Apple HIG，紧凑视口使用独立排布参照 Material 的自适应布局原则。 [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography) · [Apple Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3) · [Android 自适应布局](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes) · [Android 触控目标](https://developer.android.com/guide/topics/ui/accessibility/apps) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 候选与选择

三种候选使用相同的 28 张海报和标题，在 320、390、430 px 运行。390 px 比较采用 844 px 高的同一视口。

| 候选 | 390 px 海报宽 | 首屏可见卡片 | 取舍 |
| --- | ---: | ---: | --- |
| 定比例展墙 | 181 px | 6 | 4:5 裁切使长海报的活动文字和底部元素消失。单行标题截断了 10 条 |
| 原比例双列 | 178 px | 4 | 内边距 12 px、列缝 10 px。标题、类型、日期移到图下，第二排约在 y=524–530 px 出现 |
| 单列编辑式 | 350 px | 2 | 完整容纳海报，但窄长原图两侧留白，浏览同批活动需要更长的滚动距离 |

选择原比例双列。原版 390 px 列宽 171 px，带 16 px 外边距。新版通过收紧留白给海报多 7 px，纵向保持真实比例。标题在图下最多两行，链接的可访问名称和活动详情仍提供完整标题。首页的查看更多进入正常文档流，六张海报均可点击。桌面保留三列、旧间距、按钮覆盖与渐隐。

独立走查发现短横屏英文标题裁切、320 px 英文首页按钮位置过低、浅色蓝字和暗色红字对比度不足，以及卡片标题重复朗读。复核后，短屏把操作放在标题与正文之间，移动详情把标题和日期提前到海报之前，移动主题使用对比度更高的前景色。封面与相邻标题共用一个可访问名称。菜单和学校弹窗使用原生模态焦点，徽章沿用原来的艺术呈现，支持横向触屏拖动和键盘旋转。

参考原图、归一化截图、候选截图和独立走查记录随验收证据保留。
