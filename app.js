import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "./logger/index.js";
import bodyParser from "body-parser";
import appRoutes from "./routes/index.js";
import { v2 as cloudinary } from 'cloudinary';

const app = express();

// middlewares

// Only one CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://seedling-propogation-store-ui.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(bodyParser.json());

app.use("/api", [...appRoutes]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Error Handling
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "An error occurred processing your request. Try again",
  });
});

export { app, logger };
