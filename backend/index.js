import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    todos.push({ text, completed: false, isEditing: false });
    res.status(201).json({ message: 'Todo added', todos });
});

app.put('/todos/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index < 0 || index >= todos.length) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const { text, completed, isEditing } = req.body;

    if (text !== undefined) todos[index].text = text;
    if (completed !== undefined) todos[index].completed = completed;
    if (isEditing !== undefined) todos[index].isEditing = isEditing;

    res.status(200).json({ message: 'Todo updated', todos });
});

app.delete('/todos/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index < 0 || index >= todos.length) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(index, 1);
    res.status(200).json({ message: 'Todo deleted', todos });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
