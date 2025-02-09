import { app, logger } from "./app.js";
// import db from "./database.js";

const PORT = 9000;

// Start Server
const server = app.listen(PORT, (err) => {
  if (err) throw err;
  logger.info(`API listening on port ${PORT}`);
});

const shutdown = async (signal) => {
  logger.info(`${signal} received: Closing HTTP server and Database...`);
  
  try {
    await db.sequelize.close(); // Close database connection
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
