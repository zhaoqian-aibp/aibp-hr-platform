import { useState, useEffect } from 'react'
import { Radar, Search, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Article {
  id: string
  title: string
  summary: string
  category: string
  source: string
  read_time: number
  created_at: string
  cover_url: string | null
}

const categories = ['全部', '大模型', '行业趋势', '工具评测', '政策法规', '学术前沿', '实操案例']

export default function InsightsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchArticles() {
      const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
      setArticles(data || [])
      setLoading(false)
    }
    fetchArticles()
  }, [])

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === '全部' || a.category === activeCategory
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Radar className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">情报中心</h1>
          <p className="text-white/40 text-sm">实时追踪 AI 在 HR 领域的最新动态</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索情报文章..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-white/40 hover:text-white/60 bg-white/5 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      {loading ? (
        <div className="text-center py-12 text-white/30">加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-white/30">没有找到相关文章</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((article) => (
            <article
              key={article.id}
              className="group bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 hover:border-purple-500/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-md bg-purple-500/15 text-purple-300 text-xs font-medium">{article.category}</span>
                <span className="text-white/30 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {article.read_time} 分钟</span>
              </div>
              <h3 className="text-white/90 font-bold text-base mb-2 group-hover:text-white transition-colors">{article.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{article.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-white/20 text-xs">{article.source}</span>
                <span className="text-purple-400/60 text-xs flex items-center gap-1 group-hover:text-purple-400 transition-all">
                  阅读全文 <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}