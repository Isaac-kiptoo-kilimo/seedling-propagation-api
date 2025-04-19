import Order from '../models/orders.js';
import generatePurchaseOrderNumber from '../utils/generatePurchaseOrderNumber.js';

import { processOrderProducts } from '../utils/processOrderProducts.js';

export const createOrder = async (req, res) => {
  try {
    const { products, guestInfo, paymentStatus } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in the order' });
    }

    const { totalAmount, processedProducts } = await processOrderProducts(products);
    const purchaseOrderNumber = await generatePurchaseOrderNumber();

    const order = new Order({
      products: processedProducts,
      totalAmount,
      purchaseNumber: purchaseOrderNumber,
      paymentStatus: paymentStatus || 'Pending',
      fulfillmentStatus: 'Pending',
      orderDate: new Date(),
      placedBy: req.user ? req.user._id : null,
      guestInfo: req.user ? null : guestInfo
    });

    await order.save();

    await order.populate([
      { path: 'products.product', select: 'productName price offerPrice onOffer' },
      { path: 'placedBy', select: 'fullName' }
    ]);

    return res.status(201).json({ message: 'Order placed successfully', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all orders (optional filters)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product', 'productName price offerPrice onOffer')
      .populate('placedBy', 'fullName')
      .populate('completedBy', 'fullName');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    return res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get orders for logged in user
export const getUserOrders = async (req, res) => {
  try {
    const { user } = req;

    const orders = await Order.find({ placedBy: user._id })
      .populate('products.product', 'productName price offerPrice onOffer')
      .populate('placedBy', 'fullName')
      .populate('completedBy', 'fullName');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    return res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get orders for a specific user (by userId)
export const getOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ placedBy: userId })
      .populate('products.product', 'productName price offerPrice onOffer')
      .populate('placedBy', 'fullName')
      .populate('completedBy', 'fullName');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    return res.status(200).json(orders);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product', 'productName price offerPrice onOffer')
      .populate('placedBy', 'fullName')
      .populate('completedBy', 'fullName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Complete Payment
export const completePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'Completed') {
      return res.status(400).json({ message: 'Payment already completed.' });
    }

    order.paymentStatus = 'Completed';
    order.fulfillmentStatus = 'Processing';
    order.orderStatus = 'Processing';
    await order.save();

    return res.status(200).json({ message: 'Payment completed successfully.', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 🚚 Fulfill Order
// export const fulfillOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     if (order.paymentStatus !== 'Completed') {
//       return res.status(400).json({ message: 'Cannot fulfill order — payment not completed.' });
//     }

//     if (order.fulfillmentStatus === 'Completed') {
//       return res.status(400).json({ message: 'Order already fulfilled.' });
//     }

//     order.fulfillmentStatus = 'Completed';
//     await order.save();

//     return res.status(200).json({ message: 'Order fulfillment marked as completed.', order });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// Complete Entire Order (after payment + fulfillment)
export const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'Completed') {
      return res.status(400).json({ message: 'Cannot complete order — payment not completed.' });
    }

    if (order.fulfillmentStatus === 'Completed') {
      return res.status(400).json({ message: 'Order already fulfilled.' });
    }

    if (order.orderStatus === 'Completed') {
      return res.status(400).json({ message: 'Order already completed.' });
    }

    order.fulfillmentStatus = 'Completed';
    order.orderStatus = 'Completed';
    order.completionDate = new Date();
    order.completedBy = req.user._id;
    await order.save();

    return res.status(200).json({ message: 'Order delivered and completed successfully.', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus === 'Completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed order.' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    return res.status(200).json({ message: 'Order cancelled successfully.', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get total sales summary (daily, weekly, total)
export const getSalesSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [daily, weekly, total] = await Promise.all([
      Order.aggregate([
        { $match: { orderDate: { $gte: startOfDay }, paymentStatus: 'Completed' } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { orderDate: { $gte: startOfWeek }, paymentStatus: 'Completed' } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
      ])
    ]);

    return res.status(200).json({
      dailySales: daily[0]?.totalSales || 0,
      weeklySales: weekly[0]?.totalSales || 0,
      totalSales: total[0]?.totalSales || 0
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete (soft delete) an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
