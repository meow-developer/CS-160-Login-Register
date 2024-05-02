class CaptchaError extends Error {
    constructor(message) {
        super(message);
    }
}
export default class CaptchaService {
    constructor() {
        this.secretKey = this.loadSecretKeyFromEnv();
    }
    async sendVerifyRequest(clientToken, remoteIp) {
        const GOOGLE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify?";
        try {
            const response = await fetch(GOOGLE_VERIFY_URL
                + new URLSearchParams({
                    secret: this.secretKey,
                    response: clientToken,
                    remoteip: remoteIp
                }), {
                method: "POST"
            });
            return response.json();
        }
        catch (error) {
            throw new CaptchaError("Failed to get result response from Google");
        }
    }
    getVerifyResult(resData) {
        console.log(resData);
        const success = resData.success;
        if (typeof success !== "boolean") {
            throw new CaptchaError("Invalid response from Google");
        }
        return success;
    }
    loadSecretKeyFromEnv() {
        const SECRET_KEY_ENY_KEY = "CAPTCHA_SECRET_KEY";
        const secretKey = process.env[SECRET_KEY_ENY_KEY];
        console.log(secretKey);
        if (!secretKey) {
            throw new CaptchaError("Secret key not found in environment variables");
        }
        return secretKey;
    }
    async verifyCaptcha(clientResponse, remoteIp) {
        const resData = await this.sendVerifyRequest(clientResponse, remoteIp);
        const result = this.getVerifyResult(resData);
        return result;
    }
}
