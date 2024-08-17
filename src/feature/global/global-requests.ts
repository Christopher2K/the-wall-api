import { z } from "zod";

export const paramIdValidator = z.object({
  id: z.coerce.number(),
});
