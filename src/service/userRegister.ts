import crypto from 'crypto';

import HashPasswordService from "./hashPassword.js";
import AccountDb from "../repo/accountDb.js";
import JwTAuthService from "./jwtAuth.js";
import PasswordStrengthChecker from './passwordStrength.js';
import { ServiceRestError } from './ServiceRestError.js';

export type UserRegisterData = {
    displayName: string,
    email: string;
    plainPassword: string;
}

class UserRegisterError extends Error {
    public constructor(message: string){
        super(message);
    }
}

export default class UserRegisterService{
    private userRegisterData: UserRegisterData;

    public constructor(userRegisterData: UserRegisterData){
        this.userRegisterData = userRegisterData;
    }

    private async checkUserExistAndThrow(){
        const accountDb = AccountDb.getInstance();
        const userCount = await accountDb.countUserByEmail(this.userRegisterData.email);
        
        if (userCount > 0){
            throw new UserRegisterError("User with this email already exist");
        }
    }
    private async checkPasswordStrengthAndThrow(){
        const passwordStrengthChecker = new PasswordStrengthChecker(this.userRegisterData.plainPassword);
        const isPasswordStrong = await passwordStrengthChecker.getPasswordStrength();

        if (!isPasswordStrong){
            throw new UserRegisterError("Password is not strong enough");
        }
    }

    private async generateHashPassword(): Promise<string>{
        const hashPasswordService = HashPasswordService.getInstance();
        const [hashPassword, salt] = await hashPasswordService.hashPassword(this.userRegisterData.plainPassword);

        return hashPassword;
    }

    private async generateUserUUID() {
        return crypto.randomUUID();
    }

    private async addUserToDb(userUUID: string, hashedPwWithSalt: string){
        const accountDb = AccountDb.getInstance();
        await accountDb.createUser({
            "UserUUID": userUUID,
            "Email": this.userRegisterData.email,
            "DisplayName": this.userRegisterData.displayName,
            "HashedPasswordWithSalt": hashedPwWithSalt,
            "Active": true
        });
    }

    private async generateToken(userId: string): Promise<string>{
        const jwtAuthService = JwTAuthService.getInstance();
        return jwtAuthService.signToken(userId);
    }

    public async register(){
        try{
            await this.checkUserExistAndThrow();
            await this.checkPasswordStrengthAndThrow();
            const hashedPwWithSalt = await this.generateHashPassword();
            const userUUID = await this.generateUserUUID();

            await this.addUserToDb(userUUID, hashedPwWithSalt);

            const token = await this.generateToken(userUUID);
            return {
                userId: userUUID,
                token: token,
                displayName: this.userRegisterData.displayName,
                email: this.userRegisterData.email
            }
        } catch (err) {
            console.log(err)
            if (err instanceof UserRegisterError){
                throw new ServiceRestError(`User registration failed: \n${err.message}`, 400, err.message);
            } else {
                throw new ServiceRestError(`Error occurred during user registration`);
            }
        }
    }
}
