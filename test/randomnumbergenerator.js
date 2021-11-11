const RandomNumberGenerator = artifacts.require("./RandomNumberGenerator.sol");

contract("RandomNumberGenerator", accounts => {
    it("Number should be between 0 and 42.", async () => {
        const randomNumberGeneratorInstance = await RandomNumberGenerator.deployed();

        const result = await randomNumberGeneratorInstance.getNumber.call();

        assert.isAtMost(parseInt(result), 42, "The value was not between 0 and 42.");
    });
});
