import { useState, useRef, useEffect } from 'react'
import { BookOpen, Send, Plus, Copy, Check, Sparkles, User, Bot, FileText, X, Puzzle, ChevronDown } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface SkillDef {
  id: number
  name: string
  icon: string
  prompt: string
  needsInput: boolean
  inputFields?: { label: string; key: string; placeholder?: string; type?: 'text' | 'textarea' | 'select'; options?: string[] }[]
}

const skills: SkillDef[] = [
  {
    id: 1, name: 'AI-HR新闻摘要', icon: '📡',
    prompt: `你是 AI-HR 新闻摘要助手。每周自动抓取 AI 在 HR 领域的最新新闻，生成 3-5 条精华摘要。\n\n工作流程：\n1. 搜索本周 AI×HR 相关新闻\n2. 每条提取：标题、来源、核心观点、对HR的启发\n3. 按重要性排序（★★★★★）\n4. 格式化为飞书/企微群消息格式\n\n输出格式：\n📌 【第X条】标题\n来源：xxx | 重要性：★★★★\n摘要：一句话概括\nHRBP启发：...\n\n开始工作：`,
    needsInput: false,
  },
  {
    id: 2, name: 'AI面试助手', icon: '🤖',
    prompt: `你是 AI 面试助手，根据 JD 和候选人简历自动生成定制化面试问题。\n\n输入要求：\n- JD 内容（岗位职责+任职要求）\n- 候选人简历\n- 面试模式选择：行为面试法(STAR) / 情景模拟\n\n输出格式：\n🎯 面试问题清单\n【行为面试题】\n1. [基于JD能力维度+简历经历]\n   - 追问方向...\n   - 评分锚定...\n\n【情景模拟题】\n1. [模拟真实工作场景]\n   - 期望回答要点...\n\n【评估建议】\n- 重点观察维度...\n- 潜在风险点...\n\n开始工作：`,
    needsInput: true,
    inputFields: [
      { label: '岗位 JD', key: 'jd', placeholder: '粘贴 JD 内容', type: 'textarea' },
      { label: '候选人简历', key: 'resume', placeholder: '粘贴简历内容', type: 'textarea' },
      { label: '面试模式', key: 'mode', type: 'select', options: ['行为面试法(STAR)', '情景模拟', '两者结合'] },
    ],
  },
  {
    id: 3, name: 'HR数据看板', icon: '📊',
    prompt: `你是 HR 数据看板助手，连接数据源生成多维可视化看板。\n\n支持看板类型：\n1. 招聘漏斗看板（投递→初筛→面试→offer→入职）\n2. 离职率分析看板（按部门/职级/司龄维度）\n3. 人效对比看板（人均产出/人均成本/ROI）\n\n输出格式：\n📊 [看板类型] 数据看板\n| 维度 | 指标1 | 指标2 | 同比变化 |\n|------|-------|-------|---------|\n\n📌 关键发现\n💡 HRBP行动建议\n\n开始工作：`,
    needsInput: true,
    inputFields: [
      { label: '看板类型', key: 'type', type: 'select', options: ['招聘漏斗看板', '离职率分析看板', '人效对比看板'] },
    ],
  },
  {
    id: 4, name: 'JD智能生成器', icon: '🎯',
    prompt: `你是 JD 智能生成器，根据岗位信息自动生成结构化 JD。\n\n输入要求：\n- 岗位名称\n- 所属部门\n- 职级范围\n- 核心职责（3-5条关键词）\n- 任职要求（硬性条件+加分项）\n\nJD风格选择：\n1. 专业严谨（适合管理层岗位）\n2. 活泼有趣（适合年轻团队/创意岗位）\n3. 简洁干练（适合技术岗位）\n\n输出格式包含：\n- 岗位标题+副标题\n- 关于我们\n- 你将要做什么\n- 我们期待你\n- 你将获得\n- 加入方式\n\n开始工作：`,
    needsInput: true,
    inputFields: [
      { label: '岗位名称', key: 'title', placeholder: '如：高级产品经理', type: 'text' },
      { label: '所属部门', key: 'dept', placeholder: '如：产品部', type: 'text' },
      { label: '职级范围', key: 'level', placeholder: '如：P6-P7', type: 'text' },
      { label: '核心职责', key: 'duties', placeholder: '3-5条关键词', type: 'textarea' },
      { label: 'JD风格', key: 'style', type: 'select', options: ['专业严谨', '活泼有趣', '简洁干练'] },
    ],
  },
  {
    id: 5, name: '人员分析报告', icon: '📋',
    prompt: `你是人员分析报告助手，根据公司人员数据进行多维度分析。\n\n分析维度：\n- 部门分布（人数、占比、同比变化）\n- 序列分析（技术/产品/运营/管理序列对比）\n- 职级结构（金字塔形状是否健康）\n- 年龄/司龄分布（是否存在结构性风险）\n- 性别比例（是否符合多元化目标）\n\n输出格式：\n📋 人员分析报告\n【总览】总人数 xxx | 同比变化 xxx%\n【部门分布】表格+关键发现\n【序列分析】表格+关键发现\n【职级结构】表格+关键发现\n【风险提示】...\n【优化建议】...\n\n开始工作：`,
    needsInput: false,
  },
  {
    id: 6, name: '员工访谈分析', icon: '💬',
    prompt: `你是员工访谈分析助手，导入访谈内容后自动提取关键信息。\n\n分析维度：\n1. 情感倾向分析（正面/负面/中性比例）\n2. 关键主题提取（自动聚类访谈话题）\n3. 高频词汇统计（词频Top20）\n4. 核心观点汇总（按主题归类）\n5. 行动建议生成（基于访谈发现）\n\n输出格式：\n💬 员工访谈分析报告\n【情感分析】正面 xx% | 负面 xx% | 中性 xx%\n【关键主题】主题1(频次) | ...\n【高频词汇】词汇1(频次) | ...\n【核心观点】按主题归类的关键洞察\n【行动建议】3-5条具体可执行的建议\n\n开始工作：`,
    needsInput: true,
    inputFields: [
      { label: '访谈内容', key: 'content', placeholder: '粘贴访谈记录', type: 'textarea' },
    ],
  },
  {
    id: 7, name: '薪酬对标分析', icon: '💰',
    prompt: `你是薪酬对标分析助手，提供实时薪酬数据和策略建议。\n\n分析能力：\n1. 岗位薪酬对标（行业/地区/职级三维度）\n2. 薪酬竞争力评估（P25/P50/P75分位分析）\n3. 薪酬结构调整建议\n4. 保留风险评估（薪酬低于P25的人员清单）\n\n输出格式：\n💰 薪酬对标分析报告\n【岗位】xxx | 【地区】xxx | 【行业】xxx\n| 分位 | 基本薪资 | 总包 | 我们的位置 |\n|------|---------|------|-----------|\n| P25 | ... | ... | ... |\n| P50 | ... | ... | ... |\n| P75 | ... | ... | ... |\n\n📌 关键发现\n💡 薪酬策略建议\n\n开始工作：`,
    needsInput: true,
    inputFields: [
      { label: '岗位', key: 'position', placeholder: '如：高级产品经理', type: 'text' },
      { label: '地区', key: 'city', type: 'select', options: ['北京', '上海', '深圳', '广州', '杭州', '成都'] },
      { label: '行业', key: 'industry', type: 'select', options: ['互联网/AI', '金融', '制造业', '零售', '医疗', '教育'] },
      { label: '当前薪资（月薪K）', key: 'current_salary', placeholder: '如：32', type: 'text' },
    ],
  },
  {
    id: 8, name: '培训体系搭建', icon: '🎓',
    prompt: `你是培训体系搭建助手，引导从零搭建完整培训体系。\n\n搭建阶段：\nPhase 1 需求分析：组织能力gap→岗位能力gap→培训需求清单\nPhase 2 课程设计：通用课+专业课+管理课\nPhase 3 讲师体系：选拔标准+培养路径+激励方案\nPhase 4 平台选择：LMS对比+企微/飞书方案\nPhase 5 效果评估：训后评估→行为改变→业务结果\n\n输出格式：\n🎓 培训体系搭建方案\n1. 【需求分析】...\n2. 【课程体系】...\n3. 【讲师体系】...\n4. 【预算估算】...\n5. 【落地路线】3个月/6个月/12个月里程碑\n\n开始工作：`,
    needsInput: false,
  },
]

