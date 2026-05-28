# AGENTS.md

## 项目概述
AIBP（AI × HR Platform）— 人力资源从业者的一站式 AI 赋能平台。包含情报中心、技能集市、知识库、海报制作四大核心模块。

## 技术栈
- 框架：React + Vite + TypeScript
- UI：shadcn/ui + TailwindCSS
- 状态管理：Zustand
- 路由：react-router v7
- 风格：Modern Warm SaaS & Organic Doodle（暖色调大地色系）
  - 背景色：#F9F7F2（暖米色）
  - 主色：#2E5C55（深森林绿）
  - 强调色：#FF8A65（活力橙）
  - 文字色：#1A1A1A

## 当前模块
- `/` 首页（数据总览 + 导航）
- `/insights` 情报中心（文章列表 + 分类 + 搜索）
- `/skillhub` SkillHub（技能发现 + 分类 + 排序）
- `/knowledge` 知识库（问答列表 + 搜索 + 折叠展开）
- `/poster` 海报制作器（类型选择 + 风格选择 + 需求描述 + AI 生成）
- `/login` 登录页（微信扫码 / 账号登录）

## 后续规划
- [ ] 接入 Supabase（用户认证 + 数据存储）
- [ ] 接入通义万相 API（海报真实生成）
- [ ] 微信 OAuth 登录接入
- [ ] 情报数据源接入（公众号、RSS 等）
- [ ] 部署到公网服务器

## 注意事项
- 当前所有数据为 mock 数据，后续需要接入真实后端
- 海报生成目前是 mock 延迟 + placeholder 图片，需接入通义万相 API
- 登录功能尚未接入真实认证系统