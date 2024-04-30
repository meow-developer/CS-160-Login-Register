import JwtSecretKeyStorage from "../../src/repo/jwtSecretKeyStorage.js";

describe("JwtSecretKeyStorage", () => {
    describe("getSecretKey", () => {
        it("should return the secret key from Secrets Manager", async () => {
            // Arrange
            const jwtSecretKeyStorage = JwtSecretKeyStorage.getInstance();

            // Act
            const result = await jwtSecretKeyStorage.getSecretKey();

            // Assert
            console.log(result);
        });

    });
});
