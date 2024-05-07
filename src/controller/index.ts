import { Request, Response, NextFunction } from 'express';
import UserLoginService from '../service/userLogin.js';
import UserRegisterService from '../service/userRegister.js';
import RestResponseMaker from './tools/responseMaker.js';
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userLoginService = new UserLoginService({email: email, password: password});

        const userLoginData = await userLoginService.login();

        res.status(200).send(RestResponseMaker.makeSuccessResponse({
            "userId": userLoginData.userId,
            "token": userLoginData.token,
            "displayName": userLoginData.displayName,
            "email": userLoginData.email
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

        const userRegisterData = await userRegisterService.register();
        
        res.status(200).send(RestResponseMaker.makeSuccessResponse({
            "userId": userRegisterData.userId,
            "token": userRegisterData.token,
            "displayName": userRegisterData.displayName,
            "email": userRegisterData.email
        }));
    } catch (err) {
        next(err);
    }
};