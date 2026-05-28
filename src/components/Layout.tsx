import { NavLink, Outlet, useNavigate, useLocation } from 'react-router'
import { Home, Radar, Puzzle, BookOpen, Image, LogIn, LogOut, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/insights', icon: Radar, label: '情报中心' },
  { path: '/skillhub', icon: Puzzle, label: 'SkillHub' },
  { path: '/knowledge', icon: BookOpen, label: '知识库' },
  { path: '/poster', icon: Image, label: '海报制作' },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-[#0f0f1a]">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#12121f] border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-purple-500/30">
            AI
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-xl">AIBP</span>
            <span className="ml-1 text-xs text-purple-400/80 font-medium">HR</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-sm border border-purple-500/30'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div className="p-4 border-t border-white/5">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 text-white/40 text-xs">
                <User className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <button
                onClick={() => { signOut(); setMobileOpen(false) }}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" /> 退出
              </button>
            </div>
          ) : (
            <button
              onClick={() => { navigate('/login'); setMobileOpen(false) }}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              <LogIn className="w-4 h-4" /> 登录 / 注册
            </button>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 bg-[#0f0f1a]/90 backdrop-blur-sm border-b border-white/5 p-4 flex items-center justify-between z-30">
          <button onClick={() => setMobileOpen(true)} className="text-white/70">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="font-bold text-white">AIBP</span>
          </div>
          <div className="w-6" />
        </div>

        {/* Page Content */}
        <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}