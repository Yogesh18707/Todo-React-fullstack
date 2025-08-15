import React, { useState } from 'react';

function TodoForm({addTodo}) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;

        addTodo(value);
        setValue('');
};

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Add Task"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit">Add</button>
        </form>
    );
}

export default TodoForm;
