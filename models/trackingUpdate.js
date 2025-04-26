import mongoose from 'mongoose';

// New schema for tracking history
const TrackingUpdateSchema = new mongoose.Schema({
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    status: {
      type: String,
      required: true
    },
    notes: String,
    location: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }, { timestamps: true });
  
  const TrackingUpdate = mongoose.model('TrackingUpdate', TrackingUpdateSchema);

  export default TrackingUpdate;
