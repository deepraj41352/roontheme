import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTask' },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
