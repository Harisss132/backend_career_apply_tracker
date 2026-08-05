import { z } from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Nama minimal 2 karakter")
            .max(100, "Nama maksimal 100 karakter"),
        email: z
            .string()
            .trim()
            .max(150, "Email maksimal 150 karakter")
            .pipe(z.email({message: "Format email tidak valid"})),
        password: z
            .string()
            .min(8, "Password minmal 8 karakter")
            .max(255, "password minimal 255 karakter")
            .regex(/\d/, "Password harus mengandung angka")
    })
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .pipe(z.email({message: "Format email tidak valid"})),
        password: z
            .string()
            .min(1, "Password tidak boleh kosong!")
    })
})

export type RegisterUserSchema = z.infer<typeof registerUserSchema>["body"]
export type LoginUserSchema = z.infer<typeof loginUserSchema>["body"]