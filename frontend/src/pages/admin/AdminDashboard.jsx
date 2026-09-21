import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'
import { Link } from 'react-router-dom'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/dashboard')
      .then(({ data }) => { if (data.success) setData(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-tea-700" />
        </div>
      </AdminLayout>
    )
  }

  const stats = data?.stats || {}

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: <FiTrendingUp size={24} />, color: 'bg-green-50 text-green-600', border: 'border-green-200',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: <FiPackage size={24} />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200',
    },
    {
      label: 'Customers',
      value: stats.totalUsers || 0,
      icon: <FiUsers size={24} />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200',
    },
    {
      label: 'Tea Products',
      value: stats.totalTeas || 0,
      icon: <GiTeapot size={24} />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-200',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders || 0,
      icon: <FiClock size={24} />, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200',
    },
    {
      label: 'Confirmed Orders',
      value: stats.confirmedOrders || 0,
      icon: <FiCheckCircle size={24} />, color: 'bg-teal-50 text-teal-600', border: 'border-teal-200',
    },
  ]

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl border ${card.border} p-5 shadow-sm`}>
            <div className={`${card.color} w-11 h-11 rounded-xl flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h2 className="font-display font-bold text-tea-800 text-lg">Recent Orders</h2>
            <Link to="/admin/orders" className="text-tea-600 text-sm font-semibold hover:text-tea-800">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-3 text-gray-500 font-medium">Order</th>
                  <th className="text-left p-3 text-gray-500 font-medium">Customer</th>
                  <th className="text-right p-3 text-gray-500 font-medium">Amount</th>
                  <th className="text-center p-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <p className="font-mono font-semibold text-tea-700 text-xs">{order.order_number}</p>
                      <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-gray-400 text-xs truncate max-w-32">{order.customer_email}</p>
                    </td>
                    <td className="p-3 text-right font-bold text-tea-700">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <p className="text-center text-gray-400 py-8">No orders yet</p>
            )}
          </div>
        </div>

        {/* Top Teas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-display font-bold text-tea-800 text-lg">Top Selling Teas</h2>
          </div>
          <div className="p-5 space-y-4">
            {(data?.topTeas || []).map((tea, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-tea-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{tea.name}</p>
                  <p className="text-xs text-gray-400">{tea.total_sold} sold</p>
                </div>
                <p className="text-sm font-bold text-tea-700">₹{parseFloat(tea.revenue).toFixed(0)}</p>
              </div>
            ))}
            {(!data?.topTeas || data.topTeas.length === 0) && (
              <p className="text-gray-400 text-sm text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
