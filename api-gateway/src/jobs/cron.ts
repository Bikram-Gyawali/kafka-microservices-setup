import cron from "node-cron";
import { pool } from "../db/db";
import logger from "../logger/logger";

export async function updateSummaryTable() {
  try {
    console.log("🕒 Running cron job to update user summary...");
    const { rows } = await pool.query(`
      SELECT user_id, COUNT(*) AS total_messages 
      FROM messages 
      GROUP BY user_id
    `);

    for (const row of rows) {
      await pool.query(
        `
        INSERT INTO user_summary (user_id, total_messages, updated_at)
        VALUES ($1, $2, NOW()) ON CONFLICT (user_id) DO UPDATE SET total_messages = $2, updated_at = NOW();
        `,
        [row.user_id, row.total_messages]
      );
    }

    console.log("✅ Summary table updated successfully!");
  } catch (error) {
    console.error("❌ Error updating summary table:", error);
  }
}

cron.schedule("*/5 * * * *", updateSummaryTable);

console.log("⏳ Cron job started. Running every 5 minutes...");
