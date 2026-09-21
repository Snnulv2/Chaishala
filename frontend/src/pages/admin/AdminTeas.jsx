import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'
import { toast } from 'react-toastify'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'

const emptyForm = {
  name: '', description: '', price: '', category_id: '',
  image_url: '', stock: 100, weight: '100g', origin: '', rating: 4.5, is_featured: false, is_active: true
}

export default function AdminTeas() {
  const [teas, setTeas] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get('/api/teas?all=true').then(r => r.data),
      axios.get('/api/teas/categories').then(r => r.data),
    ]).then(([teaData, catData]) => {
      if (teaData.success) setTeas(teaData.teas)
      if (catData.success) setCategories(catData.categories)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (tea) => {
    setEditId(tea.id)
    setForm({
      name: tea.name, description: tea.description || '', price: tea.price,
      category_id: tea.category_id || '', image_url: tea.image_url || '',
      stock: tea.stock, weight: tea.weight, origin: tea.origin || '',
      rating: tea.rating, is_featured: !!tea.is_featured, is_active: !!tea.is_active
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    try {
      if (editId) {
        await axios.put(`/api/teas/${editId}`, form)
        setTeas(prev => prev.map(t => t.id === editId ? { ...t, ...form } : t))
        toast.success('Tea updated successfully')
      } else {
        const { data } = await axios.post('/api/teas', form)
        if (data.success) {
          const newTea = { id: data.id, ...form, category_name: categories.find(c => c.id == form.category_id)?.name }
          setTeas(prev => [newTea, ...prev])
          toast.success('Tea added successfully')
        }
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this tea?')) return
    try {
      await axios.delete(`/api/teas/${id}`)
      setTeas(prev => prev.map(t => t.id === id ? { ...t, is_active: false } : t))
      toast.success('Tea removed')
    } catch {
      toast.error('Failed to remove tea')
    }
  }

  return (
    <AdminLayout title="Tea Products">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{teas.length} products</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-tea-700 hover:bg-tea-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm">
          <FiPlus size={18} /> Add New Tea
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-gray-600 font-semibold">Product</th>
                <th className="text-left p-4 text-gray-600 font-semibold">Category</th>
                <th className="text-right p-4 text-gray-600 font-semibold">Price</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Stock</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Featured</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Status</th>
                <th className="text-center p-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="p-4"><div className="h-8 bg-gray-100 animate-pulse rounded" /></td></tr>
                ))
              ) : teas.map(tea => (
                <tr key={tea.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!tea.is_active ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-chai-cream flex-shrink-0">
                        {tea.image_url ? <img src={tea.image_url} alt={tea.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🍵</div>}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{tea.name}</p>
                        <p className="text-gray-400 text-xs">{tea.weight} · {tea.origin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-xs">{tea.category_name || '-'}</td>
                  <td className="p-4 text-right font-bold text-tea-700">₹{parseFloat(tea.price).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tea.stock > 20 ? 'bg-green-100 text-green-700' : tea.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {tea.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {tea.is_featured ? <FiCheck className="text-green-500 mx-auto" size={18} /> : <FiX className="text-gray-300 mx-auto" size={18} />}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tea.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tea.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(tea)} className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(tea.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="font-display text-xl font-bold text-tea-800">{editId ? 'Edit Tea' : 'Add New Tea'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <FiX size={22} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Tea Name *', key: 'name', type: 'text', span: 2 },
                { label: 'Price (₹) *', key: 'price', type: 'number' },
                { label: 'Stock', key: 'stock', type: 'number' },
                { label: 'Weight', key: 'weight', type: 'text' },
                { label: 'Origin', key: 'origin', type: 'text' },
                { label: 'Rating (1-5)', key: 'rating', type: 'number' },
                { label: 'Image URL', key: 'image_url', type: 'text', span: 2 },
              ].map(field => (
                <div key={field.key} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                  <input
                    type={field.type} value={form[field.key]}
                    onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-tea-500 bg-gray-50"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-tea-500 bg-gray-50"
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-tea-500 bg-gray-50 resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded accent-tea-700" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded accent-tea-700" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2.5 bg-tea-700 hover:bg-tea-800 text-white rounded-xl transition-all text-sm font-semibold shadow-sm disabled:opacity-60 flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {editId ? 'Update Tea' : 'Add Tea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
