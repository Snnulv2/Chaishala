import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { GiTeapot } from 'react-icons/gi'
import { FiGrid, FiPackage, FiUsers, FiShoppingBag, FiLogOut, FiMenu, FiX, FiHome } from 'react-icons/fi'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: <FiGrid size={18} /> },
  { path: '/admin/orders', label: 'Orders', icon: <FiPackage size={18} /> },
  { path: '/admin/teas', label: 'Tea Products', icon: <GiTeapot size={18} /> },
  { path: '/admin/users', label: 'Users', icon: <FiUsers size={18} /> },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-tea-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-tea-700">
          <div className="flex items-center gap-3">
            <GiTeapot size={32} className="text-chai-cream" />
            <div>
              <p className="font-display font-bold text-chai-cream text-lg">Chaishala</p>
              <p className="text-tea-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-b border-tea-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-tea-600 rounded-full flex items-center justify-center font-bold text-chai-cream">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-chai-cream text-sm font-semibold">{user?.name}</p>
              <p className="text-tea-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${location.pathname === item.path ? 'bg-tea-700 text-chai-cream' : 'text-tea-300 hover:bg-tea-800 hover:text-chai-cream'}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-tea-700 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-tea-400 hover:bg-tea-800 hover:text-chai-cream transition-all text-sm">
            <FiHome size={17} /> View Store
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-900/30 transition-all text-sm">
            <FiLogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500 hover:text-gray-700">
              {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-tea-800">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/menu" className="text-xs text-tea-600 hover:text-tea-800 border border-tea-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <FiShoppingBag size={13} /> Store
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
