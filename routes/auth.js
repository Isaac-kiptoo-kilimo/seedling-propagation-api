import express from "express";
import { login } from "../controllers/auth.js";
import { validateLoginData } from "../middlewares/validations/auth.js";

const authRoutes = express.Router();

authRoutes.post("/auth/login", validateLoginData, login);

export default authRoutes;