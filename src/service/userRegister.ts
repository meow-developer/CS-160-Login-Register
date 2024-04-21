import { Prisma } from '@prisma/client';

import PasswordService from "./password.js";
import AccountStorage from "../repo/accountDb.js";
import { ServiceRestError } from './ServiceRestError.js';

type UserRegisterData = {
    displayName: string,
    email: string;
    plainPassword: string;
}

export default class UserRegisterService{
    private userRegisterData: UserRegisterData;
    private hashPassword: string | null = null;
    private salt: string | null = null;

    public constructor(userRegisterData: UserRegisterData){
        this.userRegisterData = userRegisterData;
    }

    private async checkPasswordStrengthAndThrow(){
        const passwordService = PasswordService.getInstance();
        const isPasswordSafe = await passwordService.checkPasswordStrength(this.userRegisterData.plainPassword);

        if (!isPasswordSafe){
            throw new ServiceRestError("Password is too weak", 400, "Password is too weak");
        }
    }

    private async generateHashPassword(): Promise<void>{
        const passwordService = PasswordService.getInstance();
        const [hashPassword, salt] = await passwordService.hashPassword(this.userRegisterData.plainPassword);

        this.hashPassword = hashPassword;
        this.salt = salt;
    }

    private async addUserToDb(){
        const accountStorage = AccountStorage.getInstance();
        await accountStorage.createUser({
            "Email": this.userRegisterData.email,
            "FirstName": this.userRegisterData.displayName,
            "HashedPassword": this.hashPassword as string,
            "Salt": this.salt as string,
            "LastName" : ""
        });

    }

    public async registerUser(){
        await this.checkPasswordStrengthAndThrow();
        await this.generateHashPassword();
        await this.addUserToDb();
    }
}
