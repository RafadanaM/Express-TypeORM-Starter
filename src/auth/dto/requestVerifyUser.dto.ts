import { IsEmail } from 'class-validator';

class RequestVerifyUserDTO {
  @IsEmail()
  email!: string;
}

export default RequestVerifyUserDTO;
