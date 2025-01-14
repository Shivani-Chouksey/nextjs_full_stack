import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "UserName must be atleast 2 charcter")
  .max(20, "UserName must be atleast 20 charcter");

export const signUpSchemaValidation = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, {
    message: "passsword must be atleast 6 character",
  }),
});
