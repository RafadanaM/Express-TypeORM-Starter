/**
 *  @openapi
 *  /auth/login:
 *    description: Login User with Email and Password
 *    post:
 *      tags:
 *        - Auth
 *      requestBody:
 *        required: true
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginDTO'
 *      responses:
 *        201:
 *          description: Successfully logged in, returns accesToken
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  accessToken:
 *                    type: string
 *        400:
 *          description: Invalid request body
 *        401:
 *          description: Email and password does not match
 *
 */
