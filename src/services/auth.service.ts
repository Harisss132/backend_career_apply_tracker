import { prisma } from "../config/database.js";
import type { registerDTO, loginDTO } from "../types/auth.type.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";
import bcrypt from 'bcrypt';

export const registerUser = async (input: registerDTO) => {
    const { name, email, password } = input

    const existingUser = await prisma.user.findUnique({where: {email}});
    if(existingUser) throw new AppError("Email sudah terdaftar", 400)

    const hashedPassword = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: {name, email, password: hashedPassword},
        select: {id: true, name: true, email: true, createdAt: true}
    })
}

export const loginUser = async (input: loginDTO) => {
    const {email, password} = input;

    const user = await prisma.user.findUnique({where: {email}});
    if(!user) throw new AppError("Email atau password salah", 400);

    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if(!isPasswordvalid) throw new AppError("Email atau password salah", 401);

    const accessToken = generateAccessToken({userId: user.id, email: user.email});
    const refreshToken = generateRefreshToken(user.id)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {userId: user.id, token: refreshToken, expiresAt },
    })

    return {
        user: {id: user.id, name: user.name, email: user.email},
        accessToken,
        refreshToken
    }
}

export const logoutUser = async (refreshToken: string) => {
    if (!refreshToken) throw new AppError("Refresh token tidak valid", 401)
    
    const tokenInDb = await prisma.refreshToken.findFirst({
        where: {token: refreshToken},
    });

    if(tokenInDb) {
        await prisma.refreshToken.delete({
            where: {id: tokenInDb.id}
        })
    }

    return {success: true}
}

export const refreshAccessToken = async (oldRefreshToken: string) => {
    if(!oldRefreshToken) throw new AppError("Refresh token tidak valid", 401);

    const tokenInDb = await prisma.refreshToken.findFirst({
        where: {
            token: oldRefreshToken,
            expiresAt:{gte: new Date()},
            deletedAt: null
        }
    });

    if(!tokenInDb) throw new AppError("Refresh token invalid atau sudah expired", 401)

    const decoded = verifyRefreshToken(oldRefreshToken);

    const user = await prisma.user.findUnique({
        where: {id: decoded.userId}
    });

    if(!user) throw new AppError("User tidak ditemukan", 404)
    
    await prisma.refreshToken.delete({
        where: {id: tokenInDb.id}
    });

    const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email
    });

    const newRefreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: newRefreshToken,
            expiresAt
        }
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}

export const getProfile = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    if(!user) throw new AppError("User tidak ditemukan", 404);

    return user;
}