/**
 *  @swagger
 *  /auth/login:
 *    description: Login User with Email and Password
 *    post:
 *      tags:
 *        - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
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
