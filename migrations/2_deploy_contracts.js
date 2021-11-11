var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RandomNumberGenerator = artifacts.require("./RandomNumberGenerator.sol");
var Phrase = artifacts.require("./Phrase.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(RandomNumberGenerator);
  deployer.deploy(Phrase);
};
