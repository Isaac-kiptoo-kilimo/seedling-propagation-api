import Product from '../models/products.js';

export const processOrderProducts = async (products) => {
  let totalAmount = 0;
  const processedProducts = [];
  
  for (const item of products) {
    const product = await Product.findById(item._id);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    if (product.productQuantity < item.quantity) {
      throw new Error(`Insufficient stock for ${product.productName}`);
    }

    product.productQuantity -= item.quantity;
    await product.save();

    const price = product.onOffer ? product.offerPrice : product.price;
    totalAmount += price * item.quantity;

    processedProducts.push({
      product: product._id,
      quantity: item.quantity
    });
  }

  return { totalAmount, processedProducts };
};
