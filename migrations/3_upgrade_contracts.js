const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Phrase = artifacts.require('Phrase');
const PhraseV2 = artifacts.require('PhraseV2');

module.exports = async function (deployer) {
    const existing = await Phrase.deployed();
    await upgradeProxy(existing.address, PhraseV2, { deployer });
};
