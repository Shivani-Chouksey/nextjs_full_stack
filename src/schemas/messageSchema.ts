import { z } from "zod";

export const messageValidationSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content Must be Atleast of  10 characters" })
    .max(300, { message: "Content must be no longer then 300 Charcters " }),
});
