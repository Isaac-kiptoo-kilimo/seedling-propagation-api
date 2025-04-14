import { app, logger } from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 9000;

// Start Server
connectDB().then(() => {
const server = app.listen(PORT, (err) => {
  if (err) throw err;
  logger.info(`API listening on port ${PORT}`);
});

const shutdown = async (signal) => {
  logger.info(`${signal} received: Closing HTTP server and Database...`);
  
  try {
    await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close());
    server.close(() => {
      logger.info("HTTP server and Database closed successfully.");
      process.exit(0);
    });
  } catch (error) {
    logger.error("An error occurred closing connection: " + error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

}).catch((err) => {
  logger.error("MongoDB connection failed: " + err.message);
  process.exit(1);
});