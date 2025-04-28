import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String },
  initialPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  productQuantity: { type: Number, required: true },
  productImage: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  onOffer: { type: Boolean, default: false },
  offerPrice: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
},{ timestamps: true });

productSchema.pre('save', function (next) {
  if (this.productQuantity <= 0) {
    this.isActive = false;
  } else {
    this.isActive = true;
  }
  next();
});


const Product = mongoose.model('Product', productSchema);

export default Product;
