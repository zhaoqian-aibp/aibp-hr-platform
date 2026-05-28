import { Link } from 'react-router'
import { Radar, Puzzle, BookOpen, Image, ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-3xl" />
        <div className="relative text-center space-y-6 px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" /> AI × HR 正在发生
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            让每个人都能用 AI<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              把工作做得更好
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            聚合前沿情报，沉淀实战技能。AIBP 为人力资源从业者打造一站式的 AI 赋能平台。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              <Radar className="w-5 h-5" /> 进入情报中心
            </Link>
            <Link
              to="/skillhub"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white/70 border border-white/10 hover:bg-white/15 transition-all"
            >
              <Puzzle className="w-5 h-5" /> 探索 SkillHub
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-6">
        <div className="bg-[#12121f] rounded-2xl p-8 text-center border border-white/5">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">50+</div>
          <div className="mt-2 text-white/40 text-sm font-medium">精选 AI 技能</div>
        </div>
        <div className="bg-[#12121f] rounded-2xl p-8 text-center border border-white/5">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">200+</div>
          <div className="mt-2 text-white/40 text-sm font-medium">情报文章</div>
        </div>
        <div className="bg-[#12121f] rounded-2xl p-8 text-center border border-white/5">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">3,000+</div>
          <div className="mt-2 text-white/40 text-sm font-medium">HR 从业者</div>
        </div>
      </section>

      {/* Two Core Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-white">两大核心能力</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Intelligence */}
          <Link to="/insights" className="group bg-[#12121f] rounded-2xl p-8 border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <Radar className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">情报中心</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              实时追踪 AI 在 HR 领域的最新动态。从政策解读到工具评测，从行业案例到学术前沿，助你保持信息领先。
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
              进入情报中心 <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* SkillHub */}
          <Link to="/skillhub" className="group bg-[#12121f] rounded-2xl p-8 border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Puzzle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">SkillHub</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              像应用市场一样发现和安装 AI 技能。招聘分析、培训设计、绩效诊断——每个技能都能直接在你的 AI 助手中运行。
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
              探索技能集市 <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Other Modules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/knowledge" className="group bg-[#12121f] rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white">知识库</h3>
          </div>
          <p className="text-white/40 text-sm">HR 实用问答型知识库，涵盖政策法规、操作流程、最佳实践</p>
        </Link>
        <Link to="/poster" className="group bg-[#12121f] rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Image className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white">海报制作</h3>
          </div>
          <p className="text-white/40 text-sm">AI 一键生成 HR 海报——内推、培训、活动、节日、通知公告</p>
        </Link>
      </section>

      {/* Recent Insights Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">最新情报</h2>
          <Link to="/insights" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="space-y-3">
          {[
            { title: 'OpenAI 发布 GPT-5：HR 领域的 5 个应用场景', tag: '大模型', time: '2小时前' },
            { title: '2026 年 AI+HR 行业趋势报告：招聘智能化增速 300%', tag: '行业趋势', time: '1天前' },
            { title: '谷歌推出 AI 培训助手，企业培训成本降低 40%', tag: '工具评测', time: '3天前' },
          ].map((item, i) => (
            <div key={i} className="bg-[#12121f] rounded-xl p-4 border border-white/5 hover:border-purple-500/20 transition-all flex items-center gap-4">
              <span className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-medium shrink-0">{item.tag}</span>
              <span className="text-white/70 text-sm flex-1">{item.title}</span>
              <span className="text-white/30 text-xs shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}