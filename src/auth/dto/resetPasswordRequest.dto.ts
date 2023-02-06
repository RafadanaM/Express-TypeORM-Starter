import { IsEmail } from 'class-validator';

class ResetPasswordRequestDTO {
  @IsEmail()
  email!: string;
}
export default ResetPasswordRequestDTO;
