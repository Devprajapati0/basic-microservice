import { Schema } from "mongoose";
import mongoose from "mongoose";

const rideSchema = new Schema({
 driver:{
    type: Schema.Types.ObjectId,
    ref: 'Captain',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  dropof: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['requesting', 'inprogress', 'accepted', 'cancelled'],
    default: 'requesting',
  },
}, {
  timestamps: true,
});
export const Ride = mongoose.model('Ride', rideSchema);