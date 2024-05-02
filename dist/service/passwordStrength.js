import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import 'dotenv/config';
class PasswordStrengthCheckerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PasswordStrengthCheckerError';
    }
}
export default class PasswordStrengthChecker {
    constructor(password) {
        this.LambdaClient = new LambdaClient({ region: 'us-east-1' });
        this.password = password;
    }
    getLambdaFunctionNameFromEnv() {
        const functionName = process.env.PASSWORD_STRENGTH_CHECKER_LAMBDA_NAME;
        if (!functionName) {
            throw new PasswordStrengthCheckerError('PASSWORD_STRENGTH_CHECKER_LAMBDA_NAME is not defined in the environment variables');
        }
        return functionName;
    }
    getInvokeCommand() {
        return new InvokeCommand({
            FunctionName: this.getLambdaFunctionNameFromEnv(),
            Payload: JSON.stringify({
                "password": this.password
            })
        });
    }
    async sendRequestToLambda(invokeCommand) {
        const { Payload } = await this.LambdaClient.send(invokeCommand);
        const response = Buffer.from(Payload).toString('utf-8');
        const responseBody = JSON.parse(response).body;
        return JSON.parse(responseBody);
    }
    parseLambdaResponse(response) {
        return response;
    }
    async getPasswordStrength() {
        const invokeCommand = this.getInvokeCommand();
        const response = await this.sendRequestToLambda(invokeCommand);
        return this.parseLambdaResponse(response);
    }
}
