import { pool } from "../db/db";
import { UserMessageInterface } from "../types/message.types";

export class UserMessagesService {
    constructor() {}

    async saveMessage(data: UserMessageInterface): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query(
                "INSERT INTO messages (user_id, message, service) VALUES ($1, $2, $3)",
                [data.userId, data.message, data.service],
            );
            await client.query('COMMIT');
            console.log("Message saved in DB", result);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error saving message in DB", error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getMessages(userId: string): Promise<string[]> {
        const result = await pool.query(
            "SELECT message FROM messages WHERE user_id = $1",
            [userId]
        );
        return result.rows.map((row) => row.message);
    }
}