const presetQuestions = [
  { label: '招聘面试', question: '如何设计一个有效的结构化面试流程？' },
  { label: '试用期考核', question: '试用期考核标准和转正评估怎么做？' },
  { label: '绩效反馈', question: '如何做一场有建设性的绩效反馈对话？' },
  { label: '组织调整', question: '组织架构调整时如何做好人才安置和沟通？' },
  { label: '培训体系', question: '从零搭建培训体系应该从哪里开始？' },
]

const hrAnswers: Record<string, string> = {
  '招聘面试': `**结构化面试设计指南**

1. **明确岗位关键胜任力**：从JD提炼3-5个核心能力维度
2. **设计行为面试题**：每个维度准备2-3个STAR问题
3. **设定评分标准**：5级评分锚定（1=远低于预期 → 5=超出预期）
4. **面试流程标准化**：开场（5min）→ 能力考察（30min）→ 反向提问（10min）
5. **多人交叉面试**：至少2位面试官独立评分

⚠️ 注意：用行为证据替代直觉判断。`,

  '试用期考核': `**试用期考核与转正评估体系**

1. 入职第1周：明确试用期目标
2. 第30天：中期 check-in
3. 第60天：技能达标评估
4. 第90天：转正评估（业绩+融入+价值观）

💡 试用期考核是持续辅导过程，不是"秋后算账"。`,

  '绩效反馈': `**绩效反馈对话框架**

1. 开场（3min）："这次对话是帮你成长的"
2. 事实陈述（5min）：用数据说话
3. 员工视角（10min）：让对方先说
4. 共建方案（10min）：一起定改进计划
5. 确认收尾（2min）：书面记录共识

❌ "你最近不够积极" → ✅ "上次项目提前2天交付，这次延迟3天，发生了什么？"`,

  '组织调整': `**组织调整指南**

1. 调整前：人才盘点→预案→沟通预演
2. 调整中：先一对一→信息公开→给缓冲期
3. 调整后：持续跟进→角色书面确认→防流失

💡 最大风险不是架构变了，而是人走了。`,

  '培训体系': `**培训体系搭建路线图**

Phase 1（1-3月）：需求调研→框架→制度
Phase 2（3-6月）：讲师体系→课程→平台
Phase 3（6-12月）：常态化→效果追踪→迭代

⚠️ 先聚焦1-2个核心场景，验证有效再扩展。`,
}

