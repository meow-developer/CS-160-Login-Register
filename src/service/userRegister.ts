import { Prisma } from '@prisma/client';

import PasswordService from "./password.js";
import AccountStorage from "../repo/accountStorage.js";

export default class UserRegisterService{
    private firstName: string;
    private lastName: string;
    private email: string;
    private plainPassword: string;
    private hashPassword: string | null = null;
    private salt: string | null = null;

    public constructor(firstName: string, 
                        lastName: string, 
                        email: string, 
                        plainPassword: string){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.plainPassword = plainPassword;
    }

    private async generateHashPassword(): Promise<void>{
        const passwordService = PasswordService.getInstance();
        const [hashPassword, salt] = await passwordService.hashPassword(this.plainPassword);

        this.hashPassword = hashPassword;
        this.salt = salt;
    }

    private async addUserToDb(){
        const userDbData: Prisma.UsersCreateInput = {
            FirstName: this.firstName,
            LastName: this.lastName,
            Email: this.email,
            HashedPassword: this.hashPassword!,
            Salt: this.salt!,
            Active: true
        }

        const accountStorage = AccountStorage.getInstance();
        await accountStorage.createUser(userDbData);

    }

    public async registerUser(){
        await this.generateHashPassword();
        await this.addUserToDb();
    }
}
