import { z } from "zod";

const RegisterSchema = z
  .object({
    first_name: z.string().min(1).max(20),
    last_name: z.string().max(20),
    email: z.string().email("Invalid email format"),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
    confirm_password: z.string(),
    birth_date: z.string().datetime(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "password does not match",
    path: ["confirm_password"],
  });

type RegisterDTO = z.infer<typeof RegisterSchema>;

export { RegisterSchema, RegisterDTO };
