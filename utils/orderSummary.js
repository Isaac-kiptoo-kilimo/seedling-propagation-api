export const formatOrderSummary = (order) => {
    const items = order.products.map(
      (p) => `${p.product.productName} x${p.quantity}`
    ).join(", ");
  
    const name = order.placedBy?.fullName || order.guestInfo?.fullName || "customer";
  
    return `Hi ${name}, thank you for your order!
  
    Order Number: ${order.purchaseNumber}
    tems: ${items}
    Total: KES ${order.totalAmount}
    Date: ${new Date(order.orderDate).toLocaleDateString()}
  
  We will update you as your order progresses.`;
  };
  