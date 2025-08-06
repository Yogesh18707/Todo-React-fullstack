const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

router.get('/', auth, getTodos);
router.post('/', auth, createTodo);
router.put('/:index', auth, updateTodo);
router.delete('/:index', auth, deleteTodo);

module.exports = router;
