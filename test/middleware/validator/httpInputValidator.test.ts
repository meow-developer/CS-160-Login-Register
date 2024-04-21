import { validateLogin, validateRegister} from "../../../src/middleware/validator/httpInputValidator.js";
describe("validateLogin", () => {
    it("should return an error if email is missing", () => {
        const input = {
            password: "password123",
        };

        const { error } = validateLogin(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"email" is required');
    });

    it("should return an error if email is invalid", () => {
        const input = {
            email: "invalid-email",
            password: "password123",
        };

        const { error } = validateLogin(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"email" must be a valid email');
    });

    it("should return an error if password is missing", () => {
        const input = {
            email: "test@example.com",
        };

        const { error } = validateLogin(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"password" is required');
    });

    it("should return an error if password is too short", () => {
        const input = {
            email: "test@example.com",
            password: "pass",
        };

        const { error } = validateLogin(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain(
            '"password" length must be at least 8 characters long'
        );
    });

    it("should return an error if password is too long", () => {
        const input = {
            email: "test@example.com",
            password: "verylongpasswordthatexceeds30characters",
        };

        const { error } = validateLogin(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain(
            '"password" length must be less than or equal to 30 characters long'
        );
    });

    it("should return undefined if input is valid", () => {
        const input = {
            email: "test@example.com",
            password: "password123",
        };

        const { error } = validateLogin(input);

        expect(error).toBeUndefined();
    });
});

describe("validateRegister", () => {
    it("should return an error if displayName is missing", () => {
        const input = {
            email: "test@example.com",
            password: "Test123!",
        };

        const { error } = validateRegister(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"displayName" is required');
    });

    it("should return an error if email is invalid", () => {
        const input = {
            displayName: "John Doe",
            email: "invalid-email",
            password: "Test123!",
        };

        const { error } = validateRegister(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"email" must be a valid email');
    });

    it("should return an error if password is too short", () => {
        const input = {
            displayName: "John Doe",
            email: "test@example.com",
            password: "short",
        };

        const { error } = validateRegister(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"password" length must be at least 8 characters long');
    });

    it("should return an error if password is too long", () => {
        const input = {
            displayName: "John Doe",
            email: "test@example.com",
            password: "verylongpasswordthatexceedsthemaximumcharacterlimit",
        };

        const { error } = validateRegister(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('"password" length must be less than or equal to 30 characters long');
    });

    it("should return an error if password does not meet the complexity requirements", () => {
        const input = {
            displayName: "John Doe",
            email: "test@example.com",
            password: "password123",
        };

        const { error } = validateRegister(input);

        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain(
            '"password" with value "password123" fails to match the required pattern'
        );
    });

    it("should return undefined if input is valid", () => {
        const input = {
            displayName: "John Doe",
            email: "test@example.com",
            password: "Test123!",
        };

        const { error } = validateRegister(input);

        expect(error).toBeUndefined();
    });
});





