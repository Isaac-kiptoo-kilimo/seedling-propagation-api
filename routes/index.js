import auditRouter from "./auditLog.js";
import authRoutes from "./auth.js";
import categoryRoutes from "./category.js";
import healthRoutes from "./health.js";
import orderRroutes from "./order.js";
import productRoutes from "./product.js";
import userRoutes from "./user.js";

export default [
  healthRoutes,
  userRoutes,
  authRoutes,
  categoryRoutes,
  productRoutes,
  orderRroutes,
  auditRouter
];
