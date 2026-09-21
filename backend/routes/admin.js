const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllOrders, updateOrderStatus, deleteUser, deleteOrder } = require('../controllers/adminController');
const { adminMiddleware } = require('../middleware/auth');

router.use(adminMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

module.exports = router;
