const db = require('../config/db');

const generateOrderNumber = () => {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `CSL-${ymd}-${rand}`;
};

const generateInvoiceNumber = (orderId) => {
  return `INV-${new Date().getFullYear()}-${String(orderId).padStart(6, '0')}`;
};

const createOrder = async (req, res) => {
  const { customer_name, customer_email, customer_phone, customer_address, payment_method, notes } = req.body;
  // items may arrive as a JSON string from FormData
  let items;
  try {
    items = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items;
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid items data' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Validate items and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const [tea] = await conn.query('SELECT id, name, price, stock FROM teas WHERE id = ? AND is_active = 1', [item.tea_id]);
      if (tea.length === 0) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Tea ID ${item.tea_id} not found` });
      }
      if (tea[0].stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Insufficient stock for ${tea[0].name}` });
      }
      const itemTotal = tea[0].price * item.quantity;
      subtotal += itemTotal;
      validatedItems.push({ ...tea[0], quantity: item.quantity, total: itemTotal });
    }

    const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
    const totalAmount = parseFloat((subtotal + tax).toFixed(2));
    const orderNumber = generateOrderNumber();
    const userId = req.user ? req.user.id : null;

    // Create order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone,
       customer_address, subtotal, tax, total_amount, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [orderNumber, userId, customer_name, customer_email, customer_phone, customer_address, subtotal, tax, totalAmount, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert order items and update stock
    for (const item of validatedItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, tea_id, tea_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.quantity, item.price, item.total]
      );
      await conn.query('UPDATE teas SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
    }

    // Mock payment processing
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const screenshotPath = req.file ? `/uploads/payments/${req.file.filename}` : null;
    await conn.query(
      `INSERT INTO payments (order_id, transaction_id, amount, payment_method, status, payment_screenshot)
       VALUES (?, ?, ?, ?, 'success', ?)`,
      [orderId, transactionId, totalAmount, payment_method || 'card', screenshotPath]
    );

    // Update order status to confirmed
    await conn.query("UPDATE orders SET status = 'confirmed' WHERE id = ?", [orderId]);

    // Generate invoice
    const invoiceNumber = generateInvoiceNumber(orderId);
    const issuedDate = new Date().toISOString().split('T')[0];
    await conn.query(
      'INSERT INTO invoices (invoice_number, order_id, issued_date) VALUES (?, ?, ?)',
      [invoiceNumber, orderId, issuedDate]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: orderId,
        order_number: orderNumber,
        invoice_number: invoiceNumber,
        customer_name,
        customer_email,
        items: validatedItems,
        subtotal,
        tax,
        total_amount: totalAmount,
        payment_method: payment_method || 'card',
        transaction_id: transactionId,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  } finally {
    conn.release();
  }
};

const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, i.invoice_number, p.transaction_id, p.payment_method, p.status AS payment_status
       FROM orders o
       LEFT JOIN invoices i ON o.id = i.order_id
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Verify ownership or admin
    if (req.user && req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    res.json({ success: true, order: { ...order, items } });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, i.invoice_number FROM orders o
       LEFT JOIN invoices i ON o.id = i.order_id
       WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createOrder, getOrderById, getMyOrders };
