import { RestError } from "../type/restError.js";
export const loggingError = (err) => {
    console.error(err);
};
export const errorHandlingMiddleware = (err, req, res, next) => {
    loggingError(err);
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof RestError) {
        res.status(err.statusCode).send(err.publicMessage);
        return;
    }
    else {
        res.status(500).send('Internal Server Error');
        return;
    }
};
