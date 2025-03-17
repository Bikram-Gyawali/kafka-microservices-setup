import { Pool } from "pg";
import { configs } from "../configs/env.config";
import logger from "../logger/logger";

const dbConfig = {
  user: configs.POSTGRES_USER,
  host: configs.POSTGRES_HOST,
  database: configs.POSTGRES_DB,
  password: configs.POSTGRES_PASSWORD,
  port: Number(configs.POSTGRES_PORT),
};
export const pool = new Pool(dbConfig);

export const connectDB = async () => {
  try {
  logger.info("🚀 Connecting to DB...");
    await pool.connect();
    logger.info("🚀 Connected to DB");
  } catch (err) {
    logger.error("❌ Error connecting to DB:", err);
  }
};