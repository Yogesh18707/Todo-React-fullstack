import React, { useState, useEffect } from 'react';
import './styles.css';

function Todo({ todo, index, toggleCompleted, removeTodo, editTodo }) {
    const [editValue, setEditValue] = useState(todo.text);
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        setEditValue(todo.text);
    }, [todo.text]);

    const handleSave = () => {
        if (editValue.trim() !== '') {
            editTodo(index, editValue);
            setShowInput(false);
        }
    };

    return (
        <>
            <header className="header">
                <h2>📝 Todo App</h2>
            </header>

            {/* Main Todo Item */}
            <div className="todo">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleCompleted(index)}
                    />
                    <span className="checkmark"></span>
                </label>

                {showInput ? (
                    <>
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className={`todo-input ${todo.completed ? 'completed' : ''}`}
                        />
                        <button className="save-btn" onClick={handleSave}>💾</button>
                    </>
                ) : (
                    <span
                        onClick={() => toggleCompleted(index)}
                        className={`todo-text ${todo.completed ? 'completed' : ''}`}
                        style={{ textDecoration: todo.completed ? 'line-through' : '' }}
                    >
                        {todo.text}
                    </span>
                )}

                <div className="button-group">
                    <button
                        className="edit-btn"
                        onClick={() => setShowInput(!showInput)}
                    >
                        ✏️
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => removeTodo(index)}
                    >
                        ❌
                    </button>
                </div>
            </div>
        </>
    );
}

export default Todo;
