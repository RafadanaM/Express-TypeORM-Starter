import { IsEmail, IsISO8601, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../decorator/Match';

export class loginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class registerDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  first_name!: string;

  @IsString()
  @MaxLength(20)
  last_name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
  password!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Match(registerDTO, (x) => x.password, { message: 'Password and Password Confirmation Does Not Match' })
  confirm_password!: string;

  @IsISO8601({ strict: true })
  birth_date!: string;
}
