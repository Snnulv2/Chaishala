import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartCount, subtotal, tax, total } = useCart()

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-chai-light flex items-center justify-center px-4">
        <div className="text-center">
          <GiTeapot size={80} className="text-tea-300 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-tea-700 font-bold mb-2">Your cart is empty</h2>
          <p className="text-tea-500 mb-6">Add some delicious teas to get started!</p>
          <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag size={18} /> Browse Teas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chai-light py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu" className="text-tea-600 hover:text-tea-800 transition-colors">
            <FiArrowLeft size={22} />
          </Link>
          <h1 className="font-display text-3xl text-tea-800 font-bold">Your Cart</h1>
          <span className="bg-tea-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {cartCount} item{cartCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.tea_id} className="bg-white rounded-2xl p-4 shadow-sm border border-tea-100 flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-chai-cream flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍵</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-tea-800 text-sm leading-tight">{item.name}</h3>
                      <p className="text-tea-400 text-xs mt-0.5">{item.category_name} • {item.weight}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.tea_id)}
                      className="text-red-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.tea_id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-tea-100 hover:bg-tea-200 text-tea-700 flex items-center justify-center transition-colors"
                      >
                        <FiMinus size={13} />
                      </button>
                      <span className="w-8 text-center font-semibold text-tea-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.tea_id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-tea-100 hover:bg-tea-200 text-tea-700 flex items-center justify-center transition-colors"
                      >
                        <FiPlus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-tea-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-tea-400 text-xs">₹{item.price.toFixed(0)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-tea-100 p-6 sticky top-24">
              <h2 className="font-display text-xl text-tea-800 font-bold mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-tea-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-tea-600">
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-tea-100 pt-3 flex justify-between font-bold text-base text-tea-800">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 w-full bg-tea-700 hover:bg-tea-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>

              <Link to="/menu" className="mt-3 w-full text-center text-tea-600 hover:text-tea-800 text-sm flex items-center justify-center gap-1.5 py-2">
                <FiArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
