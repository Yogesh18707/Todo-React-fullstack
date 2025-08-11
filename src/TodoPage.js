import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import { useNavigate } from "react-router-dom";

function TodoPage({ token, setToken, setView }) {
    const [todos, setTodos] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const navigate = useNavigate();

    // Load todos from localStorage first
    useEffect(() => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }

        // Then fetch from backend
        fetch('http://localhost:5000/todos', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.todos) {
                    setTodos(data.todos);
                }
            })
            .catch(err => console.error('Error fetching todos:', err));
    }, [token]);

    // Save todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text) => {
        const newTodo = { text, completed: false };
        setTodos([...todos, newTodo]);

        fetch('http://localhost:5000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        })
            .then(res => res.json())
            .then(data => setTodos(data.todos || []))
            .catch(err => console.error('Error adding todo:', err));
    };

    const deleteTodo = (index) => {
        const todoId = todos[index]._id;
        setTodos(todos.filter((_, i) => i !== index));

        fetch(`http://localhost:5000/todos/${todoId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }).catch(err => console.error('Error deleting todo:', err));
    };

    const toggleComplete = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].completed = !updatedTodos[index].completed;
        setTodos(updatedTodos);

        const todoId = updatedTodos[index]._id;
        fetch(`http://localhost:5000/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ completed: updatedTodos[index].completed }),
        }).catch(err => console.error('Error updating todo:', err));
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditText(todos[index].text);
    };

    const saveEdit = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].text = editText;
        setTodos(updatedTodos);
        setEditingIndex(null);

        const todoId = updatedTodos[index]._id;
        fetch(`http://localhost:5000/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: editText }),
        }).catch(err => console.error('Error saving edit:', err));
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="app">
            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
            <h1>📝 Todo App</h1>

            <TodoForm addTodo={addTodo} />

            <ul>
                {todos.map((todo, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(index)}
                        />
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit(index);
                                    }}
                                />
                                <button onClick={() => saveEdit(index)}>💾</button>
                            </>
                        ) : (
                            <>
                                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                    {todo.text}
                                </span>
                                <button onClick={() => startEditing(index)}>✎</button>
                            </>
                        )}
                        <button onClick={() => deleteTodo(index)}>✘</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoPage;
