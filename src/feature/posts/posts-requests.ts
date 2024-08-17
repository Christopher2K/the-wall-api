import { z } from "zod";

export const createPostRequestValidator = z.object({
  title: z.string(),
  content: z.string(),
});
export type CreatePostRequest = z.infer<typeof createPostRequestValidator>;
