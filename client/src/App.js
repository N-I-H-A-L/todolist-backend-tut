import './App.css';
import Header from './components/Header.jsx';
import ManageTodos from './components/ManageTodos.jsx';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import axios from './axios';

function App() {

  const [tasks, setTasks] = useState([]);

  //Initially when the component renders, load all the todos of database. 
  useEffect(()=>{
    axios.get('/tasks/sync')
      .then((res)=>{
        setTasks(res.data);
      });
  }, []);

  useEffect(()=>{
    const pusher = new Pusher('5445f788d27b3e069dc3', {
      cluster: 'ap2'
    });
    
    //Channel name will be same as the channel which you triggered from the Backend. 
    const channel = pusher.subscribe('tasks');
    channel.bind('inserted', function(newTask) {
      //If the event called by Pusher is 'inserted' then run the following callback function. 
      //'data' will contain the data sent by the backend when Pusher was triggered.
      setTasks([...tasks, newTask]);
    });
    //When the 'deleted' event is called, it means a todo got deleted so make a GET request to get the updated
    //list of todos from the database.
    channel.bind('deleted', (deleteId)=>{
      axios.get('/tasks/sync')
      .then((res)=>{
        setTasks(res.data);
      });
    })

    return () =>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [tasks]);
  
  return (
    <>
      <Header />
      <ManageTodos todoList={tasks}/>
    </>
  );
}

export default App;
