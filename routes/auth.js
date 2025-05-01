import express from "express";
import { changePassword, forgotPassword, login, resetPassword } from "../controllers/auth.js";
import { validateChangePasswordData, validateForgetPasswordData, validateLoginData, validateResetPasswordData } from "../middlewares/validations/auth.js";
import { isJWTValid } from "../middlewares/jwt.js";

const authRoutes = express.Router();

authRoutes.post("/auth/login", validateLoginData, login);
authRoutes.post("/auth/forgot/password", validateForgetPasswordData, forgotPassword);
authRoutes.post("/auth/reset/password", validateResetPasswordData, resetPassword);
authRoutes.post("/auth/change/password",isJWTValid, validateChangePasswordData, changePassword);

export default authRoutes;