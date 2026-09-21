const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createOrder, getOrderById, getMyOrders } = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/payments/',
  filename: (req, file, cb) => cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// Public - order by non-logged in users
router.post('/', upload.single('payment_screenshot'), createOrder);

// Protected
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
