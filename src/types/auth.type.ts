import type { RegisterUserSchema, LoginUserSchema } from "../schemas/user.schema.js";

export type registerDTO = RegisterUserSchema;
export type loginDTO = LoginUserSchema;

export interface JWTPayload {
    userId: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}