import { Prisma } from '@prisma/client';
import Db from './db.js';

export default class AccountDb{
    private static instance: AccountDb;
    private db = Db;

    private constructor(){}

    public static getInstance(): AccountDb{
        if (!AccountDb.instance){
            AccountDb.instance = new AccountDb();
        }
        return AccountDb.instance;
    }

    public async countUserByEmail(email: string){
        return await this.db.users.count({
            where: {
                Email: email
            }
        })
    }

    public async getUserStatus(email: string){
        return await this.db.users.findUnique({
            where: {
                Email: email
            },
            select: {
                Active: true
            }
        })
    }

    public async getHashedPassword(email: string){
        return await this.db.users.findUnique({
            where: {
                Email: email
            },
            select: {
                HashedPasswordWithSalt: true
            }
        })
    }
    
    public async createUser(userData: Prisma.UsersCreateInput){
        await this.db.users.create({
            data: userData
        })
    }
    public async updateUser(userUUID: string, userData: Prisma.UsersUpdateInput){
        await this.db.users.update({
            where: {
                UserUUID: userUUID
            },
            data: userData
        })
    }
    public async getUserIdByEmail(email: string){
        return await this.db.users.findUnique({
            where: {
                Email: email
            },
            select: {
                UserUUID: true
            }
        })
    }
}