import { Kafka } from "kafkajs";
import { configs } from "./configs/env.config";
import { constants } from "./configs/constants";
import logger from "./logger/logger";

logger.info(`Attempting to connect to Kafka broker: ${configs.KAFKA_BROKER}`);

const kafka = new Kafka({
  clientId: configs.SERVICE_NAME,
  brokers: [configs.KAFKA_BROKER as string], 
});

export const consumer = kafka.consumer({
  groupId: configs.SERVICE_NAME,
});

export async function connectConsumer() {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: constants.processing_topic, fromBeginning: true });
        logger.info(`✅ ${configs.SERVICE_NAME} Kafka Consumer Connected`);
    } catch (error) {
        logger.error(`❌ Error connecting Kafka Consumer:`, error);
    }
}


