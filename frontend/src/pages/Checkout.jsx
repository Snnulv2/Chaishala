import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import QRCode from 'react-qr-code'
import { FiLock, FiCreditCard, FiUser, FiMail, FiPhone, FiCheckCircle, FiCopy, FiUpload, FiImage } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

const SHOP_UPI_ID = 'vk3471713@oksbi'
const SHOP_NAME = 'Chaishala'

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI Payment', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
]

export default function Checkout() {
  const { cart, subtotal, tax, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [screenshot, setScreenshot] = useState(null)   // File object
  const [screenshotPreview, setScreenshotPreview] = useState(null)

  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    table_number: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    card_name: '',
    upi_id: '',
    notes: '',
  })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleScreenshot = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customer_name || !form.customer_email) {
      toast.error('Please fill all required fields')
      return
    }
    if (paymentMethod === 'upi' && !screenshot) {
      toast.error('Please upload your payment screenshot to confirm the order')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('customer_name', form.customer_name)
      fd.append('customer_email', form.customer_email)
      fd.append('customer_phone', form.customer_phone)
      fd.append('payment_method', paymentMethod)
      fd.append('notes', form.table_number ? `Table: ${form.table_number}${form.notes ? ' | ' + form.notes : ''}` : form.notes)
      fd.append('items', JSON.stringify(cart.map(item => ({ tea_id: item.tea_id, quantity: item.quantity }))))
      if (screenshot) fd.append('payment_screenshot', screenshot)

      const { data } = await axios.post('/api/orders', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (data.success) {
        clearCart()
        toast.success('🎉 Order placed successfully!')
        navigate(`/invoice/${data.order.id}`, { state: { order: data.order } })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-chai-light flex items-center justify-center">
        <div className="text-center">
          <GiTeapot size={60} className="text-tea-300 mx-auto mb-3" />
          <p className="text-tea-600 font-semibold">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chai-light py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl text-tea-800 font-bold mb-2">Checkout</h1>
        <p className="text-tea-500 mb-8 flex items-center gap-2">
          <FiLock size={14} /> In-store order — no delivery
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left - Forms */}
            <div className="lg:col-span-3 space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-tea-100 p-6">
                <h2 className="font-display text-xl text-tea-800 font-bold mb-5 flex items-center gap-2">
                  <FiUser className="text-tea-600" /> Customer Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-tea-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-tea-400" size={16} />
                      <input
                        type="text" name="customer_name" value={form.customer_name}
                        onChange={handleChange} required placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-tea-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-tea-400" size={16} />
                      <input
                        type="email" name="customer_email" value={form.customer_email}
                        onChange={handleChange} required placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-tea-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-tea-400" size={16} />
                      <input
                        type="tel" name="customer_phone" value={form.customer_phone}
                        onChange={handleChange} placeholder="+91 9876543210"
                        className="w-full pl-10 pr-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-tea-700 mb-1.5">Table Number (Optional)</label>
                    <input
                      type="text" name="table_number" value={form.table_number}
                      onChange={handleChange} placeholder="e.g. T-5"
                      className="w-full px-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-tea-700 mb-1.5">Special Instructions (Optional)</label>
                    <input
                      type="text" name="notes" value={form.notes} onChange={handleChange}
                      placeholder="Any special requests..."
                      className="w-full px-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-sm border border-tea-100 p-6">
                <h2 className="font-display text-xl text-tea-800 font-bold mb-5 flex items-center gap-2">
                  <FiCreditCard className="text-tea-600" /> Payment Method
                </h2>

                {/* Method selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {paymentMethods.map(m => (
                    <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${paymentMethod === m.id ? 'border-tea-600 bg-tea-50' : 'border-tea-100 hover:border-tea-300'}`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-xs font-medium text-tea-700 text-center">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-tea-700 mb-1.5">Card Number</label>
                      <input
                        type="text" name="card_number" value={form.card_number}
                        onChange={e => setForm(p => ({ ...p, card_number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full px-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light font-mono tracking-wider"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-tea-700 mb-1.5">Expiry (MM/YY)</label>
                        <input
                          type="text" name="card_expiry" value={form.card_expiry}
                          onChange={e => { let v = e.target.value.replace(/\D/g,'').slice(0,4); if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2); setForm(p=>({...p,card_expiry:v})) }}
                          placeholder="12/28" maxLength={5}
                          className="w-full px-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-tea-700 mb-1.5">CVV</label>
                        <input
                          type="password" name="card_cvv" value={form.card_cvv}
                          onChange={e => setForm(p => ({ ...p, card_cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="•••" maxLength={4}
                          className="w-full px-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-tea-700 mb-1.5">Name on Card</label>
                      <input
                        type="text" name="card_name" value={form.card_name} onChange={handleChange}
                        placeholder="As printed on card"
                        className="w-full px-4 py-3 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light uppercase"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-tea-600 text-center">
                      Scan the QR code below with any UPI app to pay
                    </p>
                    <div className="bg-white p-4 rounded-2xl border-2 border-tea-200 shadow-md">
                      <QRCode
                        value={`upi://pay?pa=${SHOP_UPI_ID}&pn=${encodeURIComponent(SHOP_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Chaishala Order')}`}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#3e1c00"
                        level="M"
                      />
                    </div>
                    <div className="w-full bg-chai-light rounded-xl p-3 flex items-center justify-between gap-3 border border-tea-200">
                      <div>
                        <p className="text-xs text-tea-400 mb-0.5">Pay to UPI ID</p>
                        <p className="font-mono font-bold text-tea-800 text-sm">{SHOP_UPI_ID}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(SHOP_UPI_ID); toast.success('UPI ID copied!') }}
                        className="flex items-center gap-1.5 text-tea-600 hover:text-tea-800 text-xs font-semibold border border-tea-300 rounded-lg px-3 py-2"
                      >
                        <FiCopy size={13} /> Copy
                      </button>
                    </div>
                    <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 text-center">
                      Amount to pay: <span className="font-bold text-base text-amber-800">₹{total.toFixed(2)}</span><br />
                      After payment, click &ldquo;Confirm Order&rdquo; below
                    </div>

                    {/* Screenshot upload - mandatory */}
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-tea-700 mb-2 flex items-center gap-1.5">
                        <FiImage size={15} /> Upload Payment Screenshot <span className="text-red-500">*</span>
                      </label>
                      {screenshotPreview ? (
                        <div className="relative rounded-xl overflow-hidden border-2 border-green-400 bg-green-50">
                          <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-48 object-contain" />
                          <button type="button" onClick={() => { setScreenshot(null); setScreenshotPreview(null) }}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                            Remove
                          </button>
                          <div className="flex items-center gap-1.5 text-green-700 text-xs font-semibold p-2">
                            <FiCheckCircle size={13} /> Screenshot uploaded successfully
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-tea-300 rounded-xl cursor-pointer hover:border-tea-500 hover:bg-tea-50 transition-all">
                          <FiUpload size={24} className="text-tea-400" />
                          <span className="text-sm text-tea-600 font-medium">Click to upload screenshot</span>
                          <span className="text-xs text-tea-400">PNG, JPG, JPEG up to 5MB</span>
                          <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                    You will be redirected to your bank's portal after placing the order.
                  </div>
                )}

                <p className="text-xs text-tea-400 mt-4 flex items-center gap-1.5">
                  <FiLock size={12} /> Your payment information is encrypted and secure
                </p>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-tea-100 p-6 sticky top-24">
                <h2 className="font-display text-xl text-tea-800 font-bold mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.tea_id} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-chai-cream flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center">🍵</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-tea-800 truncate">{item.name}</p>
                        <p className="text-xs text-tea-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-tea-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-tea-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-tea-600">
                    <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-tea-600">
                    <span>GST (5%)</span><span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-tea-100 pt-2.5 flex justify-between font-bold text-base text-tea-800">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading || (paymentMethod === 'upi' && !screenshot)}
                  className="mt-6 w-full bg-tea-700 hover:bg-tea-800 disabled:bg-tea-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={20} /> {paymentMethod === 'upi' ? `Confirm Order — ₹${total.toFixed(2)}` : `Place Order — ₹${total.toFixed(2)}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
