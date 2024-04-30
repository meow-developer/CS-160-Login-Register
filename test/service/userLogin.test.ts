import UserLoginService from "../../src/service/userLogin";

describe("UserLoginService", () => {
    let userLoginService: UserLoginService;
    describe("login", () => {
        it("should fail the login because of wrong password", async () => {
            const loginCredentials = {
                email: "Missouri.Christiansen87@hotmail.com",
                password: "password123"
            }

            userLoginService = new UserLoginService(loginCredentials);
            const token = userLoginService.login();
            
            expect(token).rejects.toThrow("Password does not match");
        })
    })
});