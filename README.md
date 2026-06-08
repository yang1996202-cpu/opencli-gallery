# OpenCLI Gallery

> OpenCLI 站点可视化目录。162 个站点 · 1050 条命令 · 按场景分类浏览。

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-live-success?logo=cloudflarepages)](https://opencli-gallery.pages.dev)

## 在线预览

🔗 **https://opencli-gallery.pages.dev**

> 162 个站点 · 1050 条命令 · 按场景分类浏览

## 功能

- **16 大场景分类** — 社交内容、AI 工具、求职招聘、开发技术、金融数据……一键筛选
- **实时搜索** — 搜站点名、命令名、描述，即时过滤
- **卡片网格** — 暗色主题，悬停动效，命令数、登录状态一目了然
- **详情弹窗** — 点卡片查看该站点全部命令，含完整描述和示例
- **自动同步** — GitHub Actions 每周一自动拉取 OpenCLI 最新站点数据

## 技术栈

- Vue 3 + TypeScript + Vite
- 纯 CSS，无 UI 框架
- Cloudflare Pages 部署

## 自动化

**数据同步**（每周一 03:00 UTC，自动）：
```
GitHub Actions → opencli list -f json → commit data.json
```

**生产部署**（手动触发）：
```
Actions 页面 → Deploy → Run workflow
```
或本地执行 `npm run build && npx wrangler pages deploy dist`

OpenCLI 每新增一个站点，下周一数据自动更新，手动部署后网站刷新。

## 本地开发

```bash
cd opencli-gallery
npm install
npm run dev
```

手动同步数据：

```bash
npm run sync   # 运行 opencli list -f json > public/data.json
```

## 分类映射

| 分类 | 代表站点 |
|------|---------|
| 社交内容 | Twitter/X、微博、小红书、知乎、即刻、V2EX、Linux.do |
| AI 工具 | Claude、ChatGPT、Cursor、Gemini、DeepSeek、Kimi |
| 求职招聘 | Boss直聘、LinkedIn、51job、牛客网 |
| 开发技术 | GitHub、StackOverflow、npm、PyPI、MDN |
| 金融数据 | 东方财富、雪球、Binance、CoinGecko |
| 学术科研 | arXiv、PubMed、知网、Google Scholar |
| 视频音乐 | B站、YouTube、抖音、小宇宙、Spotify |
| 电商消费 | 淘宝、京东、闲鱼、Amazon、1688 |
| 生活出行 | 12306、携程、链家、天气 |
| 效率办公 | 微信读书、幕布、Flomo、Confluence |
| 游戏娱乐 | Steam、Chess.com、IMDb、Pixiv |
| 桌面控制 | Cursor、Codex、ChatGPT App、Discord App |
| 新闻资讯 | HackerNews、36氪、BBC、ProductHunt |
| 政务法律 | 中国政府法规、中国政府政策 |
| 其他工具 | Web Reader、Dictionary、Wikipedia |

## License

MIT
