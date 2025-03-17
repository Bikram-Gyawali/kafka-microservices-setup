import express from "express";
import { NextFunction, Request, Response } from "express";
import { producer, connectProducer, waitForKafka } from "./kafka";
import { services, topics } from "./configs/constants";
import { pool } from "./db/db";
import { configs } from "./configs/env.configs";
import { runMigration } from "./migrations/init";
import { updateSummaryTable } from "./jobs/cron";
import logger from "./logger/logger";

const app: express.Application = express();
app.use(express.json()); 
logger.info("🚀 API Gateway running on port", configs.PORT);
app.post("/process", async (req: Request,res: Response): Promise<void> => {
  try {
    const { userId, message, serviceType } = req.body;
    if (!userId || !message) {
    res.status(400).json({ error: "Missing userId or message" });
    return;
    }
    await connectProducer();
    const serviceKey = serviceType === 1 ? services.SERVICE_A : services.SERVICE_B;
    logger.info("SERVICE KEY SELECTED", serviceKey);
    // Send message to Kafka
    await producer.send({
      topic: topics.PROCESSING_TOPIC, 
      messages: [{ key: serviceKey, value: JSON.stringify({ userId, message }) }],
    });
    res.json({ status: "Message sent to Kafka", service: serviceKey });
  } catch (error) {
    console.error("Error in /process:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM user_summary WHERE user_id = $1",
      [userId]
    );
    const messages = await pool.query(
      "SELECT message FROM messages WHERE user_id = $1",
      [userId]
    )
    res.json({ summary: result.rows, messages: messages.rows });
  } catch (error) {
    console.error("Error in /summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/schedule-job", async (req, res) => {
  try {
    await updateSummaryTable();
    res.json({ message: "Job scheduled successfully" });
  } catch (error) {
    logger.error("Error in /schedule-job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

// server start setup
const startServer = async () => {
  await Promise.all([runMigration(), waitForKafka()]);
  await connectProducer();
  app.listen(configs.PORT, () => console.log(`🚀 API Gateway running on port ${configs.PORT}`));
};

startServer();


process.on("SIGINT", async () => {
  logger.warn("Disconnecting Kafka Producer...");
  await producer.disconnect();
});