import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTask' },
    taskName: { type: String },
    taskDescription: { type: String },
    taskCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    agentName: { type: String },
    projectName: { type: String },
    taskStatus: { type: String, default: 'waiting' },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
