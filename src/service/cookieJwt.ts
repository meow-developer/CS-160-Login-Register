import { CookieOptions } from "express";

export default class CookieJWTService {
    private jwt: string;
    constructor(jwt: string) {
        this.jwt = jwt;
    }
    private getExpireDayFromEnv(): number {
        const EXPIRE_DAY_ENV_KEY = "JWT_COOKIE_EXPIRE_DAY";
        const expireDay = process.env[EXPIRE_DAY_ENV_KEY];

        if (!expireDay) {
            throw new Error("Expire day not found in environment variables");
        }
        
        return parseInt(expireDay);
    }

    public getCookieHttpConfig(): [name: string, 
        val: string, 
        options: CookieOptions]{
        
        const COOKIE_TOKEN_KEY = "token";

        return [COOKIE_TOKEN_KEY, this.jwt, {
            domain: process.env.API_DOMAIN,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            expires: new Date(Date.now() + this.getExpireDayFromEnv() * 24 * 60 * 60 * 1000)
        }]
    }
}