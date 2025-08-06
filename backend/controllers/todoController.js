const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
    const userId = req.userId;
    const todos = await Todo.find({ userId });
    res.json(todos);
};

exports.createTodo = async (req, res) => {
    const { text } = req.body;
    const newTodo = new Todo({ text, userId: req.userId });
    await newTodo.save();
    const todos = await Todo.find({ userId: req.userId });
    res.json({ todos });
};

exports.updateTodo = async (req, res) => {
    const { index } = req.params;
    const updatedData = req.body;
    const todos = await Todo.find({ userId: req.userId });
    if (!todos[index]) return res.status(404).json({ message: 'Todo not found' });

    todos[index].text = updatedData.text;
    todos[index].completed = updatedData.completed;
    await todos[index].save();

    const updatedTodos = await Todo.find({ userId: req.userId });
    res.json({ todos: updatedTodos });
};

exports.deleteTodo = async (req, res) => {
    const { index } = req.params;
    const todos = await Todo.find({ userId: req.userId });
    if (!todos[index]) return res.status(404).json({ message: 'Todo not found' });

    await Todo.findByIdAndDelete(todos[index]._id);
    const updatedTodos = await Todo.find({ userId: req.userId });
    res.json({ todos: updatedTodos });
};
