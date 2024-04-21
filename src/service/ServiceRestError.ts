import { RestError } from "../type/restError.js";

export class ServiceRestError extends RestError{
    public statusCode: number;
    public publicMessage: string;

    constructor(internalMessage: string, 
                statusCode: number = 500, 
                publicMessage: string = "Internal Server Error"){
        super(internalMessage);
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;
    }
}