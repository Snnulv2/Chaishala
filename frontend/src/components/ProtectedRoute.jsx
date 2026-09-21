import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-chai-light">
        <div className="text-center">
          <div className="text-6xl mb-4">🍵</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tea-700 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />

  return children
}
