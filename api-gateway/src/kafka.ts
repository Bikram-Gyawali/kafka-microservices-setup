import { Kafka, logLevel } from "kafkajs";
import { configs } from "./configs/env.configs";
import logger from "./logger/logger";
import { topics } from "./configs/constants";

const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: [configs.KAFKA_BROKER as string],
  logLevel: logLevel.DEBUG,
  retry: {
    initialRetryTime: 1000, 
    retries: 20, 
  },
});

export const producer = kafka.producer();

const admin = kafka.admin();

const waitForLeaderElection = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      logger.info("Checking Kafka topic status...");
      await admin.connect();
      const metadata = await admin.fetchTopicMetadata();
      await admin.disconnect();

      if (metadata.topics.length > 0) {
        logger.info("✅ Kafka topic is ready.");
        return;
      }
    } catch (error) {
      logger.error("Kafka leader election in progress, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
      retries--;
    }
  }
  throw new Error("Kafka is not ready after multiple retries.");
};

const createTopic = async () => {
  try {
    await admin.connect();
    logger.info("Admin connected");

    const allTopics = await admin.listTopics();
    if (allTopics.includes(topics.PROCESSING_TOPIC)) {
      console.log("Topic already exists");
    } else {
      await admin.createTopics({
        topics: [
          {
            topic: "processing_topic",
            numPartitions: 2,
            replicationFactor: 1,
          },
        ],
      });
      logger.info("Topic created");
    }
  } catch (error) {
    logger.error("Error creating topic:", error);
  } finally {
    await admin.disconnect();
  }
};

export async function connectProducer() {
  try {
    await waitForLeaderElection(); // Ensure Kafka is ready
    await createTopic();
    await producer.connect();
    logger.info("✅ Kafka Producer Connected");
  } catch (error) {
    logger.error("Error while connecting producer", error);
  }
}

export const waitForKafka = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      console.log("Checking Kafka connection...");
      await admin.connect();
      await admin.fetchTopicMetadata(); // Check if the topic is ready
      logger.info("✅ Kafka is ready!");
      await admin.disconnect();
      return;
    } catch (error) {
      logger.error("⚠️ Kafka not ready, retrying in 3 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      retries--;
    }
  }
  throw new Error("Kafka is not ready after multiple retries.");
};