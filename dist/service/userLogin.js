import AccountDb from "../repo/accountDb.js";
import HashPasswordService from "./hashPassword.js";
import JwTAuthService from "./jwtAuth.js";
import { ServiceRestError } from './ServiceRestError.js';
class UserLoginError extends Error {
    constructor(message) {
        super(message);
    }
}
export default class UserLoginService {
    constructor(loginCredentials) {
        this.accountDb = AccountDb.getInstance();
        this.HashpasswordService = HashPasswordService.getInstance();
        this.jwtAuthService = JwTAuthService.getInstance();
        this.loginCredentials = loginCredentials;
    }
    async checkUserExist() {
        const userCount = await this.accountDb.countUserByEmail(this.loginCredentials.email);
        if (userCount === 0) {
            throw new UserLoginError("User not found");
        }
    }
    async checkUserActive() {
        const isActive = (await this.accountDb.getUserStatus(this.loginCredentials.email))?.Active;
        if (!isActive) {
            throw new UserLoginError("User is deactivated");
        }
    }
    async getHashedPassword() {
        return (await this.accountDb.getHashedPassword(this.loginCredentials.email))?.HashedPasswordWithSalt;
    }
    async checkPasswordMatch(hashedPassword) {
        const isPasswordMatch = await this.HashpasswordService.verifyPasswordWithHash(this.loginCredentials.password, hashedPassword);
        if (!isPasswordMatch) {
            throw new UserLoginError("Password does not match");
        }
    }
    async getUserUUID() {
        const userId = await this.accountDb.getUserIdByEmail(this.loginCredentials.email);
        return userId?.UserUUID;
    }
    async generateToken(userId) {
        return this.jwtAuthService.signToken(userId);
    }
    async login() {
        try {
            await this.checkUserExist();
            await this.checkUserActive();
            const hashedPassword = await this.getHashedPassword();
            await this.checkPasswordMatch(hashedPassword);
            const userUUID = await this.getUserUUID();
            const token = await this.generateToken(userUUID);
            return token;
        }
        catch (error) {
            if (error instanceof UserLoginError) {
                throw new ServiceRestError(`User sign in error:\n ${error.message}`, 400, error.message);
            }
            else {
                throw new ServiceRestError("Error occurred while processing login request");
            }
        }
    }
}
