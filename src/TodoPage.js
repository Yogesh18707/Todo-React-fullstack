import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import { useNavigate } from "react-router-dom";

function TodoPage({ token, setToken, setView }) {
    const [todos, setTodos] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const navigate = useNavigate();

    const API_BASE = 'http://localhost:5000/todos';
    const API_KEY = 'e4d2b7c9f4a84c9f9a96c27f53dcd2b7'; // Replace with actual API key

    // Fetch todos from backend
    useEffect(() => {
        fetch(API_BASE, {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-api-key': API_KEY
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.todos) setTodos(data.todos);
            })
            .catch(err => console.error('Error fetching todos:', err));
    }, [token]);

    const addTodo = (text) => {
        fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ text }),
        })
            .then(res => res.json())
            .then(data => setTodos(data.todos || []))
            .catch(err => console.error('Error adding todo:', err));
    };

    const deleteTodo = (index) => {
        const todoId = todos[index]._id;
        fetch(`${API_BASE}/${todoId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'x-api-key': API_KEY
            },
        })
            .then(() => {
                setTodos(prev => prev.filter((_, i) => i !== index));
            })
            .catch(err => console.error('Error deleting todo:', err));
    };

    const toggleComplete = (index) => {
        const todoId = todos[index]._id;
        const updatedStatus = !todos[index].completed;

        fetch(`${API_BASE}/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ completed: updatedStatus }),
        })
            .then(() => {
                setTodos(prev => {
                    const updated = [...prev];
                    updated[index].completed = updatedStatus;
                    return updated;
                });
            })
            .catch(err => console.error('Error updating todo:', err));
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditText(todos[index].text);
    };

    const saveEdit = (index) => {
        const todoId = todos[index]._id;

        fetch(`${API_BASE}/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ text: editText }),
        })
            .then(() => {
                setTodos(prev => {
                    const updated = [...prev];
                    updated[index].text = editText;
                    return updated;
                });
                setEditingIndex(null);
            })
            .catch(err => console.error('Error saving edit:', err));
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token'); // keep token removal
        sessionStorage.clear();
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
                    <li key={todo._id || index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
