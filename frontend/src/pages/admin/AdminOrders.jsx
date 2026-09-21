import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { FiDownload, FiChevronDown, FiImage, FiX, FiTrash2 } from 'react-icons/fi'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
  processing: 'bg-purple-100 text-purple-700 border-purple-300',
  preparing: 'bg-orange-100 text-orange-700 border-orange-300',
  ready: 'bg-green-100 text-green-700 border-green-300',
  served: 'bg-teal-100 text-teal-700 border-teal-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
}
const allStatuses = ['pending', 'confirmed', 'processing', 'preparing', 'ready', 'served', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [updating, setUpdating] = useState(null)
  const [screenshotModal, setScreenshotModal] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order permanently? This cannot be undone.')) return
    setDeletingId(orderId)
    try {
      await axios.delete(`/api/admin/orders/${orderId}`)
      setOrders(prev => prev.filter(o => o.id !== orderId))
      toast.success('Order deleted')
    } catch {
      toast.error('Failed to delete order')
    } finally {
      setDeletingId(null)
    }
  }

  const fetchOrders = () => {
    setLoading(true)
    const qs = filterStatus ? `?status=${filterStatus}` : ''
    axios.get(`/api/admin/orders${qs}`)
      .then(({ data }) => { if (data.success) setOrders(data.orders) })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <AdminLayout title="Orders Management">
      {/* Screenshot modal */}
      {screenshotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setScreenshotModal(null)}>
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <p className="font-semibold text-gray-800">Payment Screenshot</p>
              <button onClick={() => setScreenshotModal(null)} className="text-gray-400 hover:text-gray-700"><FiX size={20} /></button>
            </div>
            <img src={`http://localhost:5000${screenshotModal}`} alt="Payment proof" className="w-full object-contain max-h-[70vh]" />
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterStatus('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${!filterStatus ? 'bg-tea-700 text-white border-tea-700' : 'bg-white text-tea-700 border-tea-200 hover:border-tea-400'}`}>
          All Orders
        </button>
        {allStatuses.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${filterStatus === s ? 'bg-tea-700 text-white border-tea-700' : 'bg-white text-tea-700 border-tea-200 hover:border-tea-400'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-gray-600 font-semibold">Order</th>
                <th className="text-left p-4 text-gray-600 font-semibold">Customer</th>
                <th className="text-right p-4 text-gray-600 font-semibold">Amount</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Payment</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Screenshot</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Status</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Invoice</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="p-4"><div className="h-8 bg-gray-100 animate-pulse rounded" /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-semibold text-tea-700 text-xs">{order.order_number}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {' '}
                      <span className="text-gray-500 font-medium">
                        {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                      </span>
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                    <p className="text-gray-400 text-xs">{order.customer_email}</p>
                  </td>
                  <td className="p-4 text-right font-bold text-tea-700">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
                      {order.payment_method || 'card'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {order.payment_screenshot ? (
                      <button
                        onClick={() => setScreenshotModal(order.payment_screenshot)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold border border-indigo-200 rounded-lg px-2 py-1"
                      >
                        <FiImage size={13} /> View
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-6 rounded-full border cursor-pointer focus:outline-none capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {allStatuses.map(s => <option key={s} value={s} className="bg-white text-gray-800">{s}</option>)}
                      </select>
                      <FiChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Link to={`/invoice/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs text-tea-600 hover:text-tea-800 font-medium">
                      <FiDownload size={13} /> {order.invoice_number ? 'View' : 'N/A'}
                    </Link>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteOrder(order.id)}
                      disabled={deletingId === order.id}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 rounded-lg px-2 py-1 transition-colors disabled:opacity-40"
                    >
                      <FiTrash2 size={13} /> {deletingId === order.id ? '...' : 'Delete'}
                    </button>
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
