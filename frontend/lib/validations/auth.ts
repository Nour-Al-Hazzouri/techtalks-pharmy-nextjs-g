import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).regex(/^[a-zA-Z\s-]+$/, { message: "Name cannot contain numbers or special characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^\+961\d{8}$/, { message: "Invalid Lebanese phone number (+961XXXXXXXX)" }),
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
