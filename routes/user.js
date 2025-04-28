import express from "express";
import { createUser, createStaff, getUsers, getUser, updateUser, deleteUser, softDeleteUser, getStaff, getOneStaff, updateStaff, deleteStaff, softDeleteStaff, restoreUser, restoreStaff } from "../controllers/users.js";
import { validateStaffData, validateUserData } from "../middlewares/validations/user.js";
import { isAdmin, isAdminOrStaff } from "../middlewares/auth.js";
import { isJWTValid } from "../middlewares/jwt.js";

const userRoutes = express.Router();

// Customer routes
userRoutes.post("/user", validateUserData, createUser);
userRoutes.patch("/user/update/:userId",isJWTValid, updateUser);
userRoutes.get("/users",isJWTValid,isAdmin, getUsers);
userRoutes.get("/user/:userId",isJWTValid, getUser);
userRoutes.patch("/user/softDelete/:userId", isJWTValid,isAdmin, softDeleteUser);
userRoutes.patch("/user/restore/:userId",isJWTValid,isAdmin, restoreUser);
userRoutes.delete("/user/delete/:userId",isJWTValid,isAdmin, deleteUser);

// Staff routes
userRoutes.post("/staff",isJWTValid,isAdmin, validateStaffData,createStaff);
userRoutes.patch("/staff/update/:staffId",isJWTValid,isAdminOrStaff, updateStaff);
userRoutes.get("/staff",isJWTValid,isAdmin, getStaff);
userRoutes.get("/staff/:staffId",isJWTValid, getOneStaff);
userRoutes.patch("/staff/softDelete/:staffId",isJWTValid,isAdmin, softDeleteStaff);
userRoutes.patch("/staff/restore/:staffId",isJWTValid,isAdmin, restoreStaff);
userRoutes.delete("/staff/delete/:staffId",isJWTValid,isAdmin, deleteStaff);

export default userRoutes;

