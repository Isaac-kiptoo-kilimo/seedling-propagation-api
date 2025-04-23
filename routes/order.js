import express from 'express';

import { isJWTValid } from "../middlewares/jwt.js";
import { cancelOrder, completeOrder, completePayment, createOrder, deleteOrder, getOrderById, getOrders, getOrdersForUser, getSalesSummary, getUserOrders } from '../controllers/orders.js';
import { isAdminOrStaff } from '../middlewares/auth.js';

const orderRroutes = express.Router();

orderRroutes.post('/orders', createOrder);
orderRroutes.get('/orders',isJWTValid, getOrders);
orderRroutes.get('/orders/user', isJWTValid , getUserOrders);
orderRroutes.get('/orders/user/:userId',isJWTValid, isAdminOrStaff, getOrdersForUser);
orderRroutes.get('/orders/:id',isJWTValid, getOrderById);
orderRroutes.patch('/orders/complete-payment/:id',isJWTValid, completePayment);
orderRroutes.patch('/orders/complete-order/:id',isJWTValid, completeOrder);
orderRroutes.patch('/orders/cancel/:id',isJWTValid, cancelOrder);
orderRroutes.get('/sales-summary',isJWTValid, getSalesSummary);
orderRroutes.delete('/orders/delete/:id',isJWTValid, deleteOrder);

export default orderRroutes;

