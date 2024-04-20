import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

class JwtSecretKeyStorageError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default class JwtSecretKeyStorage {
    private secretId: string;
    public static instance: JwtSecretKeyStorage;

    private constructor() {
        this.secretId = this.getSecretIdFromEnv();
    }

    public static getInstance(){
        if (!JwtSecretKeyStorage.instance) {
            JwtSecretKeyStorage.instance = new JwtSecretKeyStorage();
        }

        return JwtSecretKeyStorage.instance;
    }

    private getSecretIdFromEnv(){
        const SECRET_ID_ENV_NAME = 'JWT_SECRET_ID';
        const secretId = process.env[SECRET_ID_ENV_NAME];

        if (!secretId) {
            throw new JwtSecretKeyStorageError(`Environment variable ${SECRET_ID_ENV_NAME} not set`);
        }

        return secretId;
    }

    private async getSecretFromSecretsManager(){
        const client = new SecretsManagerClient();
        const command = new GetSecretValueCommand({
            SecretId: this.secretId
        });

        const response = await client.send(command);

        if (!response.SecretString) {
            throw new JwtSecretKeyStorageError('SecretString not found in response');
        }

        return response.SecretString;
    }
    
    public async getSecretKey(){
        const secret = await this.getSecretFromSecretsManager();
        return secret;
    }
}