import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "./logger/index.js";
import bodyParser from "body-parser";
import appRoutes from "./routes/index.js";
import { v2 as cloudinary } from 'cloudinary';

const app = express();

// middlewares

app.use(cors());
app.use(bodyParser.json());


app.use("/api",[
  ...appRoutes
]);

// Set up Cloudinary with your credentials from the environment variables
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
// End of error handling
export { app, logger };
