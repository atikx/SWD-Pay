import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["none", "in-progress", "completed"],
    default: "none",
  },
  deductions: {
    type: Number,
    default: 0,
  },
  orders: {
    type: Array,
    default: [],
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique email addresses
  },
});

export default mongoose.model("User", UserSchema);
