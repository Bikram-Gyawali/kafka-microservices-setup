import { cleanEnv, num, str } from "envalid";

export const configs = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
    PORT: num({ default: 3000 }),
    KAFKA_BROKER: str(),
    POSTGRES_USER: str(),
    POSTGRES_HOST: str(),
    POSTGRES_DB: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_PORT: str(),
});
