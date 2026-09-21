import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      if (data.success) {
        toast.success(`Welcome to Chaishala, ${data.user.name}! 🍵`)
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-chai-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-tea-100 overflow-hidden">
          {/* Header */}
          <div className="bg-tea-800 p-8 text-center">
            <GiTeapot size={48} className="text-chai-cream mx-auto mb-3" />
            <h1 className="font-display text-2xl text-chai-cream font-bold">Join Chaishala</h1>
            <p className="text-tea-300 text-sm mt-1">Create your account and start your tea journey</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full pl-11 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-600 text-tea-800 bg-chai-light"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-600 text-tea-800 bg-chai-light"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type="tel" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                    className="w-full pl-11 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-600 text-tea-800 bg-chai-light"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-11 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-600 text-tea-800 bg-chai-light"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tea-400 hover:text-tea-700">
                    {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-tea-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
                  <input
                    type="password" required value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none text-tea-800 bg-chai-light ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-tea-200 focus:border-tea-600'}`}
                  />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-tea-700 hover:bg-tea-800 disabled:bg-tea-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                ) : 'Create Account 🍵'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-tea-500">
              Already have an account?{' '}
              <Link to="/login" className="text-tea-700 font-semibold hover:text-tea-900">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
