import DbConn from './dbConn.js';
import { Prisma } from '@prisma/client'


export default class AccountStorage{
    private static instance: AccountStorage;

    private constructor(){}

    public static getInstance(): AccountStorage{
        if (!AccountStorage.instance){
            AccountStorage.instance = new AccountStorage();
        }
        return AccountStorage.instance;
    }

    public async countUserByEmail(email: string){
        return await DbConn.users.count({
            where: {
                Email: email
            }
        })
    }

    public async getUserStatus(email: string){
        return await DbConn.users.findUnique({
            where: {
                Email: email
            },
            select: {
                Active: true
            }
        })
    }

    public async getHashedPassword(email: string){
        return await DbConn.users.findUnique({
            where: {
                Email: email
            },
            select: {
                HashedPassword: true
            }
        })
    }
    
    public async createUser(userData: Prisma.UsersCreateInput){
        await DbConn.users.create({
            data: userData
        })
    }
    public async updateUser(userId: number,userData: Prisma.UsersUpdateInput){
        await DbConn.users.update({
            where: {
                UserID: userId
            },
            data: userData
        })
    }
}