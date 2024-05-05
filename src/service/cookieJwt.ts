import { CookieOptions } from "express";

export default class CookieService {
    private jwt: string;
    private userId: string;
    private SERVICE_NAME_IN_COOKIE = "KEY_LINK";
    private DEFAULT_COOKIE_POLICY: CookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(Date.now() + this.getExpireDayFromEnv() * 24 * 60 * 60 * 1000),
        priority: "high"
    }

    constructor(jwt: string, userId: string) {
        this.jwt = jwt;
        this.userId = userId;
    }
    private getExpireDayFromEnv(): number {
        const EXPIRE_DAY_ENV_KEY = "JWT_COOKIE_EXPIRE_DAY";
        const expireDay = process.env[EXPIRE_DAY_ENV_KEY];

        if (!expireDay) {
            throw new Error("Expire day not found in environment variables");
        }

        return parseInt(expireDay);
    }

    public getJwtCookieHttpConfig(): [name: string,
        val: string,
        options: CookieOptions] {

        const COOKIE_TOKEN_KEY = this.SERVICE_NAME_IN_COOKIE + "_TOKEN";

        return [COOKIE_TOKEN_KEY, this.jwt, { httpOnly: true, ...this.DEFAULT_COOKIE_POLICY }]
    }

    public getUserIdCookieHttpConfig(): [name: string, val: string, options: CookieOptions] {
        const COOKIE_USER_ID_KEY = this.SERVICE_NAME_IN_COOKIE + "_UUID";

        return [COOKIE_USER_ID_KEY, this.userId, { httpOnly: false, ...this.DEFAULT_COOKIE_POLICY}]
    }

}