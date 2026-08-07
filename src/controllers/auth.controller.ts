import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { getCookieOption } from "../utils/auth.utils.js";
import { logger } from "../logger/winston.logger.js"; // <- IMPORT WINSTON LOGGER
import { AppError } from "../utils/AppError.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.registerUser(req.body);

    // CATAT LOG INFO SUKSES
    logger.info(`User berhasil registrasi: ${req.body.email}`);

    return res.status(201).json({
      success: true,
      message: "Registrasi user berhasil!",
      data: result,
    });
  } catch (error: any) {
    // CATAT LOG ERROR KE FILE logs/error.log
    logger.error(
      `Gagal registrasi untuk email ${req.body.email}: ${error.message}`,
    );
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, getCookieOption());

    // CATAT LOG LOGIN SUKSES
    logger.info(`User sukses login: ${req.body.email}`);

    return res.status(200).json({
      success: true,
      message: "Login sukses!",
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    // CATAT LOG LOGIN GAGAL (Bisa mendeteksi potensi serangan brute force)
    logger.warn(
      `Percobaan login gagal untuk email ${req.body.email}: ${error.message}`,
    );
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logoutUser(refreshToken);

    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true, message: "Berhasil logout!" });
  } catch (error: any) {
    logger.error(`Gagal logout: ${error.message}`);
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await authService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, getCookieOption())

    return res
      .status(200)
      .json({ success: true, accessToken: result.accessToken });
  } catch (error: any) {
    logger.warn(`Gagal refresh token: ${error.message}`);
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const user = await authService.getProfile(userId);

    logger.info(`User mengambil profile ${user.email}`);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.warn(`Gagal mengambil profile ${error.message}`);
    next(error);
  }
};
