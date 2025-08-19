const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // 👈 Make sure this path is correct
const todoRoutes = require('./routes/todoRoutes'); // 👈 Make sure this path is correct

const app = express();
const PORT = 5000;

const __dirname = path.resolve();
// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/todo-react')));

// Routes
app.use("/api/auth", authRoutes); // 👈 This line registers the auth routes
app.use("/todos", todoRoutes); // 👈 This line registers the auth routes

app.get('*', (res, req) => {
    res.sendFile(path.join(__dirname, 'todo-react', 'index.html'));
})
// DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/todo_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error("MongoDB connection failed:", err.message);
});
