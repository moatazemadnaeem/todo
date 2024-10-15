import mongoose from "mongoose";
export interface UserRes extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  tasks: TaskRes[];
}
export interface TaskRes extends mongoose.Document {
  content: string;
  status: string;
  _id: mongoose.Schema.Types.ObjectId;
}
