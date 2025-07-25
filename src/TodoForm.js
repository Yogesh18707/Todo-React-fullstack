import React, {useState} from 'react';
import './styles.css'


function TodoForm({ addTodo }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim())return;
        addTodo(value);
        setValue('');
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                type="text"
                placeholder="Add Task"
            />
            <button className="Addbtn">Add</button>
        </form>
    );
}
export default TodoForm;