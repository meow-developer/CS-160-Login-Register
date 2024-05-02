import Db from './db.js';
export default class AccountDb {
    constructor() {
        this.db = Db;
    }
    static getInstance() {
        if (!AccountDb.instance) {
            AccountDb.instance = new AccountDb();
        }
        return AccountDb.instance;
    }
    async countUserByEmail(email) {
        return await this.db.users.count({
            where: {
                Email: email
            }
        });
    }
    async getUserStatus(email) {
        return await this.db.users.findUnique({
            where: {
                Email: email
            },
            select: {
                Active: true
            }
        });
    }
    async getHashedPassword(email) {
        return await this.db.users.findUnique({
            where: {
                Email: email
            },
            select: {
                HashedPasswordWithSalt: true
            }
        });
    }
    async createUser(userData) {
        await this.db.users.create({
            data: userData
        });
    }
    async updateUser(userUUID, userData) {
        await this.db.users.update({
            where: {
                UserUUID: userUUID
            },
            data: userData
        });
    }
    async getUserIdByEmail(email) {
        return await this.db.users.findUnique({
            where: {
                Email: email
            },
            select: {
                UserUUID: true
            }
        });
    }
}
