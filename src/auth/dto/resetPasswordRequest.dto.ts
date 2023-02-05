import { IsEmail } from 'class-validator';

class ResetPasswordDTO {
  @IsEmail()
  email!: string;
}
export default ResetPasswordDTO;
