import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) { setError('请填写邮箱和密码'); return }
    if (mode === 'register' && !invitationCode) { setError('请填写邀请码'); return }
    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }
    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white font-extrabold shadow-lg shadow-purple-500/30">
            AI
          </div>
          <span className="font-extrabold tracking-tight text-white text-xl">AIBP</span>
        </Link>

        <h1 className="text-2xl font-extrabold text-white mb-2">{mode === 'login' ? '登录' : '注册'}</h1>
        <p className="text-white/40 text-sm mb-8">AI × HR 正在发生，加入我们开始探索</p>

        <div className="flex gap-2 mb-6">
          <button onClick={() => { setMode('login'); setError('') }} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'login' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 text-white/40'}`}>
            登录
          </button>
          <button onClick={() => { setMode('register'); setError('') }} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'register' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-white/5 text-white/40'}`}>
            注册
          </button>
        </div>

        <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-white/5 space-y-4">
          <div>
            <label className="text-white/40 text-sm mb-2 block">邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱地址" className="w-full px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50" />
          </div>
          <div>
            <label className="text-white/40 text-sm mb-2 block">密码</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码（至少6位）" className="w-full px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {mode === 'register' && (
            <div>
              <label className="text-white/40 text-sm mb-2 block">邀请码</label>
              <input type="text" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} placeholder="请输入邀请码" className="w-full px-4 py-3 rounded-xl bg-[#12121f] border border-white/10 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50" />
            </div>
          )}
          {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <button onClick={handleSubmit} disabled={loading} className={`w-full py-3 rounded-xl font-medium transition-all ${loading ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'}`}>
            {loading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
          </button>
          <div className="text-center text-white/20 text-xs">{mode === 'login' ? '还没有账号？点击上方「注册」' : '已有账号？点击上方「登录」'}</div>
        </div>

        <div className="mt-6 text-center"><Link to="/" className="text-white/30 text-sm hover:text-white/50 transition-colors">← 返回首页</Link></div>
      </div>
    </div>
  )
}