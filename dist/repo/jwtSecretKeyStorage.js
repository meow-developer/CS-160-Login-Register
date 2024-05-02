import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import 'dotenv/config';
class JwtSecretKeyStorageError extends Error {
    constructor(message) {
        super(message);
    }
}
export default class JwtSecretKeyStorage {
    constructor() {
        this.secretId = this.getSecretIdFromEnv();
    }
    static getInstance() {
        if (!JwtSecretKeyStorage.instance) {
            JwtSecretKeyStorage.instance = new JwtSecretKeyStorage();
        }
        return JwtSecretKeyStorage.instance;
    }
    getSecretIdFromEnv() {
        const SECRET_ID_ENV_NAME = 'JWT_SECRET_ID';
        const secretId = process.env[SECRET_ID_ENV_NAME];
        if (!secretId) {
            throw new JwtSecretKeyStorageError(`Environment variable ${SECRET_ID_ENV_NAME} not set`);
        }
        return secretId;
    }
    async getSecretKeyFromSecretsManager() {
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
    async getSecretKey() {
        const secret = await this.getSecretKeyFromSecretsManager();
        return secret;
    }
}
