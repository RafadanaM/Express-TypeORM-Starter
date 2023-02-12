import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/Match';

class ResetPasswordDTO {
  @IsString()
  id!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
  password!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Match(ResetPasswordDTO, (x) => x.password, { message: 'Password and Password Confirmation Does Not Match' })
  confirm_password!: string;

  @IsString()
  token!: string;
}
export default ResetPasswordDTO;
