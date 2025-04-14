import express from "express";
import { dbtest, ok, ready } from "../controllers/healthCheck.js";

const healthRoutes = express.Router();

healthRoutes.get("/health/ok", ok);
healthRoutes.get("/health/ready", ready);
healthRoutes.get("/health/dbtest", dbtest);

export default healthRoutes;
