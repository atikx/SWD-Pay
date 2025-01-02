import mongoose from "mongoose";
import { Schema } from "mongoose";

const QuestionsSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  askedby: {
    type: String,
  },
  answeredby: {
    type: String,
  },
});

export default mongoose.model("Questions", QuestionsSchema);
