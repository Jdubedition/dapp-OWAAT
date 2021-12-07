const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const [owner] = accounts;

const { expect } = require('chai');

const Phrase = contract.fromArtifact('PhraseV2'); // Loads a compiled contract

describe('Phrase', function () {
    beforeEach(async function () {
        this.phrase = await Phrase.new({ from: owner });
        await this.phrase.initialize({ from: owner });
    });

    it('should be alive', async function () {
        expect(await this.phrase.alive()).to.equal(true);
    });

    it('should deposit amount', async function () {
        await this.phrase.deposit({ value: 1000, from: owner });
        expect((await this.phrase.getBalance({ from: owner })).toString()).to.equal('1000');
    });

    it('should addWord', async function () {
        await this.phrase.addWord('test', { value: 10000 });
        expect((await this.phrase.getBalance({ from: owner })).toString()).to.equal('10000');
        expect(await this.phrase.getPhrase()).to.equal('Once upon a time test');
    });

    it('should addWord twice', async function () {
        await this.phrase.addWord('test', { value: 10000 });
        await this.phrase.addWord('this', { value: 10000 });
        expect((await this.phrase.getBalance({ from: owner })).toString()).to.equal('20000');
        expect(await this.phrase.getPhrase()).to.equal('Once upon a time test this');
    });

    it('getBalance from non-owner should error', async function () {
        await this.phrase.deposit({ value: 1000 });
        await expectRevert(this.phrase.getBalance({ from: accounts[1] }), 'caller is not the owner');
    });
});
