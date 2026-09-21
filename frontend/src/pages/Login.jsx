import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

export default function Login() {
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      if (data.success) {
        toast.success(`Welcome back, ${data.user.name}! 🍵`)
        navigate(data.user.role === 'admin' ? '/admin' : '/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-chai-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-tea-100 overflow-hidden">
          {/* Header */}
          <div className="bg-tea-800 p-8 text-center">
            <GiTeapot size={48} className="text-chai-cream mx-auto mb-3" />
            <h1 className="font-display text-2xl text-chai-cream font-bold">Welcome Back</h1>
            <p className="text-tea-300 text-sm mt-1">Sign in to your Chaishala account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-600 focus:ring-1 focus:ring-tea-200 text-tea-800 bg-chai-light"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Your password"
                    className="w-full pl-11 pr-11 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-600 focus:ring-1 focus:ring-tea-200 text-tea-800 bg-chai-light"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tea-400 hover:text-tea-700">
                    {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Admin hint */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                <strong>Admin Login:</strong> admin@chaishala.com / Chaishala@123
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-tea-700 hover:bg-tea-800 disabled:bg-tea-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
                ) : 'Sign In 🍵'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-tea-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-tea-700 font-semibold hover:text-tea-900">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
