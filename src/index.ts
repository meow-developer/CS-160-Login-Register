import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const lambdaHandler = async (event: APIGatewayProxyEvent) => {

    switch (event.path) {
        case '/login':
            // Do something
            break;
        case '/register':
            // Do something
            break;
        default:
            break;
    }

};
