import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import InvoicePage from './pages/InvoicePage'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminTeas from './pages/admin/AdminTeas'
import AdminUsers from './pages/admin/AdminUsers'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-chai-light">
            <Routes>
              {/* Admin routes - no main Navbar */}
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/orders" element={<AdminOrders />} />
                    <Route path="/teas" element={<AdminTeas />} />
                    <Route path="/users" element={<AdminUsers />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Public + Customer routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/invoice/:orderId" element={<InvoicePage />} />
                      <Route path="/my-orders" element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop theme="light" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
