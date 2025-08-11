const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

// Use :id instead of :index
router.get('/', auth, getTodos);
router.post('/', auth, createTodo);
router.put('/:id', auth, updateTodo);      // ✅ updated
router.delete('/:id', auth, deleteTodo);   // ✅ updated



module.exports = router;
