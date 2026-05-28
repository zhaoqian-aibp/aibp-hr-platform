import { useState, useEffect } from 'react'
import { BookOpen, Search, ThumbsUp, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface QA {
  id: string
  question: string
  answer: string
  category: string
  source: string
  likes: number
}

const categories = ['全部', '政策法规', '操作流程', '最佳实践', '常见问题']

export default function KnowledgePage() {
  const [qaList, setQAList] = useState<QA[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQA() {
      const { data } = await supabase.from('knowledge_qa').select('*').order('likes', { ascending: false })
      setQAList(data || [])
      setLoading(false)
    }
    fetchQA()
  }, [])

  const filtered = qaList.filter((qa) => {
    const matchCat = activeCategory === '全部' || qa.category === activeCategory
    const matchSearch = !searchQuery || qa.question.toLowerCase().includes(searchQuery.toLowerCase()) || qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">知识库</h1>
          <p className="text-white/40 text-sm">HR 实用问答型知识库，一问一答即学即用</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索知识问答..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-white/40 hover:text-white/60 bg-white/5 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* QA Cards */}
      {loading ? (
        <div className="text-center py-12 text-white/30">加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-white/30">没有找到相关问答</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((qa) => (
            <div key={qa.id} className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === qa.id ? null : qa.id)}
                className="w-full p-5 text-left flex items-start gap-3 hover:bg-white/5 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 text-xs font-medium mb-1">{qa.category}</span>
                  <h3 className="font-bold text-white/90">{qa.question}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-white/30 text-xs"><ThumbsUp className="w-3.5 h-3.5" /> {qa.likes}</span>
                  <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${expandedId === qa.id ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {expandedId === qa.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <p className="text-white/50 text-sm leading-relaxed">{qa.answer}</p>
                  <div className="mt-3 text-white/20 text-xs">来源: {qa.source}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}