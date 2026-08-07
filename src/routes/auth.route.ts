import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../schemas/user.schema.js";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    loginRateLimit,
    registerRateLimit,
    refreshRateLimit
} from '../middleware/rate-limit.middleware.js'

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrasi akun user baru (Validasi ketat via Zod)
 */
router.post("/register", registerRateLimit , validate(registerUserSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user, generate Access Token & simpan Refresh Token ke HttpOnly Cookie
 */
router.post("/login", loginRateLimit , validate(loginUserSchema), authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user, menghapus token di database & membersihkan cookie browser
 */
router.post("/logout", authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Mengeluarkan Access Token baru menggunakan Refresh Token dari cookie
 */
router.post("/refresh", refreshRateLimit , authController.refresh);

/**
 * @route   POST /api/auth/profile
 * @desc    Mendapatkan informasil profile user
 */
router.get("/profile", authMiddleware, authController.getProfile)

export default router;
