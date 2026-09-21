import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiPackage, FiDownload } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  served: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/orders/my-orders')
      .then(({ data }) => { if (data.success) setOrders(data.orders) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-chai-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-tea-700" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-chai-light flex items-center justify-center px-4">
        <div className="text-center">
          <GiTeapot size={70} className="text-tea-200 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-tea-700 font-bold mb-2">No orders yet</h2>
          <p className="text-tea-400 mb-6">Start your tea journey today!</p>
          <Link to="/menu" className="btn-primary inline-block">Browse Teas</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chai-light py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-tea-800 font-bold mb-2 flex items-center gap-3">
          <FiPackage className="text-tea-600" /> My Orders
        </h1>
        <p className="text-tea-500 mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-tea-100 p-5">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-bold text-tea-800">{order.order_number}</p>
                  <p className="text-tea-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}
                    <span className="font-medium text-tea-500">
                      {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-tea-800 text-lg">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-tea-100">
                <p className="text-tea-500 text-sm">
                  Invoice: <span className="font-mono text-tea-700">{order.invoice_number || 'Pending'}</span>
                </p>
                <Link to={`/invoice/${order.id}`}
                  className="flex items-center gap-1.5 text-tea-700 hover:text-tea-900 text-sm font-semibold">
                  <FiDownload size={15} /> View Invoice
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
