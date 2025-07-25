import React, {useState, useEffect} from 'react';
import TodoForm from './TodoForm'
import Todo from './Todo'
import './styles.css'
import toDo from './assets/to-do-list.png'



function App(){
  const [todos, setTodos] = useState(() => {
    const storedTodos =localStorage.getItem('todos');
    return storedTodos ?  JSON.parse(storedTodos) : [];
  })
  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(todos));
  },[todos])

  const addTodo = (text) => {
    const newTodos = [...todos,{text, completed: false , isEditing: false}];
    setTodos(newTodos);
  }
  const toggleCompleted = (index) => {
    const newTodos = [...todos];
    newTodos[index].complete =!newTodos[index].complete;
    setTodos(newTodos);
  };
  const removeTodo = (index) => {
    const newTodos = todos.filter((_,i) => i !==index);
    setTodos(newTodos);
  }
  const editTodo = (index, newText = null, toggleEdit = false) => {
    const updatedTodos = [...todos];

    if (toggleEdit) {
      updatedTodos[index].isEditing = true;
    } else {
      updatedTodos[index].text =newText;
      updatedTodos[index].isEditing = false;
    }
    setTodos(updatedTodos)
  };
  return (
      <div className="app">
        <h1><img src={toDo} alt="icon" height={40}/> Todo App</h1>
        <TodoForm addTodo={addTodo}/>
        {todos.map((todo,index) => (
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
