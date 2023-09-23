import React from 'react';
import styled from 'styled-components';
import axios from './../axios';

const Todo = (props) => {
  const deleteTodo = (e) =>{
    //For deleting a Todo simply make a POST request to '/tasks/delete' with the ID of the Todo.
    let getId = String(e.target.id);
    axios.post('/tasks/delete', {
      deleteId: getId
    });
  }
  return (
    <>
      <TodoDiv>
        {props.value}
      </TodoDiv>
      <Delete id={props.id} onClick={(e) => deleteTodo(e)}>Delete</Delete>
    </>
  )
}

export default Todo;

const TodoDiv = styled.div`
  margin-top: 10px;
  width: 280px;
  background-color: #7e7878;
  padding: 3px;
  border: 2px solid #535050;
  display: flex;
  justify-content: space-between;
  color: white;
  overflow-x: auto;
`;

const Delete = styled.button`
  background-color: #cbdada;
  border-color: #cbdada;

  &:hover{
    background-color: #dce7e7;
    cursor: pointer;
  }
`;
