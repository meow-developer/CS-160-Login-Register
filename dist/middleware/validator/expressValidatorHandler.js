import { validationResult } from 'express-validator';
import RestResponseMaker from '../../controller/tools/responseMaker.js';
export const handleExpressValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const response = RestResponseMaker.makeErrorResponse(errors.array());
        return res.status(400).json(response);
    }
    next();
};
