import { prisma } from "../config/database.js";
import type { registerDTO, loginDTO } from "../types/auth.type.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";
import bcrypt from 'bcrypt';

export const registerUser = async (input: registerDTO) => {
    const { name, email, password } = input

    const existingUser = await prisma.user.findUnique({where: {email}});
    if(existingUser) throw new Error("Email sudah terdaftar")

    const hashedPassword = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: {name, email, password: hashedPassword},
        select: {id: true, name: true, email: true, createdAt: true}
    })
}

export const loginUser = async (input: loginDTO) => {
    const {email, password} = input;

    const user = await prisma.user.findUnique({where: {email}});
    if(!user) throw new Error("Email atau password salah");

    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if(!isPasswordvalid) throw new Error("Email atau password salah");

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
    if (!refreshToken) throw new Error("Refresh token tidak valid")
    
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

export const refreshAccessToken = async (refreshToken: string) => {
    if(!refreshToken) throw new Error("Refresh token tidak valid");

    const tokenInDb = await prisma.refreshToken.findFirst({
        where: {
            token: refreshToken,
            expiresAt: {gte: new Date()}
        }
    });

    if(!tokenInDb) throw new Error("Reresh token invalid atau sudah expired");

    try {
        const decode = verifyRefreshToken(refreshToken);

        const user = await prisma.user.findUnique({ where: {id: decode.userId}});
        if(!user) throw new Error("User tidak ditemukan");

        const newAccessToken = generateAccessToken({userId: user.id, email: user.email});

        return {accessToken: newAccessToken}
    } catch (err) {
        throw new Error("Verifikasi refresh token gagal.")
    }
}