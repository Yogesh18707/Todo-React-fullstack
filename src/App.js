// App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TodoForm from './TodoForm';
import Todo from './Todo';
import './styles.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'todos'
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Fetch todos on login
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/todos', {
        headers: { Authorization: `Bearer ${token}` }
      })
          .then(res => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
          })
          .then(data => {
            setTodos(data);
            setView('todos');
          })
          .catch(err => {
            console.error('Error loading todos:', err);
            localStorage.removeItem('token');
            setToken('');
            setView('login');
          });
    }
  }, [token]);

  // Handle login
  const handleLoginSuccess = (newToken) => {
    alert('Login successful ✅');
    localStorage.setItem('token', newToken);
    setToken(newToken); // Triggers useEffect to fetch todos
  };

  // Handle signup
  const handleSignupSuccess = () => {
    alert('Signup successful, please login.');
    setView('login');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTodos([]);
    setView('login');
  };

  // Add new todo
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

  // Toggle todo complete
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

  // Edit todo
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

  // Delete todo
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

  // ===== RENDER VIEW =====
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

  if (view === 'login') {
    return (
        <div className="app">
          <LoginForm
              onLogin={handleLoginSuccess}
              onForgotPassword={() => alert('Forgot password not implemented')}
          />
          <p style={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <button onClick={() => setView('signup')} className="signup-btn">Sign Up</button>
          </p>
        </div>
    );
  }

  // Todo view
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
