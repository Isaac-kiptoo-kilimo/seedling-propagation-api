const {app,logger,db} = require('./app');

const server = app.listen(9000, (err) => {
  if (err) throw err;
  logger.info(`API listening on port 9000`);
});

process.on('SIGINT', async () => {
  // closing the HTTP Server and db.
  try{
    await db.sequelize.close(); // close db connection
    server.close(() => {
      logger.info("HTTP server and Database closed");
    });
  }catch(error){
    logger.error("An error occurred closing connection " + error.message);
    process.exit(1);
  }
})

process.on("SIGTERM", async () => {
  try{
    await db.sequelize.close();
    logger.info("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      logger.info("HTTP server closed");
    });
  }catch(error){
    logger.error("An error occurred closing connection " + error.message);
    process.exit(1);
  }
});

