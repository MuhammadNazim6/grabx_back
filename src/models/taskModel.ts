import mongoose, { Schema, Document, Model, ObjectId } from 'mongoose';

interface ITask extends Document {
  userId: ObjectId;
  content: string;
  status: 'done' | 'todo' | 'progress'
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true }, 
    status: { type: String, required: true, default:'todo'}
  },
  {
    timestamps: true
  }
);

export const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);