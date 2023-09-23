import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    task: String
});

export default mongoose.model('task', taskSchema, 'tasks');