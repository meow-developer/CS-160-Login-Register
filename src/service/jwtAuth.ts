import jwt from 'jsonwebtoken';
import JwtSecretKeyStorage from '../repo/jwtSecretKeyStorage.js';
import 'dotenv/config';

export default class JwTAuthService{
    public static instance: JwTAuthService;
    private JwtSecretKeyStorage = JwtSecretKeyStorage.getInstance();
    private secretKey: string | null = null;
    private JwtConfig = this.getJwtConfig();

    private constructor(){
        this.loadTokenPublicKey();
    }

    public static getInstance(){
        if(JwTAuthService.instance === undefined){
            JwTAuthService.instance = new JwTAuthService();
        }
        return JwTAuthService.instance;
    }

    private loadTokenPublicKey(){
        this.JwtSecretKeyStorage.getSecretKey().then((key) => {
            this.secretKey = key;
        });
    }

    private getJwtConfig(): {[key: string]: string}{
        /**
         * Check the options section in the following link to see the available options
         * @see {@link} https://www.npmjs.com/package/jsonwebtoken#:~:text=with%20an%20error.-,options,-%3A
         */
        const JWT_ENV_KEY_PREFIX = 'JWT_CONFIG_';
        const CONFIG_NAME = ["EXPIRE_TIME"];
        let jwtConfig: any = {};

        for (const configName of CONFIG_NAME){
            const lowerCaseConfigName = configName.toLowerCase();
            const envKey = JWT_ENV_KEY_PREFIX + lowerCaseConfigName;
            if (process.env[envKey] === undefined){
                throw new Error(`Environment variable ${envKey} is not set`);
            }
            jwtConfig[lowerCaseConfigName] = process.env[envKey];
        }

        return jwtConfig;
    }

    private checkTokenPublicKeyExistAndThrow(){
        if(this.secretKey === null){
            throw new Error('Token public key is not loaded');
        }
    }

    public async signToken(userId: string){
        this.checkTokenPublicKeyExistAndThrow();

        const token = jwt.sign({userId: userId}, 
                                this.secretKey!, 
                                this.JwtConfig);
        return token;
    }

    public async verifyToken(token: string){
        this.checkTokenPublicKeyExistAndThrow();
        return jwt.verify(token, this.secretKey!);
    }
}