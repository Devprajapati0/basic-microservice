import { Schema } from "mongoose";
import mongoose from "mongoose";

const CaptainSchema = new Schema({
  username: {
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
  isAvailble: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});
export const Captain = mongoose.model('Captain', CaptainSchema);