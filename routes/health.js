import express from "express";

const healthRoutes = express.Router();

healthRoutes.get("/health", (req, res) => {
  res.status(200).json({ message: "This is a health check" });
});

export default healthRoutes;
