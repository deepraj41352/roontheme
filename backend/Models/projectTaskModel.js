import mongoose from 'mongoose';

const projectTaskSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const projectTask = mongoose.model('ProjectTask', projectTaskSchema);
export default projectTask;
