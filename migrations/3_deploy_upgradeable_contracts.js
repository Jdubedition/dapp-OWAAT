const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Phrase = artifacts.require('Phrase');

module.exports = async function (deployer) {
    await deployProxy(Phrase, [], { deployer });
};
