import express from "express";
import AuditLog from "../models/auditLogs.js";

const auditRouter = express.Router();

auditRouter.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "fullName role email")
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve logs", error: err.message });
  }
});


export default auditRouter;
