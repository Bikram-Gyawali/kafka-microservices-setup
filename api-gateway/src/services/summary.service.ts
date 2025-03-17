import { pool } from "../db/db";

export class UserSummaryService {
    public async getUserSummary(userId: string): Promise<any> {
        const result = await pool.query(
            "SELECT * FROM user_summary WHERE user_id = $1",
            [userId]
        );
        return result.rows;
    }

    public async saveUserSummary(data: any): Promise<void> {
        await pool.query(
            "INSERT INTO user_summary (user_id, message, service) VALUES ($1, $2, $3)",
            [data.userId, data.message, data.service]
        );
    }

    public async updateUserSummary(data: any): Promise<void> {
        const totalMessageCount = await pool.query(
            "SELECT COUNT(*) FROM messages WHERE user_id = $1",
            [data.userId]
        )
        const totalMessageCountValue = totalMessageCount.rows[0].count;
        await pool.query(
            "UPDATE user_summary SET total_messages = $1 WHERE user_id = $2",
            [totalMessageCountValue, data.userId]
        );
    }
}