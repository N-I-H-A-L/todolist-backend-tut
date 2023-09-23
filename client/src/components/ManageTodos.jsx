import React, { useState } from 'react'
import styled from 'styled-components';
import TodoList from './TodoList.jsx';
import axios from './../axios.js';

const ManageTodos = ({ todoList }) => {
  const [todoInput, setTodoInput] = useState("");

  const handleInputChange = (e) =>{
    setTodoInput(e.target.value);
  }
  const addTodoBtn = () =>{
    //To add a new todo simply make a POST request to '/tasks/new' with the data of the todo. 
    axios.post('/tasks/new', {
      task: todoInput
    });
    setTodoInput("");
  }
  return (
    <div>
      <InputToDo className="inputToDo" value={todoInput} onChange={(e) => handleInputChange(e)} type="text" placeholder="Add new To Do"></InputToDo>
      <AddToDo className="addToDo" onClick={addTodoBtn}>Add Task</AddToDo>
      <TodoList todos={todoList}/>
    </div>
  )
}

export default ManageTodos;

const InputToDo = styled.input`
  padding: 5px;
  width: 200px;
`;

const AddToDo = styled.button`
  padding: 5px;
  background-color: #cbdada;
  border-color: #cbdada;
  margin-bottom: 10px;

  &:hover{
    background-color: #dce7e7;
    cursor: pointer;
  }
`;