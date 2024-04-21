import AccountDb from "../repo/accountDb.js";
import PasswordService from "./password.js";
import JwTAuthService from "./jwtAuth.js";

class UserLoginError extends Error{
    public constructor(message: string){
        super(message);
    }
}

export default class UserLoginService{
    private email: string;
    private plainPassword: string;
    private hashPassword: string | null = null;

    private accountDb: AccountDb = AccountDb.getInstance();
    private passwordStorage: PasswordService = PasswordService.getInstance();
    private jwtAuthService: JwTAuthService = JwTAuthService.getInstance();

    public constructor(email: string, plainPassword: string){
        this.email = email;
        this.plainPassword = plainPassword;
    }

    private async checkUserExist(): Promise<void>{
        const userCount = await this.accountDb.countUserByEmail(this.email);
        
        if (userCount === 0){
            throw new UserLoginError("User not found");
        }
    }

    private async checkUserActive(): Promise<void>{
        const isActive = (await this.accountDb.getUserStatus(this.email))?.Active;
        
        if (!isActive){
            throw new UserLoginError("User is not active");
        }
    }

    private async loadHashedPassword(): Promise<void>{
        this.hashPassword = (await this.accountDb.getHashedPassword(this.email))?.HashedPassword!;
    }

    private async checkPasswordMatch(): Promise<void>{
        const isPasswordMatch = await this.passwordStorage.verifyPasswordWithHash(this.plainPassword, this.hashPassword!);

        if (!isPasswordMatch){
            throw new UserLoginError("Password does not match");
        }
    }

    private async getUserId(){
        const userId = await this.accountDb.getUserIdByEmail(this.email);
        return userId?.UserID;
    }

    private async generateToken(userId: string): Promise<string>{
        return this.jwtAuthService.signToken(userId);
    }

    public async loginUser(){
        try {
            await this.checkUserExist();
            await this.checkUserActive();
            await this.loadHashedPassword();
            await this.checkPasswordMatch();
        } catch (error){
        
        }
    }
}