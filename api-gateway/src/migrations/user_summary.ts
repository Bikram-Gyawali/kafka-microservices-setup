export const createSummaryTable =  () => {
    return `CREATE TABLE IF NOT EXISTS user_summary (
        id UUID DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) UNIQUE,
        total_messages INTEGER DEFAULT 0,
        service_type VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
};

export const dropSummaryTable = () => {
    return `DROP TABLE IF EXISTS user_summary;`;
};