import { z } from "zod";

export const QuestionValidation = z.object({
  title: z.string().min(2, {
    message: "Title must be between 5 to 130 characters.",
  }),
  explanation: z
    .string()
    .min(20, { message: "Explanation must be at least 20 characters" }),
  tags: z
    .array(
      z
        .string()
        .min(1)
        .max(20, { message: "Tag must be at most 20 characters" }),
    )
    .min(1, { message: "Tags must be between 1 to 3 tags" })
    .max(3, { message: "Tags must be between 1 to 3 tags" }),
});

export const AnswerSchema = z.object({
  answer: z
    .string()
    .min(100, { message: "Answer must be at least 100 characters" }),
});

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" })
    .max(50, { message: "Username must be at most 50 characters" }),
  portfolioWebsite: z.string().url().or(z.literal("")).optional(),

  location: z
    .string()
    .max(50, { message: "Username must be at most 50 characters" })
    .optional(),
  bio: z
    .string()
    .max(160, { message: "Username must be at most 160 characters" })
    .optional(),
});
