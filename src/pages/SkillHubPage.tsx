import { useState, useEffect } from 'react'
import { Puzzle, Search, Download, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Skill {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  installs: number
  rating: number
}

const categories = ['全部', '招聘分析', '培训设计', '绩效诊断', '薪酬管理', '组织诊断', '人才盘点', '文化运营']
const difficulties = ['全部', '入门', '进阶', '专家']

export default function SkillHubPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeDifficulty, setActiveDifficulty] = useState('全部')

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase.from('skills').select('*').order('installs', { ascending: false })
      setSkills(data || [])
      setLoading(false)
    }
    fetchSkills()
  }, [])

  const filtered = skills.filter((s) => {
    const matchCat = activeCategory === '全部' || s.category === activeCategory
    const matchDiff = activeDifficulty === '全部' || s.difficulty === activeDifficulty
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchDiff && matchSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Puzzle className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">SkillHub</h1>
          <p className="text-white/40 text-sm">像应用市场一样发现和安装 AI 技能</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索 AI 技能..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-white/40 hover:text-white/60 bg-white/5 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeDifficulty === diff
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-white/40 hover:text-white/60 bg-white/5 border border-white/5'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="text-center py-12 text-white/30">加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-white/30">没有找到相关技能</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div key={skill.id} className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 hover:border-blue-500/20 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-xs font-medium">{skill.category}</span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${skill.difficulty === '入门' ? 'bg-emerald-500/15 text-emerald-300' : skill.difficulty === '进阶' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-red-500/15 text-red-300'}`}>
                  {skill.difficulty}
                </span>
              </div>
              <h3 className="text-white/90 font-bold mb-2 group-hover:text-white transition-colors">{skill.name}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-4">{skill.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {skill.installs}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {skill.rating}</span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium shadow-sm hover:shadow-lg transition-all">
                  安装技能
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}