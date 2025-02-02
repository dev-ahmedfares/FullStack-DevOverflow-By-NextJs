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
  answer: z.string().min(100),
});
