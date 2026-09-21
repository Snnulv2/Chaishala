import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import { toast } from 'react-toastify'
import { FiTrash2, FiUser, FiMail, FiPhone, FiPackage } from 'react-icons/fi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(({ data }) => { if (data.success) setUsers(data.users) })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <AdminLayout title="User Management">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">{users.filter(u => u.role === 'customer').length} customers, {users.filter(u => u.role === 'admin').length} admins</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-gray-600 font-semibold">User</th>
                <th className="text-left p-4 text-gray-600 font-semibold">Contact</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Role</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Orders</th>
                <th className="text-left p-4 text-gray-600 font-semibold">Joined</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><div className="h-8 bg-gray-100 animate-pulse rounded" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm ${user.role === 'admin' ? 'bg-amber-500' : 'bg-tea-700'}`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-gray-400 text-xs">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                      <FiMail size={12} /> {user.email}
                    </p>
                    {user.phone && (
                      <p className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <FiPhone size={12} /> {user.phone}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-tea-700 font-semibold text-sm">
                      <FiPackage size={14} /> {user.total_orders || 0}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-center">
                    {user.role !== 'admin' ? (
                      <button onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
