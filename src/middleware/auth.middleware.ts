import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/auth.type.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "very_secret_access";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader?.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Akses di tolak, token tidak ditemukan"
            });
        }
        const token = authHeader.split("")[1] 

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Akses di tolak, token tidak ditemukan"
            })
        }

        const decoded = jwt.verify(token, ACCESS_SECRET) as unknown as JWTPayload
        (req as any).user = decoded
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah kadaluarsa"
        });
    }
}