import { z } from "zod";

const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email given" }),
  password: z.string({ required_error: "Password is required" }),
  test: z.object({
    asd: z.string(),
  }),
});

type LoginDTO = z.infer<typeof LoginSchema>;

export { LoginDTO, LoginSchema };
