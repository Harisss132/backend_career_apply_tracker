import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { logger } from "../logger/winston.logger.js";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if(!(err instanceof AppError)) {
        logger.error(`Unexpected error: ${err.message}`);
        logger.error(err.stack);

        statusCode=500;
        message= "Terjadi kesalahan pada server";
    } else {
        if(statusCode >= 500) {
            logger.error(err.message);
        }else {
            logger.warn(err.message);
        }
    }

    return res.status(statusCode).json({
        success: false,
        message,
    })
}