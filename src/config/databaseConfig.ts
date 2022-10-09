import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    host: process.env.DATABASE_HOST,
    pw: process.env.DATABASE_PW,
}));