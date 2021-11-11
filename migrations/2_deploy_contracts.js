var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RandomNumberGenerator = artifacts.require("./RandomNumberGenerator.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(RandomNumberGenerator);
};
