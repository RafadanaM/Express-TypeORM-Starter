import HttpException from "./http.exception";

class EmailPasswordDoesNotMatch extends HttpException {
    constructor() {
        super(401, "Email or Password Does Not Match")
    }
}
export default EmailPasswordDoesNotMatch