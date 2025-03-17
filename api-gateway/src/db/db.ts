import { Pool, Client } from "pg";
import { configs } from "../configs/env.configs";
import logger from "../logger/logger";

const dbConfig = {
  user: configs.POSTGRES_USER,
  host: configs.POSTGRES_HOST,
  database: configs.POSTGRES_DB,
  password: configs.POSTGRES_PASSWORD,
  port: Number(configs.POSTGRES_PORT),
};
export const pool = new Pool(dbConfig);
const client = new Client(dbConfig);

export const pgClient = async () => {
  await client.connect();
  return client;
}

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("🚀 Connected to DB");
  } catch (err) {
    console.error("❌ Error connecting to DB:", err);
  }
};
