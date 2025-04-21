import express from 'express';
import { isJWTValid } from "../middlewares/jwt.js";
import { applyOffer, checkStockAndDeactivate, createProduct, deleteProduct, getProductById, getProducts, softDeleteProduct, updateProduct, updateProductStock } from '../controllers/products.js';
import { isAdminOrStaff } from '../middlewares/auth.js';

const productRoutes = express.Router();

productRoutes.post('/products', isJWTValid ,isAdminOrStaff, createProduct);
productRoutes.get('/products',  getProducts);
productRoutes.get('/products/:id', getProductById);
productRoutes.put('/products/update/:id', isJWTValid ,isAdminOrStaff, updateProduct);
productRoutes.delete('/products/softdelete/:id', isJWTValid ,isAdminOrStaff, softDeleteProduct);
productRoutes.delete('/products/delete/:id', isJWTValid ,isAdminOrStaff, deleteProduct);
productRoutes.patch('/products/check-stock/:id',isJWTValid,isAdminOrStaff, checkStockAndDeactivate);
productRoutes.patch('/products/update-stock/:id',isJWTValid,isAdminOrStaff, updateProductStock);
productRoutes.patch('/products/apply-offer/:id',isJWTValid,isAdminOrStaff, applyOffer);

export default productRoutes;
