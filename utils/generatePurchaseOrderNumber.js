import Counter from "../models/counter.js";

const generatePurchaseOrderNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  const dateKey = `${year}${month}${date}`;

  let counter = await Counter.findOneAndUpdate(
    { dateKey },
    { $inc: { lastOrderNumber: 1 } },
    { new: true, upsert: true }
  );

  const orderNumber = String(counter.lastOrderNumber).padStart(4, '0');

  return `SPD${dateKey}-${orderNumber}`;
};

export default generatePurchaseOrderNumber;
