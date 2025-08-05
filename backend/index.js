const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET = 'myjwtsecret';

app.use(cors());
app.use(express.json());

const users = []; // In-memory users
const todosByUser = {}; // key: username, value: todos[]

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed });
    todosByUser[username] = [];
    res.status(201).json({ message: 'User created' });
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Get todos (protected)
app.get('/todos', authenticateToken, (req, res) => {
    const todos = todosByUser[req.user.username] || [];
    res.json(todos);
});

// Add todo
app.post('/todos', authenticateToken, (req, res) => {
    const { text } = req.body;
    const todos = todosByUser[req.user.username] || [];
    todos.push({ text, completed: false });
    todosByUser[req.user.username] = todos;
    res.json({ todos });
});

// Update todo
app.put('/todos/:index', authenticateToken, (req, res) => {
    const index = req.params.index;
    const todos = todosByUser[req.user.username];
    if (!todos || !todos[index]) return res.sendStatus(404);

    todos[index] = req.body;
    res.json({ todos });
});

// Delete todo
app.delete('/todos/:index', authenticateToken, (req, res) => {
    const index = req.params.index;
    const todos = todosByUser[req.user.username];
    if (!todos || !todos[index]) return res.sendStatus(404);

    todos.splice(index, 1);
    res.json({ todos });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
