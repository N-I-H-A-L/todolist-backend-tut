import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import Tasks from './taskSchema.js';
import Pusher from 'pusher';

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const connection_URL = 'mongodb+srv://admin:WwQXYxGDVZjyDf0c@cluster0.lzllsp8.mongodb.net/';
mongoose.connect(connection_URL);
const server = http.createServer(app);

//Pusher API
const pusher = new Pusher({
    appId: "1675146",
    key: "5445f788d27b3e069dc3",
    secret: "51f04cce8816a149dbf4",
    cluster: "ap2",
    useTLS: true
  });

const db = mongoose.connection;
db.once('open', ()=>{
    //Once the database is 'open' or connected successfully, run this callback function. 
    console.log('DB is connected');
    //Get the tasks collection.
    const tasksCollection = db.collection('tasks');
    //Watch out the tasks collection for any changes in the database.
    const changeStream = tasksCollection.watch();

    //When database is changed:
    changeStream.on('change', (change)=>{
        //If operation type of change is insert (data got inserted in database)
        if(change.operationType=='insert'){
            //Get the full document
            const taskDetails = change.fullDocument;
            //Trigger Pusher
            pusher.trigger('tasks', 'inserted', {
                //'tasks' is the channel name and 'inserted' is the event name.
                _id: taskDetails._id,
                task: taskDetails.task
            });
        }
        else if(change.operationType=='delete'){
            pusher.trigger('tasks', 'deleted', {
                deleteId: change._id
            });
        }
        else{
            console.log("Error triggering Pusher");
        } 
    })
});

//If someone makes a GET request to '/' URL, send 'Hello World' as response.
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/tasks/sync', (req, res)=>{
    Tasks.find()
        .then((data)=> res.send(data))
        .catch((err) => console.log(err));
});

app.post('/tasks/new', (req, res)=>{
    //When making POST request, the client will send information as well, which will be retrieved using 
    // req.body.
    const task = req.body;

    //Add the new task to the database.
    Tasks.create(task)
        .then()
        //500 is for Internal Server Error
        .catch((err) => console.log(err));
    res.send("Task added successfully");
});

//For deleting a task, a post request will be sent by the client with the req's body containing the ID of the 
//task to be deleted
app.post('/tasks/delete', (req, res)=>{
    const deleteId = req.body.deleteId; 
    Tasks.deleteOne({_id: deleteId})
        .then(result => {
            if (result.deletedCount === 1) {
                res.send("Task deleted successfully");
            } else {
                res.send("Task not found");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

server.listen(port, ()=>{
    console.log("Server has started!");
});