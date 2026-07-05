const { z } = require('zod');

const authRegisterSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50),
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
});

const authLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal(''))
}).strict(); // strict prevents mass assignment by throwing on unknown keys

module.exports = {
  authRegisterSchema,
  authLoginSchema,
  postSchema
};
