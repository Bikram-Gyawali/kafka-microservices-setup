const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "serviceB",
  brokers: ["127.0.0.1:9092"],
});

const consumer = kafka.consumer({ groupId: "serviceB" });

const run = async () => {
  await consumer.connect();
  console.log("Consumer connected");

  await consumer.subscribe({ topic: "processing_topic", fromBeginning: true });
    console.log("subscribed to topic");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Received message: ${message.value.toString()} from partition ${partition}`
      );
    },
  });
};

run().catch(console.error);

process.on("SIGINT", async () => {
  await consumer.disconnect();
});