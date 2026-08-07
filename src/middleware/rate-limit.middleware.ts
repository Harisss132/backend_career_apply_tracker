import rateLimit from "express-rate-limit";

export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak request coba lagi nanti"
    }
});

export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Terlalu banyak percobaan login gagal, coba lagi dalam 15 menit"
    }
});

export const registerRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak percobaan registrasi, coba lagi nanti dalam 15 menit"
    }
});

export const refreshRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak request refresh token"
    }
});