import AccountDb from "../repo/accountDb.js";
import HashPasswordService from "./hashPassword.js";
import JwTAuthService from "./jwtAuth.js";
import { ServiceRestError } from './ServiceRestError.js';

class UserLoginError extends Error{
    public constructor(message: string){
        super(message);
    }
}

export default class UserLoginService{
    private loginCredentials: {email: string, password: string};

    private accountDb: AccountDb = AccountDb.getInstance();
    private HashpasswordService: HashPasswordService = HashPasswordService.getInstance();
    private jwtAuthService: JwTAuthService = JwTAuthService.getInstance();

    public constructor(loginCredentials: {email: string, password: string}){
        this.loginCredentials = loginCredentials;
    }

    private async checkUserExist(): Promise<void>{
        const userCount = await this.accountDb.countUserByEmail(this.loginCredentials.email);
        
        if (userCount === 0){
            throw new UserLoginError("User not found");
        }
    }

    private async checkUserActive(): Promise<void>{
        const isActive = (await this.accountDb.getUserStatus(this.loginCredentials.email))?.Active;
        
        if (!isActive){
            throw new UserLoginError("User is deactivated");
        }
    }

    private async getHashedPassword(): Promise<string>{
        return (await this.accountDb.getHashedPassword(this.loginCredentials.email))?.HashedPasswordWithSalt!;
    }

    private async checkPasswordMatch(hashedPassword: string): Promise<void> {
        const isPasswordMatch = await this.HashpasswordService.verifyPasswordWithHash(this.loginCredentials.password, hashedPassword);

        if (!isPasswordMatch){
            throw new UserLoginError("Password does not match");
        }
    }

    private async getUserUUID(): Promise<string>{
        const userId = await this.accountDb.getUserIdByEmail(this.loginCredentials.email);
        return userId?.UserUUID!;
    }

    private async generateToken(userId: string): Promise<string>{
        return this.jwtAuthService.signToken(userId);
    }

    public async login(){
        try {
            await this.checkUserExist();
            await this.checkUserActive();

            const hashedPassword = await this.getHashedPassword();
            await this.checkPasswordMatch(hashedPassword);

            const userUUID = await this.getUserUUID();
            const token = await this.generateToken(userUUID);

            return token;
        } catch (error){
            if (error instanceof UserLoginError){
                throw new ServiceRestError(`User sign in error:\n ${error.message}`, 400, error.message);
            } else {
                throw new ServiceRestError("Error occurred while processing login request");
            }
        }
    }
}