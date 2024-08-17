import { z } from "zod";

export const tokenDataValidator = z.object({
  userId: z.number(),
});
export type TokenData = z.infer<typeof tokenDataValidator>;

export const signinRequestValidator = z.object({
  username: z.string(),
  password: z.string(),
});
export type SigninRequest = z.infer<typeof signinRequestValidator>;

export const signupRequestValidator = z.object({
  username: z.string(),
  password: z.string(),
});
export type SignupRequest = z.infer<typeof signupRequestValidator>;
