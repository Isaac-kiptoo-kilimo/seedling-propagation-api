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
    county: { type: String },
    streetAddress: { type: String }
  },

  // Product details
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],

  // Total order price
  totalAmount: { type: Number, required: true },

   // Payment details
   paymentMethod: {
    type: String,
    enum: ['Cash', 'Mpesa'],
    default: null
  },
  paymentDetails: {
    cash: {
      amount: { type: Number },
      completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    mpesa: {
      transactionCode: { type: String },
      timePaid: { type: Date },
      amount: { type: Number },
      completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },
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
    enum: ['Pending', 'Processing','InTransit','Delivered', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
    // New field for delivery confirmation with e-signature
    deliveryConfirmation: {
      signature: String,
      confirmedAt: Date,
      notes: String,
      receivedBy: String,
      confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },

  // Audit fields
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
