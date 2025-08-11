const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const mockTodosArray = [];

const authenticateToken = (req, res, next) => {
    next(); // Bypass auth for now
};

app.get('/todos', authenticateToken, (req, res) => {
    res.json({ todos: mockTodosArray });
});

app.post('/todos', authenticateToken, (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const newTodo = {
        id: Date.now().toString(),
        text,
        completed: false,
    };

    mockTodosArray.push(newTodo);
    res.status(201).json(newTodo);
});

app.listen(5000, () => {
    console.log('✅ Server running on port 5000');
});
