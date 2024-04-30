import { Request, Response, NextFunction } from 'express';
import UserLoginService from '../service/userLogin.js';
import UserRegisterService from '../service/userRegister.js';
import RestResponseMaker from './tools/responseMaker.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userLoginService = new UserLoginService({email: email, password: password});

        const token = await userLoginService.login();
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).send(RestResponseMaker.makeSuccessResponse('Login successful'));
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

        const token = await userRegisterService.register();
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).send(RestResponseMaker.makeSuccessResponse('Registration successful'));
    } catch (err) {
        next(err);
    }
};