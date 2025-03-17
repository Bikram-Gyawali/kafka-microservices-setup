import { Kafka } from "kafkajs";
import { configs } from "./configs/env.config";
import { constants } from "./configs/constants";
import logger from "./logger/logger";

console.log(`Attempting to connect to Kafka broker: ${configs.KAFKA_BROKER}`);

const kafka = new Kafka({
  clientId: "serviceB",
  brokers: [configs.KAFKA_BROKER as string],
});

export const consumer = kafka.consumer({
  groupId: "serviceB", 
});

export async function connectConsumer() {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: constants.processing_topic, fromBeginning: true });
        console.log(`✅ ${configs.SERVICE_NAME} Kafka Consumer Connected`);
    } catch (error) {
        console.error(`❌ Error connecting Kafka Consumer:`, error);
    }
}
