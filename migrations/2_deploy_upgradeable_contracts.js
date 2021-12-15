const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Narrative = artifacts.require('Narrative');

module.exports = async function (deployer) {
    await deployProxy(Narrative, [], { deployer });
};
