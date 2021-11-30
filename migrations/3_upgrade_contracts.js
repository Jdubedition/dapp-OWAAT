const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Phrase = artifacts.require('Phrase');
const PhraseV2 = artifacts.require('PhraseV2');

module.exports = async function (deployer) {
    const instance = await Phrase.deployed();
    await upgradeProxy(instance.address, PhraseV2, { deployer });
};
