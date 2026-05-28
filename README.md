# AIBP — AI × HR Platform

人力资源从业者的一站式 AI 赋能平台。聚合前沿情报，沉淀实战技能。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 核心模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 数据总览 + 导航入口 |
| 情报中心 | `/insights` | AI×HR 行业文章聚合 |
| SkillHub | `/skillhub` | HR AI 技能发现与安装 |
| 知识库 | `/knowledge` | HR 专业问答知识库 |
| 海报制作 | `/poster` | AI 一键生成 HR 海报 |
| 登录 | `/login` | 微信扫码 / 账号登录 |

## 技术栈

- React 18 + Vite 7 + TypeScript
- shadcn/ui + TailwindCSS 4
- react-router v7 + Zustand
- 风格：Modern Warm SaaS（暖米色 #F9F7F2 + 深森林绿 #2E5C55 + 活力橙 #FF8A65）

## 构建与部署

```bash
npm run build    # 生产构建
npm run preview  # 本地预览构建产物
```

## 后续规划

- Supabase 数据库接入
- 通义万相 API 海报生成
- 微信 OAuth 登录
- 公网部署