// Simple file reader for .txt/.md
async function readFileContent(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'txt' || ext === 'md' || ext === 'csv') {
    return file.text()
  }
  return `[已上传文件：${file.name}]\n⚠️ 暂不支持该格式解析，建议将内容复制粘贴到输入框`
}

export default function KnowledgePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const [activeSkill, setActiveSkill] = useState<SkillDef | null>(null)
  const [showSkillPicker, setShowSkillPicker] = useState(false)
  const [showInputPanel, setShowInputPanel] = useState(false)
  const [skillInputsData, setSkillInputsData] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const skillPickerRef = useRef<HTMLDivElement>(null)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aibp_messages')
    if (saved) {
      try { setMessages(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aibp_messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close skill picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (skillPickerRef.current && !skillPickerRef.current.contains(e.target as Node)) {
        setShowSkillPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectSkill = (skill: SkillDef) => {
    setActiveSkill(skill)
    setShowSkillPicker(false)
    setSkillInputsData({})
    setUploadedFiles({})
    if (skill.needsInput && skill.inputFields) {
      setShowInputPanel(true)
    } else {
      setShowInputPanel(false)
      // For skills without input, just set the prompt and let user type
      setMessages(prev => [...prev, { role: 'user', content: `调用 Skill：${skill.icon} ${skill.name}` }, { role: 'assistant', content: `${skill.icon} ${skill.name} 已就绪，直接提问即可。` }])
    }
  }

  const handleFileUpload = async (key: string, file: File) => {
    const content = await readFileContent(file)
    setSkillInputsData(prev => ({ ...prev, [key]: (prev[key] || '') + '\n' + content }))
    setUploadedFiles(prev => ({ ...prev, [key]: file.name }))
  }

  const handleSkillSubmit = async () => {
    if (!activeSkill) return
    setLoading(true)
    setShowInputPanel(false)

    const inputs = skillInputsData
    const inputSummary = Object.entries(inputs).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v.substring(0, 60)}`).join(' | ')
    
    // Build user message from inputs
    const userContent = inputSummary 
      ? `${activeSkill.icon} ${activeSkill.name} | ${inputSummary}\n\n请根据以上信息，按照 ${activeSkill.name} 的专业框架给出完整分析。`
      : `请按照 ${activeSkill.name} 的专业框架给出回答。`

    setMessages(prev => [...prev, { role: 'user', content: userContent }])
    setSkillInputsData({})
    setUploadedFiles({})

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userContent }],
          skillPrompt: activeSkill.prompt
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'AI 服务暂时不可用，请稍后再试。' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络错误，请稍后再试。' }])
    }
    
    setLoading(false)
  }

  const handleSend = async (text?: string) => {
    const question = text || input
    if (!question.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    // Build conversation history for API
    const apiMessages = [...messages, { role: 'user', content: question }]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10) // Keep last 10 messages for context

    try {
      // Call real AI API
      const apiBase = window.location.hostname.includes('localhost') 
        ? 'http://localhost:3000' 
        : ''  // Same origin for Vercel deployment
      
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          skillPrompt: activeSkill?.prompt || null
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
      } else {
        // Fallback to preset answers if API fails
        let answer = ''
        if (question.includes('面试') || question.includes('招聘')) {
          answer = hrAnswers['招聘面试']
        } else if (question.includes('试用期') || question.includes('转正')) {
          answer = hrAnswers['试用期考核']
        } else if (question.includes('绩效') || question.includes('反馈')) {
          answer = hrAnswers['绩效反馈']
        } else if (question.includes('组织') || question.includes('调整')) {
          answer = hrAnswers['组织调整']
        } else if (question.includes('培训')) {
          answer = hrAnswers['培训体系']
        } else {
          answer = `关于「${question}」暂未覆盖。AI 服务暂时不可用，请稍后再试。`
        }
        setMessages(prev => [...prev, { role: 'assistant', content: answer }])
      }
    } catch {
      // Fallback if network error
      let answer = hrAnswers['招聘面试'] || `关于「${question}」——AI 服务暂时不可用。`
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    }
    
    setLoading(false)
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleNewChat = () => {
    setMessages([])
    setActiveSkill(null)
    setSkillInputsData({})
    setUploadedFiles({})
    setShowInputPanel(false)
    localStorage.removeItem('aibp_messages')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-extrabold text-white">AI 问答</h1>
            {activeSkill && (
              <p className="text-emerald-400/60 text-xs mt-1 flex items-center gap-1">
                <span>{activeSkill.icon}</span> 当前 Skill：{activeSkill.name}
                <button onClick={() => setActiveSkill(null)} className="text-white/30 hover:text-white/50 ml-2">
                  <X className="w-3 h-3" />
                </button>
              </p>
            )}
          </div>
        </div>
        <button onClick={handleNewChat} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/60 text-sm hover:bg-white/15 transition-all">
          <Plus className="w-4 h-4" /> 新会话
        </button>
      </div>

      {/* Skill Input Panel */}
      {showInputPanel && activeSkill?.needsInput && activeSkill.inputFields && (
        <div className="bg-[#1a1a2e] rounded-2xl border border-blue-500/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeSkill.icon}</span>
              <h3 className="text-white/80 font-bold text-sm">{activeSkill.name} — 请提供以下信息</h3>
            </div>
            <button onClick={() => setShowInputPanel(false)} className="text-white/30 hover:text-white/50">
              <X className="w-4 h-4" />
            </button>
          </div>
          {activeSkill.inputFields.map(inp => (
            <div key={inp.key}>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-white/50 text-xs">{inp.label}</label>
                {uploadedFiles[inp.key] && (
                  <span className="text-emerald-400/50 text-xs flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {uploadedFiles[inp.key]}
                    <button onClick={() => { setUploadedFiles(prev => { const n = {...prev}; delete n[inp.key]; return n }) }} className="text-white/30 hover:text-white/50">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              {inp.type === 'textarea' ? (
                <div className="flex gap-2">
                  <textarea value={skillInputsData[inp.key] || ''}
                    onChange={e => setSkillInputsData(prev => ({ ...prev, [inp.key]: e.target.value }))}
                    placeholder={inp.placeholder}
                    rows={3}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 resize-none" />
                  <label className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-white/40 hover:bg-white/15 hover:text-white/60 transition-all cursor-pointer shrink-0 self-end">
                    <input type="file" accept=".txt,.md,.csv" className="hidden"
                      onChange={async (e) => { const file = e.target.files?.[0]; if (file) await handleFileUpload(inp.key, file) }} />
                    <span className="text-sm">📎</span>
                  </label>
                </div>
              ) : inp.type === 'select' ? (
                <select value={skillInputsData[inp.key] || ''}
                  onChange={e => setSkillInputsData(prev => ({ ...prev, [inp.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="" className="bg-[#12121f]">请选择</option>
                  {inp.options?.map(opt => <option key={opt} value={opt} className="bg-[#12121f]">{opt}</option>)}
                </select>
              ) : (
                <input type="text" value={skillInputsData[inp.key] || ''}
                  onChange={e => setSkillInputsData(prev => ({ ...prev, [inp.key]: e.target.value }))}
                  placeholder={inp.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/50" />
              )}
            </div>
          ))}
          <button onClick={handleSkillSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 w-full justify-center ${loading ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'}`}>
            <Send className="w-4 h-4" /> 开始分析
          </button>
        </div>
      )}

      {/* Preset buttons (only when no skill active) */}
      {!activeSkill && (
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map(p => (
            <button key={p.label} onClick={() => handleSend(p.question)}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Chat area */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 min-h-[400px] max-h-[600px] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-[350px] text-white/20">
            <div className="text-center space-y-4">
              <Sparkles className="w-12 h-12 mx-auto opacity-30" />
              <p>输入 HR 问题，或点击下方 Skill 按钮选择技能</p>
              <p className="text-xs">也可以直接提问，AI 会根据内容自动匹配回答</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-purple-500/20' : 'bg-emerald-500/20'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-purple-400" /> : <Bot className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`rounded-xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-purple-500/10 text-white/80' : 'bg-white/5 text-white/70'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
              {msg.role === 'assistant' && (
                <button onClick={() => handleCopy(msg.content, i)} className="mt-2 flex items-center gap-1 text-white/30 text-xs hover:text-white/50 transition-all">
                  {copied === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied === i ? '已复制' : '复制'}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-white/5 text-white/30 text-sm">
              <span className="inline-flex items-center gap-1">思考中<span className="animate-pulse">...</span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar with Skill picker */}
      <div className="relative">
        {/* Skill picker dropdown */}
        {showSkillPicker && (
          <div ref={skillPickerRef} className="absolute bottom-full left-0 mb-2 bg-[#1a1a2e] rounded-2xl border border-white/10 shadow-2xl w-72 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-white/60 text-xs font-medium">选择 Skill</p>
            </div>
            <div className="max-h-64 overflow-y-auto py-2">
              {skills.map(skill => (
                <button key={skill.id} onClick={() => selectSkill(skill)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-all text-left">
                  <span className="text-lg">{skill.icon}</span>
                  <div>
                    <p className="text-white/80 text-sm font-medium">{skill.name}</p>
                    <p className="text-white/30 text-xs">{skill.needsInput ? '需要填写信息' : '直接提问'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {/* Skill button */}
          <button onClick={() => setShowSkillPicker(!showSkillPicker)}
            className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${activeSkill ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}>
            <Puzzle className="w-4 h-4" />
            {activeSkill ? <span>{activeSkill.icon} {activeSkill.name}</span> : 'Skill'}
            <ChevronDown className={`w-3 h-3 transition-transform ${showSkillPicker ? 'rotate-180' : ''}`} />
          </button>

          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={activeSkill ? `向 ${activeSkill.name} 提问...` : "输入 HR 问题，或选择 Skill"}
            className="flex-1 px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50" />

          <button onClick={() => handleSend()} disabled={loading || !input.trim()}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${loading || !input.trim() ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'}`}>
            <Send className="w-4 h-4" /> 发送
          </button>
        </div>
      </div>

      <div className="text-white/10 text-xs text-center">⚠️ 当前为预设回答模式 · 后续将接入大语言模型</div>
    </div>
  )
}