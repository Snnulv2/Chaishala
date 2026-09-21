import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiStar, FiPackage } from 'react-icons/fi'
import { GiLeafSwirl } from 'react-icons/gi'

export default function TeaCard({ tea }) {
  const { addToCart } = useCart()
  const [imgError, setImgError] = useState(false)

  const handleAddToCart = () => {
    addToCart(tea, 1)
  }

  return (
    <div className="tea-card bg-white rounded-2xl overflow-hidden border border-tea-100 shadow-md group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-chai-cream">
        {!imgError ? (
          <img
            src={tea.image_url}
            alt={tea.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-chai-cream to-tea-100">
            <span className="text-7xl">🍵</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {tea.is_featured && (
            <span className="badge-featured text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              ⭐ Featured
            </span>
          )}
          {tea.stock <= 10 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        {/* Category */}
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {tea.category_name}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="font-display text-tea-800 font-semibold text-base leading-tight flex-1 mr-2">
            {tea.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
            <FiStar size={13} fill="currentColor" />
            <span className="text-xs font-semibold text-tea-700">{tea.rating}</span>
          </div>
        </div>

        <p className="text-tea-600 text-xs leading-relaxed mb-3 line-clamp-2">{tea.description}</p>

        <div className="flex items-center gap-3 text-xs text-tea-500 mb-3">
          <span className="flex items-center gap-1">
            <FiPackage size={12} /> {tea.weight}
          </span>
          {tea.origin && (
            <span className="flex items-center gap-1">
              <GiLeafSwirl size={12} /> {tea.origin}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-tea-700">₹{parseFloat(tea.price).toFixed(0)}</span>
            <span className="text-xs text-tea-400 ml-1">/{tea.weight}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={tea.stock === 0}
            className="flex items-center gap-2 bg-tea-700 hover:bg-tea-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow hover:shadow-md"
          >
            <FiShoppingCart size={15} />
            {tea.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
