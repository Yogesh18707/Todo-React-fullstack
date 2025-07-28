import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import './styles.css';

function App() {
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    fetch('http://localhost:5000/todos')
        .then(res => res.json())
        .then(data => setTodos(data))
        .catch(err => console.error("Error loading todos", err));
  }, []);



  const addTodo = (text) => {
    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos))
        .catch(err => console.error("Error adding todo", err));
  };



  const toggleCompleted = (index) => {
    const updated = { ...todos[index], completed: !todos[index].completed };

    fetch(`http://localhost:5000/todos/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };



  const editTodo = (index, newText) => {
    const updated = { ...todos[index], text: newText };

    fetch(`http://localhost:5000/todos/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };



  const removeTodo = (index) => {
    fetch(`http://localhost:5000/todos/${index}`, {
      method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => setTodos(data.todos));
  };


  return (
      <div className="app">
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
