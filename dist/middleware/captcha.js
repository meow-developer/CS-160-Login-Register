import CaptchaService from "../service/captcha.js";
import { RestError } from "../type/restError.js";
class CaptchaError extends RestError {
    constructor(publicMessage) {
        super(publicMessage);
        this.statusCode = 400;
        this.publicMessage = publicMessage;
    }
}
const captchaVerify = async (req, res, next) => {
    const captcha = req.body.captcha;
    if (captcha === undefined || captcha === null || captcha === '') {
        next(new CaptchaError('Captcha is required'));
    }
    const captchaService = new CaptchaService();
    const isCaptchaValid = await captchaService.verifyCaptcha(captcha, req.ip);
    if (isCaptchaValid) {
        next();
    }
    else {
        next(new CaptchaError('Captcha is invalid'));
    }
};
export default captchaVerify;
