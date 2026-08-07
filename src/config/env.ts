import {z} from "zod";
import dotenv from "dotenv";

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("5000"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET minimal 32 karakter"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET minimal 32 karakter"),
    FRONTEND_URL: z.string().default("http://localhost:5173")
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
    console.error("Environment variable tidak valid:");
    console.error(parsed.error.flatten().fieldErrors)
    process.exit(1)
}

export const env = parsed.data;