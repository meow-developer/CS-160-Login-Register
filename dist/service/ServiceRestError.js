import { RestError } from "../type/restError.js";
export class ServiceRestError extends RestError {
    constructor(internalMessage, statusCode = 500, publicMessage = "Internal Server Error") {
        super(internalMessage);
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;
    }
}
