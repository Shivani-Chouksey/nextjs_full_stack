import { z } from "zod";

export const signInValidationSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});
