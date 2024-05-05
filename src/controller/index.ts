import { Request, Response, NextFunction } from 'express';
import UserLoginService from '../service/userLogin.js';
import UserRegisterService from '../service/userRegister.js';
import RestResponseMaker from './tools/responseMaker.js';
import CookieService from '../service/cookieJwt.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userLoginService = new UserLoginService({email: email, password: password});

        const [userId, token] = await userLoginService.login();

        const cookieJWTService = new CookieService(token, userId);

        const jwtCookieData = cookieJWTService.getJwtCookieHttpConfig();
        const userIdCookieData = cookieJWTService.getUserIdCookieHttpConfig();

        res.cookie(...jwtCookieData);
        res.cookie(...userIdCookieData);
        res.status(200).send(RestResponseMaker.makeSuccessResponse({
            "userId": userId,
            "token": token
        }));
    } catch (err) {
        next(err);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const displayName = req.body.displayName;
    const password = req.body.password;

    try {
        const userRegisterService = new UserRegisterService({email: email, displayName: displayName, plainPassword: password});

        const [userId, token] = await userRegisterService.register();
        
        const cookieJWTService = new CookieService(token, userId);
        const jwtCookieData = cookieJWTService.getJwtCookieHttpConfig();
        const userIdCookieData = cookieJWTService.getUserIdCookieHttpConfig();

        res.cookie(...jwtCookieData);
        res.cookie(...userIdCookieData);
        res.status(200).send(RestResponseMaker.makeSuccessResponse({
            "userId": userId,
            "token": token
        }));
    } catch (err) {
        next(err);
    }
};