import mongoose from "mongoose";
const task = new mongoose.Schema({
  status: {
    type: String,
    default: "not-started",
    enum: ["done", "in-progress", "not-started"],
  },
  content: {
    type: String,
    required: true,
  },
});

export default task;
