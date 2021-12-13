const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Phrase = artifacts.require('Phrase');
const PhraseV2 = artifacts.require('PhraseV2');
const PhraseV3 = artifacts.require('PhraseV3');

module.exports = async function (deployer) {
    const phrase = await Phrase.deployed();
    await upgradeProxy(phrase.address, PhraseV2, { deployer });
    const phraseV2 = await PhraseV2.deployed();
    await upgradeProxy(phraseV2.address, PhraseV3, { deployer });
};
