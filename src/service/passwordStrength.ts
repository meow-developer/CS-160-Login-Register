import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import 'dotenv/config';

class PasswordStrengthCheckerError extends Error{
    constructor(message: string){
        super(message);
        this.name = 'PasswordStrengthCheckerError';
    }
}

export default class PasswordStrengthChecker{
    private LambdaClient: LambdaClient = new LambdaClient({ region: 'us-east-1' });
    private password: string;
    constructor(password: string){
        this.password = password;

    }
    private getLambdaFunctionNameFromEnv(){
        const functionName = process.env.PASSWORD_STRENGTH_CHECKER_LAMBDA_NAME;
        if(!functionName){
            throw new PasswordStrengthCheckerError('PASSWORD_STRENGTH_CHECKER_LAMBDA_NAME is not defined in the environment variables');
        }
        return functionName;
    }
    private getInvokeCommand(): InvokeCommand{
        return new InvokeCommand({
            FunctionName: this.getLambdaFunctionNameFromEnv(),
            Payload: JSON.stringify({
                "password": this.password
            })
        });
    }
    private async sendRequestToLambda(invokeCommand: InvokeCommand){
        const { Payload } = await this.LambdaClient.send(invokeCommand);
        const response = Buffer.from(Payload as Uint8Array).toString('utf-8');
        const responseBody = JSON.parse(response).body;
        return JSON.parse(responseBody);
    }
    private parseLambdaResponse(response: any){
        return response;
    }
    public async getPasswordStrength(): Promise<boolean>{
        const invokeCommand = this.getInvokeCommand();
        const response = await this.sendRequestToLambda(invokeCommand);
        return this.parseLambdaResponse(response);
    }
}