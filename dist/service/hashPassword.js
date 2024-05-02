import bcrypt from "bcrypt";
export default class HashPasswordService {
    constructor() { }
    static getInstance() {
        if (!HashPasswordService.instance) {
            HashPasswordService.instance = new HashPasswordService();
        }
        return HashPasswordService.instance;
    }
    async hashPassword(plainPassword) {
        const SALT_ROUNDS = 10;
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hashPassword = bcrypt.hashSync(plainPassword, salt);
        return [
            hashPassword, salt
        ];
    }
    async verifyPasswordWithHash(plainPassword, hashPassword) {
        const match = bcrypt.compareSync(plainPassword, hashPassword);
        return match;
    }
}
