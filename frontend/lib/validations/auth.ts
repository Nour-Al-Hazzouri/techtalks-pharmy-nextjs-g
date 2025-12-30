import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .regex(/^[\p{L}\p{M}]+(?:[ \-'\u2019][\p{L}\p{M}]+)*$/u, {
            message: "Name can only contain letters, spaces, hyphens, and apostrophes",
        }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^(?:\+961 ?\d{2} ?\d{3} ?\d{3}|\+961\d{8}|00961 ?\d{2} ?\d{3} ?\d{3}|00961\d{8}|\d{2} ?\d{3} ?\d{3}|\d{8})$/, {
        message: "Invalid Lebanese phone number format",
    }),
    role: z.enum(["patient", "pharmacy"], { message: "Please select a role" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export type LoginValues = z.infer<typeof loginSchema>;
