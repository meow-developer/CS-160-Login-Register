import bcrypt from "bcrypt";

export default class HashPasswordService{
    private static instance: HashPasswordService;
    private constructor(){}
    
    public static getInstance(): HashPasswordService{
        if (!HashPasswordService.instance){
            HashPasswordService.instance = new HashPasswordService();
        }
        return HashPasswordService.instance;
    }

    public async hashPassword(plainPassword: string): Promise<Array<string>> {
        const SALT_ROUNDS = 10;

        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hashPassword = bcrypt.hashSync(plainPassword, salt);

        return [
            hashPassword, salt
        ]
    }
    
    public async verifyPasswordWithHash(plainPassword: string, hashPassword: string): Promise<boolean> {
        const match = bcrypt.compareSync(plainPassword, hashPassword);
        return match;
    }

}