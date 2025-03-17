import { connectConsumer, consumer } from "./kafka";
import { UserMessagesService } from "./services/message.service";
import { UserMessageInterface } from "./types/message.types";
import { configs } from "./configs/env.config";
import { connectDB } from "./db/db";
import logger from "./logger/logger";


async function startConsumer() {
  logger.info("🚀 Starting Kafka Consumer...");
  await connectDB();
  await connectConsumer();
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.key || message.key.toString() !== configs.SERVICE_NAME) return;

        const { userId, message: userMessage } = JSON.parse(message.value!.toString());
        logger.info(`🔹 ${configs.SERVICE_NAME} received message from User ${userId}: ${userMessage}`);

        // Insert message into DB
        const userMessagesService = new UserMessagesService();
        const data: UserMessageInterface = {
            userId,
            message: userMessage,
            service:configs.SERVICE_NAME 
        }
        await userMessagesService.saveMessage(data); 
      } catch (error) {
        logger.error(`❌ Error processing message in ${configs.SERVICE_NAME}:`, error);
      }
    },
  });
}

startConsumer();

process.on("SIGINT", async () => {
  logger.warn("Disconnecting Kafka Consumer...");
  await consumer.disconnect();
});