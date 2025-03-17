const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "serviceB",
  brokers: ["127.0.0.1:9092"],
  logLevel: logLevel.DEBUG,
});

const producer = kafka.producer();
const admin = kafka.admin();

const createTopic = async () => {
    try {
      await admin.connect();
      console.log("Admin connected");
      const topics = await admin.listTopics();
      if (topics.includes("processing_topic")) {
        console.log("Topic already exists");
      } else {
        await admin.createTopics({
          topics: [
            {
              topic: "processing_topic",
              numPartitions: 1,
              replicationFactor: 1,
            },
          ],
        });
        console.log("Topic created");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
    } finally {
      await admin.disconnect();
    }
  };

const run = async () => {
  await createTopic();
  await producer.connect();
  console.log("Producer connected");
  await producer.send({
    topic: "processing_topic",
    messages: [{ value: "Hello Kafka!" + new Date().toISOString() }],
  });

  console.log("Message sent");
  await producer.disconnect();
};

run().catch(console.error);

process.on("SIGINT", async () => {
  await producer.disconnect();
});