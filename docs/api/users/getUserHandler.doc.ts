/**
 *  @swagger
 *  /users:
 *    description: get list of users
 *    get:
 *      tags:
 *        - Users
 *      security:
 *        - Authorization: []
 *      responses:
 *        200:
 *          description: list of users
 *        401:
 *          description: Unauthenticated
 *        500:
 *          description: Internal server error
 */
