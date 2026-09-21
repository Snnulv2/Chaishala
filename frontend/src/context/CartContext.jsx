import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('chaishala_cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('chaishala_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (tea, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.tea_id === tea.id)
      if (existing) {
        toast.success(`Updated ${tea.name} quantity`)
        return prev.map(i => i.tea_id === tea.id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      toast.success(`${tea.name} added to cart! 🍵`)
      return [...prev, {
        tea_id: tea.id,
        name: tea.name,
        price: parseFloat(tea.price),
        image_url: tea.image_url,
        quantity,
        category_name: tea.category_name,
        weight: tea.weight,
      }]
    })
  }

  const updateQuantity = (teaId, quantity) => {
    if (quantity < 1) return removeFromCart(teaId)
    setCart(prev => prev.map(i => i.tea_id === teaId ? { ...i, quantity } : i))
  }

  const removeFromCart = (teaId) => {
    setCart(prev => prev.filter(i => i.tea_id !== teaId))
    toast.info('Item removed from cart')
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax = parseFloat((subtotal * 0.05).toFixed(2))
  const total = parseFloat((subtotal + tax).toFixed(2))

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, subtotal, tax, total }}>
      {children}
    </CartContext.Provider>
  )
}
