import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isGoogle: Boolean
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isGoogle: { type: Boolean, required: true, default: false }

  },
  {
    timestamps: true
  }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);