import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('chaishala_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const stored = localStorage.getItem('chaishala_user')
      if (stored) {
        try { setUser(JSON.parse(stored)) } catch {}
      }
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    if (data.success) {
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('chaishala_token', data.token)
      localStorage.setItem('chaishala_user', JSON.stringify(data.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    }
    return data
  }

  const register = async (formData) => {
    const { data } = await axios.post('/api/auth/register', formData)
    if (data.success) {
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('chaishala_token', data.token)
      localStorage.setItem('chaishala_user', JSON.stringify(data.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    }
    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('chaishala_token')
    localStorage.removeItem('chaishala_user')
    delete axios.defaults.headers.common['Authorization']
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
