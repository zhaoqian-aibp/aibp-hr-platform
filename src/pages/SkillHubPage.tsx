import { useState, useMemo } from 'react'
import { Puzzle, Search, Copy, Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router'
import skills from '@/data/skills.json'

const categories = ['全部', '招聘', '培训发展', '数据分析', '文化组织']

const skillPrompts: Record<number, string> = {
  1: `你是 AI-HR 新闻摘要助手。每周自动抓取 AI 在 HR 领域的最新新闻，生成 3-5 条精华摘要。

工作流程：
1. 搜索本周 AI×HR 相关新闻（关键词：AI招聘、AI绩效、HR SaaS、组织变革等）
2. 每条新闻提取：标题、来源、核心观点、对HR的启发
3. 按重要性排序（★★★★★ 五级评分）
4. 格式化为飞书/企微群消息格式

输出格式：
📌 【第X条】标题
来源：xxx | 重要性：★★★★
摘要：一句话概括
HRBP启发：对招聘流程/员工体验/组织治理的影响

开始工作：请帮我抓取本周 AI×HR 新闻摘要。`,

  2: `你是 AI 面试助手，根据 JD 和候选人简历自动生成定制化面试问题。

输入要求：
- JD 内容（岗位职责+任职要求）
- 候选人简历
- 面试模式选择：行为面试法(STAR) / 情景模拟

输出格式：
🎯 面试问题清单（基于[候选人姓名]的[岗位名称]面试）

【行为面试题】
1. [基于JD某能力维度+简历某经历]
   - 追问方向：...
   - 评分锚定：优秀/合格/不合格的行为证据

【情景模拟题】
1. [模拟真实工作场景]
   - 期望回答要点：...

【评估建议】
- 重点观察维度：...
- 潜在风险点：...

开始工作：请帮我生成面试问题。`,

  3: `你是 HR 数据看板助手，连接数据源生成多维可视化看板。

支持看板类型：
1. 招聘漏斗看板（投递→初筛→面试→offer→入职）
2. 离职率分析看板（按部门/职级/司龄维度）
3. 人效对比看板（人均产出/人均成本/ROI）

输出格式：
📊 [看板类型] 数据看板

| 维度 | 指标1 | 指标2 | 同比变化 |
|------|-------|-------|---------|
| ... | ... | ... | ... |

📌 关键发现：
1. ...
2. ...

💡 HRBP行动建议：
1. ...
2. ...

开始工作：请帮我生成 [看板类型] 数据看板。`,

  4: `你是 JD 智能生成器，根据岗位信息自动生成结构化 JD。

输入要求：
- 岗位名称
- 所属部门
- 职级范围
- 核心职责（3-5条关键词）
- 任职要求（硬性条件+加分项）

JD风格选择：
1. 专业严谨（适合管理层岗位）
2. 活泼有趣（适合年轻团队/创意岗位）
3. 简洁干练（适合技术岗位）

输出格式包含：
- 岗位标题+副标题（吸引点）
- 关于我们（公司亮点，2-3句）
- 你将要做什么（职责描述，行为化表达）
- 我们期待你（任职要求，分级表述）
- 你将获得（福利亮点+发展空间）
- 加入方式（联系方式/投递渠道）

开始工作：请帮我生成一份 [岗位名称] 的 JD。`,

  5: `你是人员分析报告助手，根据公司人员数据进行多维度分析。

分析维度：
- 部门分布（人数、占比、同比变化）
- 序列分析（技术/产品/运营/管理序列对比）
- 职级结构（金字塔形状是否健康）
- 年龄/司龄分布（是否存在结构性风险）
- 性别比例（是否符合多元化目标）

输出格式：
📋 人员分析报告（[时间范围]）

【总览】总人数 xxx | 同比变化 xxx%
【部门分布】表格+关键发现
【序列分析】表格+关键发现
【职级结构】表格+关键发现
【风险提示】...
【优化建议】...

开始工作：请帮我分析公司人员数据。`,

  6: `你是员工访谈分析助手，导入访谈内容后自动提取关键信息。

分析维度：
1. 情感倾向分析（正面/负面/中性比例）
2. 关键主题提取（自动聚类访谈话题）
3. 高频词汇统计（词频Top20）
4. 核心观点汇总（按主题归类）
5. 行动建议生成（基于访谈发现）

输出格式：
💬 员工访谈分析报告

【情感分析】正面 xx% | 负面 xx% | 中性 xx%
【关键主题】主题1(频次) | 主题2(频次) | ...
【高频词汇】词汇1(频次) | 词汇2(频次) | ...
【核心观点】按主题归类的关键洞察
【行动建议】3-5条具体可执行的建议

开始工作：请帮我分析员工访谈内容。`,

  7: `你是薪酬对标分析助手，提供实时薪酬数据和策略建议。

分析能力：
1. 岗位薪酬对标（行业/地区/职级三维度）
2. 薪酬竞争力评估（P25/P50/P75分位分析）
3. 薪酬结构调整建议
4. 保留风险评估（薪酬低于P25的人员清单）

输出格式：
💰 薪酬对标分析报告

【岗位】xxx | 【地区】xxx | 【行业】xxx

| 分位 | 基本薪资 | 总包 | 我们的位置 |
|------|---------|------|-----------|
| P25 | ... | ... | ... |
| P50 | ... | ... | ... |
| P75 | ... | ... | ... |

📌 关键发现：
💡 薪酬策略建议：

开始工作：请帮我做薪酬对标分析。`,

  8: `你是培训体系搭建助手，引导从零搭建完整培训体系。

搭建阶段：
Phase 1 需求分析：组织能力gap→岗位能力gap→培训需求清单
Phase 2 课程设计：通用课(企业文化/合规/沟通)+专业课(岗位技能)+管理课(领导力)
Phase 3 讲师体系：内部讲师选拔标准+培养路径+激励方案
Phase 4 平台选择：LMS对比(功能/价格/集成)+企微/飞书方案
Phase 5 效果评估：训后评估→行为改变→业务结果 三层评估模型

输出格式：
🎓 培训体系搭建方案

1. 【需求分析】优先级排序的培训需求清单
2. 【课程体系】课程地图+必修/选修机制
3. 【讲师体系】选拔/培养/激励全方案
4. 【预算估算】各模块预算参考
5. 【落地路线】3个月/6个月/12个月里程碑

开始工作：请帮我搭建培训体系。`,
}

export default function SkillHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSkill, setExpandedSkill] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    return skills.filter(s => {
      const catMatch = selectedCategory === '全部' || s.category === selectedCategory
      const searchMatch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())
      return catMatch && searchMatch
    })
  }, [selectedCategory, searchQuery])

  const handleCopy = (skillId: number) => {
    const prompt = skillPrompts[skillId]
    if (prompt) {
      navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Puzzle className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-extrabold text-white">SkillHub</h1>
      </div>
      <p className="text-white/40 text-sm leading-relaxed">
        每个 Skill 是一段经过验证的 AI 提示词，专为 HR 场景设计。<br />
        使用方式：<span className="text-white/60">点击展开 → 查看提示词 → 复制粘贴到任意 AI 助手，或点「去使用」跳到 AI 问答页面直接对话。</span>
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索技能名称、描述..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/50" />
      </div>

      {/* Skills Cards */}
      <div className="space-y-4">
        {filtered.map(skill => (
          <div key={skill.id}
            className="bg-[#1a1a2e] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
            {/* Card header - always visible */}
            <div className="p-6 cursor-pointer" onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}>
              <div className="flex items-center gap-4">
                <div className="text-2xl shrink-0">{skill.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-base">{skill.name}</h3>
                    <span className="text-blue-400/60 text-xs px-2 py-0.5 rounded-full bg-blue-500/10">{skill.category}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">by {skill.author}</p>
                  <p className="text-white/50 text-sm mt-2">{skill.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {expandedSkill !== skill.id && (
                    <button onClick={(e) => { e.stopPropagation(); sessionStorage.setItem('aibp_skill_prompt', skillPrompts[skill.id] || ''); sessionStorage.setItem('aibp_skill_id', String(skill.id)); navigate('/knowledge') }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                      <ArrowRight className="w-4 h-4 inline mr-1" /> 去使用
                    </button>
                  )}
                  {expandedSkill === skill.id ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {expandedSkill === skill.id && (
              <div className="px-6 pb-6 pt-0 border-t border-white/5">
                <h4 className="text-white/60 text-sm font-medium mb-2">💡 什么是 Skill？怎么用？</h4>
                <p className="text-white/40 text-xs mb-4 leading-relaxed">
                  Skill 是一段预设的 AI 提示词，定义了 AI 的角色、工作流程和输出格式。有两种使用方式：
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/60 text-xs font-medium mb-1">方式一：在本站使用</p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      点「去使用」→ 跳到 AI 问答页面 → 填写输入面板（JD、简历等，支持上传文件）→ 点「开始分析」→ 获得结果
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-white/60 text-xs font-medium mb-1">方式二：复制到其他 AI</p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      点「复制提示词」→ 粘贴到 ChatGPT / Kimi / 飞书AI 等任意 AI 助手 → 按提示词指引提问
                    </p>
                  </div>
                </div>

                <h4 className="text-white/60 text-sm font-medium mb-2">📝 提示词内容</h4>
                <div className="bg-[#12121f] rounded-xl p-4 text-white/60 text-sm whitespace-pre-wrap leading-relaxed border border-white/5 mb-4">
                  {skillPrompts[skill.id]}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => handleCopy(skill.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制提示词'}
                  </button>
                  <button onClick={() => { sessionStorage.setItem('aibp_skill_prompt', skillPrompts[skill.id] || ''); sessionStorage.setItem('aibp_skill_id', String(skill.id)); navigate('/knowledge') }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" /> 去使用（跳到 AI 问答）
                  </button>
                  <span className="text-white/20 text-xs">复制提示词 → 粘贴到 ChatGPT / 飞书AI / Kimi 等任意 AI 助手</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/20">暂无相关技能</div>
        )}
      </div>
    </div>
  )
}