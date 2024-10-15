import mongoose from "mongoose";
import { UserRes } from "../types/modelsTypes";
import task from "./taskModel";
const userschema = new mongoose.Schema<UserRes>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: {
    type: [task],
  },
});

const User = mongoose.model<UserRes>("User", userschema);
export default User;
