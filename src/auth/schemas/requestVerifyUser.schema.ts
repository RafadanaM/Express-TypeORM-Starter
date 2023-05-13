import { z } from "zod";

const RequestVerifyUserSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type RequestVerifyUserDTO = z.infer<typeof RequestVerifyUserSchema>;

export { RequestVerifyUserDTO, RequestVerifyUserSchema };
