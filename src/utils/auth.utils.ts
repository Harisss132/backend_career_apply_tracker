import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import type { JWTPayload } from "../types/auth.type.js";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "very_secret_access"
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "very_secret_refresh"

export const generateAccessToken = (payload: JWTPayload ) => {
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn: "15m" });
}

export const generateRefreshToken = (userId: number) => {
    return jwt.sign({userId}, REFRESH_SECRET, {expiresIn: "7d"})
}

export const verifyRefreshToken = (token: string) : {userId: number; iat?: number; exp?: number} => {
    return jwt.verify(token, REFRESH_SECRET) as {userId: number; iat?: number; exp?: number}
}

export const getCookieOption = (isLogout = false) : CookieOptions => {
    const options: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    if(!isLogout) {
        options.maxAge = 7 * 24 * 60 * 60 * 1000
    }

    return options
}