import { IsString } from 'class-validator';

class VerifyUserDTO {
  @IsString()
  userId!: string;

  @IsString()
  token!: string;
}

export default VerifyUserDTO;
