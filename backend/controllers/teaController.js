const db = require('../config/db');

const getAllTeas = async (req, res) => {
  try {
    const { category, featured, search, sort } = req.query;
    let query = `
      SELECT t.*, c.name AS category_name, c.slug AS category_slug
      FROM teas t
      LEFT JOIN tea_categories c ON t.category_id = c.id
      WHERE t.is_active = 1
    `;
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    if (featured === 'true') {
      query += ' AND t.is_featured = 1';
    }
    if (search) {
      query += ' AND (t.name LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    switch (sort) {
      case 'price_asc': query += ' ORDER BY t.price ASC'; break;
      case 'price_desc': query += ' ORDER BY t.price DESC'; break;
      case 'rating': query += ' ORDER BY t.rating DESC'; break;
      default: query += ' ORDER BY t.is_featured DESC, t.created_at DESC';
    }

    const [rows] = await db.query(query, params);
    res.json({ success: true, teas: rows });
  } catch (err) {
    console.error('Get teas error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTeaById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, c.name AS category_name FROM teas t
       LEFT JOIN tea_categories c ON t.category_id = c.id
       WHERE t.id = ? AND t.is_active = 1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tea not found' });
    }
    res.json({ success: true, tea: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tea_categories ORDER BY name');
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createTea = async (req, res) => {
  const { name, description, price, category_id, image_url, stock, weight, origin, rating, is_featured } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO teas (name, description, price, category_id, image_url, stock, weight, origin, rating, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, category_id, image_url, stock || 100, weight || '100g', origin, rating || 4.5, is_featured ? 1 : 0]
    );
    res.status(201).json({ success: true, message: 'Tea added successfully', id: result.insertId });
  } catch (err) {
    console.error('Create tea error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateTea = async (req, res) => {
  const { name, description, price, category_id, image_url, stock, weight, origin, rating, is_featured, is_active } = req.body;
  try {
    await db.query(
      `UPDATE teas SET name=?, description=?, price=?, category_id=?, image_url=?,
       stock=?, weight=?, origin=?, rating=?, is_featured=?, is_active=? WHERE id=?`,
      [name, description, price, category_id, image_url, stock, weight, origin, rating, is_featured ? 1 : 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Tea updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteTea = async (req, res) => {
  try {
    await db.query('UPDATE teas SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Tea removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllTeas, getTeaById, getCategories, createTea, updateTea, deleteTea };
