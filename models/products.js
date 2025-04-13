const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  price: {
    type: Number,
    required: true,
  },
  image: String,
  inStock: {
    type: Boolean,
    default: true,
  },
  createdBy: String,
  modifiedBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
