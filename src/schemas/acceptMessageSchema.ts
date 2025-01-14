import { z } from "zod";

export const acceptMessagesValidationSchema = z.object({
  acceptMessages: z.boolean(),
});
