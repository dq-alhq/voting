import z from "zod";

export const emailSchema = z.email({ message: "Email tidak valid" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password minimal 8 karakter" });
