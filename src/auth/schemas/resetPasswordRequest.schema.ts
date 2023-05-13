import { z } from "zod";

const ResetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type ResetPasswordRequestDTO = z.infer<typeof ResetPasswordRequestSchema>;

export { ResetPasswordRequestDTO, ResetPasswordRequestSchema };
