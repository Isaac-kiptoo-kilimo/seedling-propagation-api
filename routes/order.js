import express from 'express';

import { isJWTValid } from "../middlewares/jwt.js";
import { cancelOrder, completeOrder, completePayment, confirmDelivery, createOrder, deleteOrder, getOrderById, getOrders, getOrdersForUser, getSalesSummary, getUserOrders, orderInTransit, trackOrder } from '../controllers/orders.js';
import { isAdmin, isAdminOrStaff } from '../middlewares/auth.js';

const orderRroutes = express.Router();

orderRroutes.post('/orders', createOrder);
orderRroutes.get('/orders',isJWTValid, getOrders);
orderRroutes.get('/orders/user', isJWTValid , getUserOrders);
orderRroutes.get('/orders/user/:userId',isJWTValid, isAdminOrStaff, getOrdersForUser);
orderRroutes.get('/orders/:id',isJWTValid, getOrderById);
orderRroutes.get('/orders/track/new-order',  trackOrder);
orderRroutes.patch('/orders/complete-payment/:id',isJWTValid,isAdminOrStaff, completePayment);
orderRroutes.patch('/orders/inTransit/:id',isJWTValid,isAdminOrStaff, orderInTransit);
orderRroutes.put('/orders/confirm-delivery', confirmDelivery);
orderRroutes.patch('/orders/complete-order/:id',isJWTValid, isAdminOrStaff, completeOrder);
orderRroutes.patch('/orders/cancel/:id',isJWTValid, cancelOrder);
orderRroutes.get('/sales-summary',isJWTValid,isAdmin, getSalesSummary);
orderRroutes.delete('/orders/delete/:id',isJWTValid, isAdmin , deleteOrder);

export default orderRroutes;
