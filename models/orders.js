import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  purchaseNumber: { type: String, required: true, unique: true },

  // If user is logged in — linked here
  placedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // If guest — store guest info here
  guestInfo: {
    fullName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    deliveryAddress: { type: String }
  },

  // Product details
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],

  // Total order price
  totalAmount: { type: Number, required: true },

  // Dates
  orderDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  cancellationDate: { type: Date },

  // Statuses
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },

  // Audit fields
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
