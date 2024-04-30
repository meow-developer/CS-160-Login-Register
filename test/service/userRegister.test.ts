import UserRegisterService, { UserRegisterData } from '../../src/service/userRegister';
import { faker } from '@faker-js/faker';


describe('UserRegisterService', () => {
    let userRegisterService: UserRegisterService;
    let userRegisterData: UserRegisterData;

    beforeEach(() => {
        userRegisterData = {
            displayName: faker.person.fullName(),
            email: faker.internet.email(),
            plainPassword: faker.internet.password()
        }
        userRegisterService = new UserRegisterService(userRegisterData);
    })

    describe("register", () => {
        it("should register the user", async () => {
            const token = await userRegisterService.register();

            expect(token).toBeDefined();         
        });
    })
});