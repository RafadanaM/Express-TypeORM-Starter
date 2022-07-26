/**
 *  @openapi
 *  /users/profile:
 *    description: get loggedin user's profile
 *    get:
 *      tags:
 *        - Users
 *      security:
 *        - Authorization: []
 *      responses:
 *        200:
 *          description: logged in user's profile
 *        401:
 *          description: Unauthenticated
 *        500:
 *          description: Internal server error
 */
