const db = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE status != 'cancelled'");
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'customer'");
    const [[{ totalTeas }]] = await db.query('SELECT COUNT(*) AS totalTeas FROM teas WHERE is_active = 1');
    const [[{ pendingOrders }]] = await db.query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'");
    const [[{ confirmedOrders }]] = await db.query("SELECT COUNT(*) AS confirmedOrders FROM orders WHERE status = 'confirmed'");

    // Recent orders
    const [recentOrders] = await db.query(
      `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.total_amount,
       o.status, o.created_at, i.invoice_number
       FROM orders o LEFT JOIN invoices i ON o.id = i.order_id
       ORDER BY o.created_at DESC LIMIT 10`
    );

    // Monthly revenue (last 6 months)
    const [monthlyRevenue] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
       SUM(total_amount) AS revenue, COUNT(*) AS orders
       FROM orders WHERE status != 'cancelled'
       AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month ORDER BY month`
    );

    // Top teas
    const [topTeas] = await db.query(
      `SELECT t.name, SUM(oi.quantity) AS total_sold, SUM(oi.total_price) AS revenue
       FROM order_items oi JOIN teas t ON oi.tea_id = t.id
       GROUP BY t.id ORDER BY total_sold DESC LIMIT 5`
    );

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        totalUsers,
        totalTeas,
        pendingOrders,
        confirmedOrders
      },
      recentOrders,
      monthlyRevenue,
      topTeas
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, phone, role, created_at,
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS total_orders
       FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = `
      SELECT o.*, i.invoice_number, p.payment_method, p.status AS payment_status, p.payment_screenshot
      FROM orders o
      LEFT JOIN invoices i ON o.id = i.order_id
      LEFT JOIN payments p ON o.id = p.order_id
    `;
    const params = [];
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [orders] = await db.query(query, params);
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM orders' + (status ? ' WHERE status = ?' : ''), status ? [status] : []);

    res.json({ success: true, orders, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'preparing', 'ready', 'served', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Don't allow deleting admin accounts
    const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    if (rows[0].role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });

    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    // Cascades to order_items and payments via FK
    await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getAllUsers, getAllOrders, updateOrderStatus, deleteUser, deleteOrder };
