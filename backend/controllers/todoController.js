const Todo = require('../models/Todo');

// Get all todos for a user
exports.getTodos = async (req, res) => {
    try {
        const userId = req.userId;
        const todos = await Todo.find({ userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching todos' });
    }
};

// Create a new todo
exports.createTodo = async (req, res) => {
    try {
        const { text } = req.body;
        const newTodo = new Todo({ text, userId: req.userId });
        await newTodo.save();
        const todos = await Todo.find({ userId: req.userId });
        res.json({ todos });
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating todo' });
    }
};

// Update a todo by its ID
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const todo = await Todo.findOne({ _id: id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (updatedData.text !== undefined) todo.text = updatedData.text;
        if (updatedData.completed !== undefined) todo.completed = updatedData.completed;

        await todo.save();
        const todos = await Todo.find({ userId: req.userId });
        res.json({ todos });
    } catch (err) {
        res.status(500).json({ message: 'Server error while updating todo' });
    }
};

// Delete a todo by its ID
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findOne({ _id: id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        await Todo.findByIdAndDelete(id);
        const todos = await Todo.find({ userId: req.userId });
        res.json({ todos });
    } catch (err) {
        res.status(500).json({ message: 'Server error while deleting todo' });
    }
};
