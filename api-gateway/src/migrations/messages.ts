export const createMessagesTable =  () => {
    return `CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
};

export const dropMessagesTable = () => {
    return `DROP TABLE IF EXISTS messages;`;
};