export default class RestResponseMaker {
    static makeSuccessResponse(data) {
        return {
            success: true,
            errors: [],
            data: data
        };
    }
    static makeErrorResponse(errors) {
        return {
            success: false,
            errors: errors,
            data: {}
        };
    }
}
