import jwt from 'jsonwebtoken';
import JwtSecretKeyStorage from '../repo/jwtSecretKeyStorage.js';
import 'dotenv/config';

export default class JwTAuthService{
    public static instance: JwTAuthService;
    private JwtSecretKeyStorage = JwtSecretKeyStorage.getInstance();
    private JwtConfig = this.getJwtConfig();

    private constructor(){
    }

    public static getInstance(){
        if(JwTAuthService.instance === undefined){
            JwTAuthService.instance = new JwTAuthService();
        }
        return JwTAuthService.instance;
    }

    private async getTokenSecretKey(){
        return await this.JwtSecretKeyStorage.getSecretKey();
    }

    private getJwtConfig(): {[key: string]: string}{
        /**
         * Check the options section in the following link to see the available options
         * @see {@link} https://www.npmjs.com/package/jsonwebtoken#:~:text=with%20an%20error.-,options,-%3A
         */
        const JWT_CONFIG_ENV_KEY = 'JWT_CONFIG';

        let jwtConfig = JSON.parse(process.env[JWT_CONFIG_ENV_KEY]!);       

        return jwtConfig;
    }

    public async signToken(userId: string){
        const secretKey = await this.getTokenSecretKey();

        const token = jwt.sign({userId: userId}, 
                                secretKey, 
                                this.JwtConfig);
        return token;
    }

    public async verifyToken(token: string){
        const secretKey = await this.getTokenSecretKey();
        return jwt.verify(token, secretKey);
    }
}