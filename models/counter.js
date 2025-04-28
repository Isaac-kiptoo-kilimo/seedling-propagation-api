import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  dateKey: {
    type: String, // e.g., '20240419'
    required: true,
    unique: true
  },
  lastOrderNumber: {
    type: Number,
    required: true
  }
},{ timestamps: true });

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
