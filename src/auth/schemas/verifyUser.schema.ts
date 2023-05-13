import { z } from "zod";

const VerifyUserSchema = z.object({
  userId: z.string(),
  token: z.string(),
});

type VerifyUserDTO = z.infer<typeof VerifyUserSchema>;

export { VerifyUserSchema, VerifyUserDTO };
