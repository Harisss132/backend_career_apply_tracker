import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../schemas/user.schema.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrasi akun user baru (Validasi ketat via Zod)
 */
router.post("/register", validate(registerUserSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user, generate Access Token & simpan Refresh Token ke HttpOnly Cookie
 */
router.post("/login", validate(loginUserSchema), authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user, menghapus token di database & membersihkan cookie browser
 */
router.post("/logout", authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Mengeluarkan Access Token baru menggunakan Refresh Token dari cookie
 */
router.post("/refresh", authController.refresh);

export default router;
