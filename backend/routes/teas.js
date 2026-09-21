const express = require('express');
const router = express.Router();
const { getAllTeas, getTeaById, getCategories, createTea, updateTea, deleteTea } = require('../controllers/teaController');
const { adminMiddleware } = require('../middleware/auth');

router.get('/', getAllTeas);
router.get('/categories', getCategories);
router.get('/:id', getTeaById);
router.post('/', adminMiddleware, createTea);
router.put('/:id', adminMiddleware, updateTea);
router.delete('/:id', adminMiddleware, deleteTea);

module.exports = router;
