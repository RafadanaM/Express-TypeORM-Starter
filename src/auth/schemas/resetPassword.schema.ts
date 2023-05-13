import { z } from "zod";

const ResetPasswordSchema = z
  .object({
    id: z.string(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
    confirm_password: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "password does not match",
    path: ["confirm_password"],
  });

type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export { ResetPasswordSchema, ResetPasswordDTO };
