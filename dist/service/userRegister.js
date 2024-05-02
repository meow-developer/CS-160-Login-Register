import crypto from 'crypto';
import HashPasswordService from "./hashPassword.js";
import AccountDb from "../repo/accountDb.js";
import JwTAuthService from "./jwtAuth.js";
import PasswordStrengthChecker from './passwordStrength.js';
import { ServiceRestError } from './ServiceRestError.js';
class UserRegisterError extends Error {
    constructor(message) {
        super(message);
    }
}
export default class UserRegisterService {
    constructor(userRegisterData) {
        this.userRegisterData = userRegisterData;
    }
    async checkUserExistAndThrow() {
        const accountDb = AccountDb.getInstance();
        const userCount = await accountDb.countUserByEmail(this.userRegisterData.email);
        if (userCount > 0) {
            throw new UserRegisterError("User with this email already exist");
        }
    }
    async checkPasswordStrengthAndThrow() {
        const passwordStrengthChecker = new PasswordStrengthChecker(this.userRegisterData.plainPassword);
        const isPasswordStrong = await passwordStrengthChecker.getPasswordStrength();
        if (!isPasswordStrong) {
            throw new UserRegisterError("Password is not strong enough");
        }
    }
    async generateHashPassword() {
        const hashPasswordService = HashPasswordService.getInstance();
        const [hashPassword, salt] = await hashPasswordService.hashPassword(this.userRegisterData.plainPassword);
        return hashPassword;
    }
    async generateUserUUID() {
        return crypto.randomUUID();
    }
    async addUserToDb(userUUID, hashedPwWithSalt) {
        const accountDb = AccountDb.getInstance();
        await accountDb.createUser({
            "UserUUID": userUUID,
            "Email": this.userRegisterData.email,
            "DisplayName": this.userRegisterData.displayName,
            "HashedPasswordWithSalt": hashedPwWithSalt,
            "Active": true
        });
    }
    async generateToken(userId) {
        const jwtAuthService = JwTAuthService.getInstance();
        return jwtAuthService.signToken(userId);
    }
    async register() {
        try {
            await this.checkUserExistAndThrow();
            await this.checkPasswordStrengthAndThrow();
            const hashedPwWithSalt = await this.generateHashPassword();
            const userUUID = await this.generateUserUUID();
            await this.addUserToDb(userUUID, hashedPwWithSalt);
            const token = await this.generateToken(userUUID);
            return token;
        }
        catch (err) {
            console.log(err);
            if (err instanceof UserRegisterError) {
                throw new ServiceRestError(`User registration failed: \n${err.message}`, 400, err.message);
            }
            else {
                throw new ServiceRestError(`Error occurred during user registration`);
            }
        }
    }
}
