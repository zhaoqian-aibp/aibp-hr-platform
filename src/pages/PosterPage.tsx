import { useState, useEffect } from 'react'
import { Image, Sparkles, Clock, Wand2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PosterType {
  id: string
  name: string
  label: string
  description: string
}

interface PosterStyle {
  id: string
  name: string
  label: string
  color: string
}

export default function PosterPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [posterTypes, setPosterTypes] = useState<PosterType[]>([])
  const [posterStyles, setPosterStyles] = useState<PosterStyle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [{ data: types }, { data: styles }] = await Promise.all([
        supabase.from('poster_types').select('*').order('sort_order'),
        supabase.from('poster_styles').select('*').order('sort_order'),
      ])
      setPosterTypes(types || [])
      setPosterStyles(styles || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleGenerate = () => {
    if (!selectedType || !selectedStyle || !description) return
    setGenerating(true)
    setTimeout(() => {
      setGeneratedImage('https://placehold.co/800x600/1a1a2e/7c3aed?text=AI+Generated+Poster')
      setGenerating(false)
    }, 3000)
  }

  const canGenerate = selectedType && selectedStyle && description.trim().length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">海报制作</h1>
          <p className="text-white/40 text-sm">AI 一键生成，选类型、写需求、挑风格，10-30秒出图</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Config */}
        <div className="lg:col-span-2 space-y-4">
          {/* Poster Type */}
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-4">海报类型</h3>
            {loading ? (
              <div className="text-center py-8 text-white/30">加载中...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {posterTypes.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedType(pt.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedType === pt.id
                        ? 'bg-purple-500/20 text-white border border-purple-500/30 shadow-sm'
                        : 'bg-[#12121f] text-white/60 border border-white/5 hover:border-purple-500/20'
                    }`}
                  >
                    <div className="text-lg mb-1">{pt.label}</div>
                    <div className={`text-xs ${selectedType === pt.id ? 'text-white/60' : 'text-white/30'}`}>{pt.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-2">需求描述</h3>
            <p className="text-white/30 text-sm mb-4">越具体越准——写上标题、副标题、关键字、希望传达的感觉</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="比如：2026暑期实习生内推海报，标题'加入我们，未来由你定义'..."
              rows={4}
              className="w-full p-4 rounded-xl bg-[#12121f] border border-white/5 text-white/80 text-sm placeholder:text-white/20 resize-none focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          {/* Style */}
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-4">风格偏好</h3>
            {loading ? (
              <div className="text-center py-8 text-white/30">加载中...</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {posterStyles.map((ps) => (
                  <button
                    key={ps.id}
                    onClick={() => setSelectedStyle(ps.id)}
                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedStyle === ps.id
                        ? 'shadow-lg ring-2 ring-purple-500 ring-offset-2 ring-offset-[#1a1a2e]'
                        : 'bg-[#12121f] text-white/50 border border-white/5 hover:border-purple-500/20'
                    }`}
                    style={selectedStyle === ps.id ? { backgroundColor: ps.color, color: '#fff' } : {}}
                  >
                    {ps.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || generating}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              canGenerate && !generating
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            {generating ? (<><Clock className="w-5 h-5 animate-spin" /> AI 正在生成海报，预计等待 10-30 秒...</>) : (<><Wand2 className="w-5 h-5" /> 创建海报</>)}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Image className="w-5 h-5 text-emerald-400" /> 预览</h3>
            <div className="aspect-[4/3] rounded-xl bg-[#12121f] flex items-center justify-center overflow-hidden">
              {generating ? (
                <div className="text-center">
                  <Sparkles className="w-10 h-10 text-purple-400 animate-pulse mx-auto mb-3" />
                  <p className="text-white/30 text-sm">生成中...</p>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="海报" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  <Image className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/20 text-sm">选择类型、风格，填写需求后生成</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-4">当前配置</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-white/30">类型</span><span className="text-purple-400">{selectedType ? posterTypes.find((t) => t.id === selectedType)?.label : '未选择'}</span></div>
              <div className="flex justify-between"><span className="text-white/30">风格</span><span className="text-blue-400">{selectedStyle ? posterStyles.find((s) => s.id === selectedStyle)?.label : '未选择'}</span></div>
              <div className="flex justify-between"><span className="text-white/30">需求</span><span className={description ? 'text-emerald-400' : 'text-white/20'}>{description ? '已填写' : '未填写'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}