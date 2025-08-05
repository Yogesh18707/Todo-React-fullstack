import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './styles.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState('login'); // login | signup | todos
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Load todos when token changes
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/todos', {
        headers: { Authorization: `Bearer ${token}` },
      })
          .then(res => res.json())
          .then(data => {
            setTodos(data);
            setView('todos');
          })
          .catch(err => {
            console.error("Error loading todos", err);
            setToken('');
            setView('login');
          });
    }
  }, [token]);

  const addTodo = (text) => {
    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };

  const toggleCompleted = (index) => {
    const updated = { ...todos[index], completed: !todos[index].completed };
    fetch(`http://localhost:5000/todos/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updated)
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };

  const editTodo = (index, newText) => {
    const updated = { ...todos[index], text: newText };
    fetch(`http://localhost:5000/todos/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updated)
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };

  const removeTodo = (index) => {
    fetch(`http://localhost:5000/todos/${index}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTodos([]);
    setView('login');
  };

  // Handlers for login/signup success
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleSignupSuccess = () => {
    setView('login');
  };

  // View logic
  if (view === 'signup') {
    return (
        <div className="app">
          <SignupForm onSignup={handleSignupSuccess} />
          <p style={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="login-btn">Login</button>
          </p>
        </div>
    );
  }

  if (!token || view === 'login') {
    return (
        <div className="app">
          <LoginForm onLogin={handleLoginSuccess} />
          <p style={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <button onClick={() => setView('signup')} className="signup-btn">Sign Up</button>
          </p>
        </div>
    );
  }

  // Todo list view
  return (
      <div className="app">
        <div className="auth-buttons">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <h1>📝 Todo App</h1>
        <TodoForm addTodo={addTodo} />
        {todos.map((todo, index) => (
            <Todo
                key={index}
                index={index}
                todo={todo}
                toggleCompleted={toggleCompleted}
                removeTodo={removeTodo}
                editTodo={editTodo}
            />
        ))}
      </div>
  );
}

export default App;
