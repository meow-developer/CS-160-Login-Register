import bcrypt from "bcrypt";


export default class PasswordService{
    private static instance: PasswordService;
    private constructor(){}
    
    public static getInstance(): PasswordService{
        if (!PasswordService.instance){
            PasswordService.instance = new PasswordService();
        }
        return PasswordService.instance;
    }

    public async hashPassword(plainPassword: string): Promise<Array<string>> {
        const SALT_ROUNDS = 10;

        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hashPassword = bcrypt.hashSync(plainPassword, salt);

        return [
            hashPassword, salt
        ]
    }
    public async checkPassword(plainPassword: string, hashPassword: string): Promise<boolean> {
        const match = bcrypt.compareSync(plainPassword, hashPassword);
        return match;
    }

}