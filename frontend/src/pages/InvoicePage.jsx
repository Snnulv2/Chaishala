import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FiDownload, FiPrinter, FiCheckCircle, FiHome, FiPackage } from 'react-icons/fi'
import { GiTeapot } from 'react-icons/gi'

export default function InvoicePage() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const [order, setOrder] = useState(state?.order || null)
  const [loading, setLoading] = useState(!state?.order)
  const invoiceRef = useRef()

  useEffect(() => {
    if (!order) {
      axios.get(`/api/orders/${orderId}`)
        .then(({ data }) => { if (data.success) setOrder(data.order) })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [orderId, order])

  const downloadPDF = () => {
    if (!order) return
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 20

    // Header background
    doc.setFillColor(139, 69, 19)
    doc.rect(0, 0, pageW, 42, 'F')

    // Logo text
    doc.setTextColor(255, 248, 220)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('🍵 CHAISHALA', margin, 18)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Premium Tea Shop | hello@chaishala.com | +91 98765 43210', margin, 27)
    doc.text('123 Tea Garden Road, Darjeeling, West Bengal 734101', margin, 34)

    // Invoice badge
    doc.setFillColor(210, 105, 30)
    doc.roundedRect(pageW - margin - 50, 6, 50, 30, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', pageW - margin - 25, 18, { align: 'center' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`# ${order.invoice_number || 'INV-' + order.id}`, pageW - margin - 25, 27, { align: 'center' })

    // Status badge
    doc.setFillColor(74, 124, 89)
    doc.roundedRect(pageW - margin - 50, 38, 50, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('✓ PAID', pageW - margin - 25, 45, { align: 'center' })

    let y = 56

    // Bill To & Invoice Info
    doc.setTextColor(62, 28, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', margin, y)
    doc.text('INVOICE DETAILS:', pageW / 2 + 5, y)

    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(order.customer_name, margin, y)
    doc.text(`Order #: ${order.order_number}`, pageW / 2 + 5, y)
    y += 5
    doc.text(order.customer_email, margin, y)
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, pageW / 2 + 5, y)
    if (order.customer_phone) {
      y += 5
      doc.text(order.customer_phone, margin, y)
      doc.text(`Payment: ${order.payment_method?.toUpperCase() || 'CARD'}`, pageW / 2 + 5, y)
    }

    y += 12

    // Items table
    const items = order.items || []
    autoTable(doc, {
      startY: y,
      head: [['#', 'Item', 'Qty', 'Unit Price', 'Total']],
      body: items.map((item, i) => [
        i + 1,
        `${item.tea_name || item.name}\n${item.weight || '100g'}`,
        item.quantity,
        `₹${parseFloat(item.unit_price || item.price).toFixed(2)}`,
        `₹${parseFloat(item.total_price || (item.price * item.quantity)).toFixed(2)}`,
      ]),
      headStyles: {
        fillColor: [139, 69, 19],
        textColor: [255, 248, 220],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: { textColor: [62, 28, 0], fontSize: 9 },
      alternateRowStyles: { fillColor: [255, 248, 220] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 28, halign: 'right' },
        4: { cellWidth: 28, halign: 'right' },
      },
      margin: { left: margin, right: margin },
      theme: 'grid',
    })

    const finalY = doc.lastAutoTable.finalY + 8

    // Totals
    const totalsX = pageW - margin - 70
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(62, 28, 0)

    const rows = [
      ['Subtotal:', `₹${parseFloat(order.subtotal).toFixed(2)}`],
      ['GST (5%):', `₹${parseFloat(order.tax).toFixed(2)}`],
    ]
    rows.forEach(([label, value], i) => {
      doc.text(label, totalsX, finalY + i * 6)
      doc.text(value, pageW - margin, finalY + i * 6, { align: 'right' })
    })

    // Total box
    doc.setFillColor(139, 69, 19)
    doc.roundedRect(totalsX - 4, finalY + rows.length * 6 + 2, 70 + 4 + margin - totalsX + pageW - margin - totalsX, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('TOTAL:', totalsX, finalY + rows.length * 6 + 9)
    doc.text(`₹${parseFloat(order.total_amount).toFixed(2)}`, pageW - margin, finalY + rows.length * 6 + 9, { align: 'right' })

    // Transaction ID
    const txY = finalY + rows.length * 6 + 22
    doc.setTextColor(62, 28, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    if (order.transaction_id) {
      doc.text(`Transaction ID: ${order.transaction_id}`, margin, txY)
    }

    // Footer
    doc.setDrawColor(210, 105, 30)
    doc.setLineWidth(0.5)
    doc.line(margin, 270, pageW - margin, 270)
    doc.setTextColor(139, 69, 19)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Thank you for choosing Chaishala! 🍵', pageW / 2, 276, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 80, 60)
    doc.text('For support: hello@chaishala.com | www.chaishala.com', pageW / 2, 282, { align: 'center' })

    doc.save(`Chaishala-Invoice-${order.order_number || order.id}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-chai-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tea-700 mx-auto mb-4" />
          <p className="text-tea-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-chai-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-tea-600 font-semibold text-xl mb-4">Invoice not found</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const items = order.items || []

  return (
    <div className="min-h-screen bg-chai-light py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <FiCheckCircle size={36} className="text-green-500 flex-shrink-0" />
          <div>
            <h2 className="font-display text-xl text-green-800 font-bold">Order Placed Successfully! 🎉</h2>
            <p className="text-green-600 text-sm mt-1">
              Thank you, {order.customer_name}! Your invoice is ready. We'll deliver your premium teas soon.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6 no-print">
          <button onClick={downloadPDF}
            className="flex items-center gap-2 bg-tea-700 hover:bg-tea-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md">
            <FiDownload size={18} /> Download Invoice PDF
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 border-2 border-tea-700 text-tea-700 hover:bg-tea-700 hover:text-white font-semibold px-5 py-2.5 rounded-xl transition-all">
            <FiPrinter size={18} /> Print Invoice
          </button>
          <Link to="/" className="flex items-center gap-2 border-2 border-tea-300 text-tea-600 hover:border-tea-500 font-semibold px-5 py-2.5 rounded-xl transition-all">
            <FiHome size={18} /> Back to Home
          </Link>
        </div>

        {/* Invoice Document */}
        <div ref={invoiceRef} className="bg-white rounded-3xl shadow-xl border border-tea-100 overflow-hidden">
          {/* Header */}
          <div className="bg-tea-800 text-white p-8 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <GiTeapot size={36} className="text-chai-cream" />
                <div>
                  <h1 className="font-display text-2xl font-bold text-chai-cream">Chaishala</h1>
                  <p className="text-tea-300 text-xs">Premium Tea Shop</p>
                </div>
              </div>
              <p className="text-tea-300 text-sm">hello@chaishala.com | +91 98765 43210</p>
              <p className="text-tea-300 text-sm">123 Tea Garden Road, Darjeeling, WB 734101</p>
            </div>
            <div className="text-right">
              <div className="bg-chai-warm text-white px-4 py-2 rounded-xl mb-2">
                <p className="text-xs font-semibold opacity-80">INVOICE</p>
                <p className="font-bold font-mono">{order.invoice_number || `INV-${order.id}`}</p>
              </div>
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                ✓ PAID
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Order & Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-chai-light rounded-xl p-4">
                <p className="text-xs font-bold text-tea-500 uppercase tracking-wider mb-3">Bill To</p>
                <p className="font-bold text-tea-800 text-base">{order.customer_name}</p>
                <p className="text-tea-600 text-sm mt-1">{order.customer_email}</p>
                {order.customer_phone && <p className="text-tea-600 text-sm">{order.customer_phone}</p>}
                {order.customer_address && <p className="text-tea-500 text-xs mt-1 leading-relaxed">{order.customer_address}</p>}
              </div>
              <div className="bg-chai-light rounded-xl p-4">
                <p className="text-xs font-bold text-tea-500 uppercase tracking-wider mb-3">Invoice Details</p>
                {[
                  ['Order #', order.order_number],
                  ['Invoice #', order.invoice_number || `INV-${order.id}`],
                  ['Date', new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Payment', (order.payment_method || 'card').toUpperCase()],
                  ['Status', order.status?.toUpperCase()],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm mb-1.5">
                    <span className="text-tea-500">{label}:</span>
                    <span className="font-semibold text-tea-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-tea-800 text-chai-cream">
                    <th className="text-left p-3 rounded-tl-xl">#</th>
                    <th className="text-left p-3">Item</th>
                    <th className="text-center p-3">Qty</th>
                    <th className="text-right p-3">Unit Price</th>
                    <th className="text-right p-3 rounded-tr-xl">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-chai-light'}>
                      <td className="p-3 text-tea-400 text-center">{i + 1}</td>
                      <td className="p-3 font-semibold text-tea-800">{item.tea_name || item.name}</td>
                      <td className="p-3 text-center text-tea-700">{item.quantity}</td>
                      <td className="p-3 text-right text-tea-600">₹{parseFloat(item.unit_price || item.price).toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-tea-800">₹{parseFloat(item.total_price || (item.price * item.quantity)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-tea-600">
                  <span>Subtotal:</span><span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-tea-600">
                  <span>GST (5%):</span><span>₹{parseFloat(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base bg-tea-800 text-chai-cream px-4 py-3 rounded-xl">
                  <span>TOTAL:</span><span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            {order.transaction_id && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                <span className="text-green-700 font-semibold">Transaction ID: </span>
                <span className="text-green-600 font-mono">{order.transaction_id}</span>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-tea-100 text-center">
              <p className="font-display text-tea-700 font-bold text-lg">Thank you for choosing Chaishala! 🍵</p>
              <p className="text-tea-400 text-xs mt-1">For support: hello@chaishala.com | www.chaishala.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/menu" className="flex items-center gap-2 btn-outline">
            Continue Shopping
          </Link>
          <Link to="/my-orders" className="flex items-center gap-2 btn-primary">
            <FiPackage size={16} /> View My Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
