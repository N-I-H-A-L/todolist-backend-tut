import React from 'react'
import Todo from './Todo.jsx';

const TodoList = ({ todos }) => {
  return (
    <div>
      {todos.map((todo)=>(
        // Passing the ID will help in deletion of the respective Todo.
        <Todo id={todo._id} value={todo.task} todoList={todos}/>
      ))
      }
    </div>
  )
}

export default TodoList
