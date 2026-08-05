import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Validasi data input (body, query, params) menggunakan blueprint skema Zod
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Jika lolos validasi, lanjutkan request ke controller berikutnya
      return next();
    } catch (error) {
      // Jika terjadi error validasi dari Zod
      if (error instanceof ZodError) {
        // Format pesan error agar rapi dan mudah dibaca oleh Frontend developer
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[1] || err.path[0], // Mengambil nama field yang error (misal: 'email')
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validasi input gagal",
          errors: formattedErrors,
        });
      }

      // Jika terjadi error sistem di luar Zod
      return res.status(500).json({
        success: false,
        message: "Internal server error pada sistem validasi",
      });
    }
  };
};
