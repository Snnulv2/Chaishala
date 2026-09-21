import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <nav className="bg-tea-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <GiTeapot className="text-chai-cream text-3xl group-hover:text-chai-gold transition-colors" />
            <div>
              <span className="text-chai-cream font-display text-xl font-bold tracking-wide">Chaishala</span>
              <span className="text-tea-400 text-xs block leading-none">Premium Tea Shop</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-tea-200 hover:text-chai-cream transition-colors font-medium">Home</Link>
            <Link to="/menu" className="text-tea-200 hover:text-chai-cream transition-colors font-medium">Our Teas</Link>
            {isAdmin && (
              <Link to="/admin" className="text-chai-gold hover:text-yellow-300 transition-colors font-medium">Admin Panel</Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-tea-200 hover:text-chai-cream transition-colors">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-tea-200 hover:text-chai-cream transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-tea-600 flex items-center justify-center text-sm font-bold text-chai-cream">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50 border border-tea-100">
                    <div className="px-4 py-2 border-b border-tea-100">
                      <p className="text-sm font-semibold text-tea-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/my-orders" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-tea-700 hover:bg-tea-50 transition-colors">
                      <FiPackage size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-chai-gold hover:bg-tea-50 transition-colors font-medium">
                        <FiUser size={15} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center gap-2 bg-tea-600 hover:bg-tea-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <FiUser size={16} /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-tea-200 hover:text-chai-cream">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-tea-900 border-t border-tea-700 px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-tea-200 hover:text-chai-cream py-2">Home</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)} className="block text-tea-200 hover:text-chai-cream py-2">Our Teas</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-chai-gold hover:text-yellow-300 py-2">Admin Panel</Link>
          )}
          {user && (
            <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block text-tea-200 hover:text-chai-cream py-2">My Orders</Link>
          )}
        </div>
      )}
    </nav>
  )
}
