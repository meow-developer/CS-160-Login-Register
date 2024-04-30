import PasswordService from "../../service/password.js";

describe("PasswordService", () => {
    let passwordService: PasswordService;

    beforeEach(() => {
        passwordService = PasswordService.getInstance();
    });

    describe("hashPassword", () => {
        it("should hash the password", async () => {
            const plainPassword = "password123";
            const hashedPassword = await passwordService.hashPassword(plainPassword);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword.length).toBeGreaterThan(0);
        });
    });

    describe("verifyPasswordWithHash", () => {
        it("should verify the password with the hash", async () => {
            const plainPassword = "password123";
            const hashedPassword = await passwordService.hashPassword(plainPassword);

            const isPasswordValid = await passwordService.verifyPasswordWithHash(
                plainPassword,
                hashedPassword[0]
            );

            expect(isPasswordValid).toBe(true);
        });

        it("should return false for invalid password", async () => {
            const plainPassword = "password123";
            const invalidPassword = "wrongpassword";
            const hashedPassword = await passwordService.hashPassword(plainPassword);

            const isPasswordValid = await passwordService.verifyPasswordWithHash(
                invalidPassword,
                hashedPassword[0]
            );

            expect(isPasswordValid).toBe(false);
        });
    });

    describe("checkPasswordStrength", () => {
        it("should check the password strength", async () => {
            const password = "testPassword@!123";

            const isPasswordStrong = await passwordService.checkPasswordStrength(
                password
            );

            expect(isPasswordStrong).toBe(true);
        });

        it("should return false for weak password", async () => {
            const password = "12345678";

            const isPasswordStrong = await passwordService.checkPasswordStrength(
                password
            );

            expect(isPasswordStrong).toBe(false);
        });
    });
});
