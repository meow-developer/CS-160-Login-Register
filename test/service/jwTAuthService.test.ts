import JwTAuthService from '../../src/service/jwtAuth.js'

describe("JwtAuthService", () => {
    let jwTAuthService: JwTAuthService;

    beforeEach(() => {
        jwTAuthService = JwTAuthService.getInstance();
    });
    it("should return a JWT token", async () => {
        // Arrange
        const userId = '1234';

        // Act
        const token = await jwTAuthService.signToken(userId);

        // Assert
        console.log(token);
    })

    it("should verify a JWT token", async () => {
        // Arrange
        const userId = '1234';
        const token = await jwTAuthService.signToken(userId);

        // Act
        const decodedToken = await jwTAuthService.verifyToken(token);

        // Assert
        console.log(decodedToken);
    })
});