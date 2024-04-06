import AccountStorage from "../repo/accountStorage.js";
import PasswordService from "./password.js";

class UserLoginError extends Error{
    public constructor(message: string){
        super(message);
    }
}

export default class UserLoginService{
    private email: string;
    private plainPassword: string;
    private hashPassword: string | null = null;

    private accountStorage: AccountStorage = AccountStorage.getInstance();
    private passwordStorage: PasswordService = PasswordService.getInstance();

    public constructor(email: string, plainPassword: string){
        this.email = email;
        this.plainPassword = plainPassword;
    }

    private async checkUserExist(): Promise<void>{
        const userCount = await this.accountStorage.countUserByEmail(this.email);
        
        if (userCount === 0){
            throw new UserLoginError("User not found");
        }
    }

    private async checkUserActive(): Promise<void>{
        const isActive = (await this.accountStorage.getUserStatus(this.email))?.Active;
        
        if (!isActive){
            throw new UserLoginError("User is not active");
        }
    }

    private async loadHashedPassword(): Promise<void>{
        this.hashPassword = (await this.accountStorage.getHashedPassword(this.email))?.HashedPassword!;
    }

    private async checkPasswordMatch(): Promise<void>{
        const isPasswordMatch = await this.passwordStorage.checkPassword(this.plainPassword, this.hashPassword!);

        if (!isPasswordMatch){
            throw new UserLoginError("Password does not match");
        }
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