import { pgClient } from "../db/db";
import logger from "../logger/logger";
import { createMessagesTable } from "./messages";
import { createSummaryTable } from "./user_summary";

const migrations: string[] = [
    createSummaryTable(),
    createMessagesTable(),
];

export const runMigration = async () => {
    const client = await pgClient();
    try {
        for (let migration of migrations) {
            logger.info(`Running migration : ${migration}`)
            await client.query(migration);
        }
    } catch (err) {
        throw new Error("Data migration could not be executed");
    }
};

// (async () => {
//     await runMigration(); 
// })();