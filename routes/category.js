import express from 'express';
import { isJWTValid } from "../middlewares/jwt.js";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../controllers/categories.js';
import { isAdminOrStaff } from '../middlewares/auth.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/categories', isJWTValid,isAdminOrStaff, createCategory);
categoryRoutes.get('/categories', getCategories);
categoryRoutes.get('/categories/:id',isJWTValid,isAdminOrStaff, getCategoryById);
categoryRoutes.put('/categories/update/:id',isJWTValid,isAdminOrStaff, updateCategory);
categoryRoutes.delete('/categories/delete/:id',isJWTValid,isAdminOrStaff, deleteCategory);

export default categoryRoutes;
