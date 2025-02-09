import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "./logger/index.js";
import bodyParser from "body-parser";
import appRoutes from "./routes/index.js";
const app = express();
// const {checkEnv} = require('./utils/env');
// const db = require("./database");
// const env  = checkEnv();

// app.use(async (req, res, next) => {
//   res.reply = require("./middleware/reply");

//   req.db = db;
//   req.env = env;
//   req.http = require("./middleware/http");
  
//   next();
// });

// middlewares
app.use(cors());
app.use(bodyParser.json());

app.use("/api",[
  ...appRoutes
]);


// Error Handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) { // Multer-specific errors
      return res.status(418).json({
          success: false,
          message: err.message,
      });
  }else{
      return res.status(500).json({
        success:false,
        message: err ? err : "An error occurred processing your request. Try again"
      })
  }
});
// End of error handling
export { app, logger };
