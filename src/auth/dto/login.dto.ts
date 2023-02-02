import { IsEmail, IsString } from 'class-validator';

/**
 * @openapi
 * components:
 *  schemas:
 *    loginDTO:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: password
 */

class LoginDTO {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export default LoginDTO;
