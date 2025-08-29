import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_BACKEND_URL;
console.log(API_BASE)
function TodoPage({ token, setToken }) {
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [username, setUsername] = useState("");
  const navigate = useNavigate();


  // ✅ Fetch todos
  const fetchTodos = useCallback(() => {
    fetch(`${API_BASE}/api/todos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // handle both `{todos: []}` and direct `[]`
        if (Array.isArray(data)) {
            console.log(data)
          setTodos(data);
        } else if (data.todos && Array.isArray(data.todos)) {
          setTodos(data.todos);
        } else {
          setTodos([]);
        }
      })
      .catch(err => console.error("Error fetching todos:", err));
  }, [token]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

  // ✅ Load username from storage
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  // ✅ Add todo
  const addTodo = (text) => {
    fetch(`${API_BASE}/api/todos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    })
      .then(() => fetchTodos())
      .catch(err => console.error("Error adding todo:", err));
  };

  // ✅ Delete todo
  const deleteTodo = (index) => {
    const todoId = todos[index]?._id;
    if (!todoId) return;

    fetch(`${API_BASE}/api/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => fetchTodos())
      .catch(err => console.error("Error deleting todo:", err));
  };

  // ✅ Toggle complete
  const toggleComplete = (index) => {
    const todoId = todos[index]?._id;
    if (!todoId) return;

    const updatedStatus = !todos[index].completed;

    fetch(`${API_BASE}/api/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: updatedStatus }),
    })
      .then(() => fetchTodos())
      .catch(err => console.error("Error updating todo:", err));
  };

  // ✅ Start editing
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(todos[index].text);
  };

  // ✅ Save edit
  const saveEdit = (index) => {
    const todoId = todos[index]?._id;
    if (!todoId) return;

    fetch(`${API_BASE}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: editText }),
    })
      .then(() => {
        fetchTodos();
        setEditingIndex(null);
      })
      .catch(err => console.error("Error saving edit:", err));
  };

  // ✅ Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="app">
      <h3 className="text-xl font-bold">Welcome {username}</h3>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      <h1>📝 Todo App</h1>

      <TodoForm addTodo={addTodo} />

      <ul>
        {todos.map((todo, index) => (
          <li
            key={todo._id || index}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
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
                    if (e.key === "Enter") saveEdit(index);
                  }}
                />
                <button onClick={() => saveEdit(index)}>💾</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
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
