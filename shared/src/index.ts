import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  school: z.string().min(1, "Asal sekolah harus diisi"),
  targetUniversity: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
