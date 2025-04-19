import express from 'express';
import { isJWTValid } from "../middlewares/jwt.js";
import { applyOffer, checkStockAndDeactivate, createProduct, deleteProduct, getProductById, getProducts, softDeleteProduct, updateProduct, updateProductStock } from '../controllers/products.js';

const productRoutes = express.Router();

productRoutes.post('/products', isJWTValid , createProduct);
productRoutes.get('/products',  getProducts);
productRoutes.get('/products/:id', getProductById);
productRoutes.put('/products/update/:id', isJWTValid , updateProduct);
productRoutes.delete('/products/softdelete/:id', isJWTValid , softDeleteProduct);
productRoutes.delete('/products/delete/:id', isJWTValid , deleteProduct);
productRoutes.patch('/products/:id/check-stock',isJWTValid, checkStockAndDeactivate);
productRoutes.patch('/products/:id/update-stock',isJWTValid, updateProductStock);
productRoutes.patch('/products/:id/apply-offer',isJWTValid, applyOffer);

export default productRoutes;
