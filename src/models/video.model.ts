import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  segment: { type: Number, required: true },
  mcqs: [mcqSchema],
});

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  transcript: [{ type: String, required: true }],
  questions: [questionSchema],
}, {
  timestamps: true 
});

export const Video = mongoose.model("Video", videoSchema);
