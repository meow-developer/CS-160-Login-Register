import UserLoginService from '../service/userLogin.js';
import UserRegisterService from '../service/userRegister.js';
import RestResponseMaker from './tools/responseMaker.js';
import CookieJWTService from '../service/cookieJwt.js';
export const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userLoginService = new UserLoginService({ email: email, password: password });
        const token = await userLoginService.login();
        const cookieJWTService = new CookieJWTService(token);
        const cookieData = cookieJWTService.getCookieHttpConfig();
        res.cookie(...cookieData);
        res.status(200).send(RestResponseMaker.makeSuccessResponse('Login successful'));
    }
    catch (err) {
        next(err);
    }
};
export const register = async (req, res, next) => {
    const email = req.body.email;
    const displayName = req.body.displayName;
    const password = req.body.password;
    try {
        const userRegisterService = new UserRegisterService({ email: email, displayName: displayName, plainPassword: password });
        const token = await userRegisterService.register();
        const cookieJWTService = new CookieJWTService(token);
        const cookieData = cookieJWTService.getCookieHttpConfig();
        res.cookie(...cookieData);
        res.status(200).send(RestResponseMaker.makeSuccessResponse('Registration successful'));
    }
    catch (err) {
        next(err);
    }
};
