const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const [owner] = accounts;

const { expect } = require('chai');

const Phrase = contract.fromArtifact('PhraseV2'); // Loads a compiled contract

const fromWei = web3.utils.fromWei;
const toWei = web3.utils.toWei;
const toBN = web3.utils.toBN;

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
        await this.phrase.addWord('test', { value: toWei('0.01', 'ether'), from: owner });
        expect((await this.phrase.getBalance({ from: owner })).toString()).to.equal(toWei('0.01', 'ether'));
        expect(await this.phrase.getPhrase()).to.equal('Once upon a time test');
    });

    it('should addWord twice', async function () {
        await this.phrase.addWord('test', { value: toWei('0.01', 'ether') });
        await this.phrase.addWord('this', { value: toWei('0.01', 'ether') });
        expect((await this.phrase.getBalance({ from: owner })).toString()).to.equal(toWei('0.02', 'ether'));
        expect(await this.phrase.getPhrase()).to.equal('Once upon a time test this');
    });

    it('getBalance from non-owner should error', async function () {
        await expectRevert(this.phrase.getBalance({ from: accounts[1] }), 'caller is not the owner');
    });

    it('ownerWithdraw from non-owner should error', async function () {
        await expectRevert(this.phrase.ownerWithdraw({ from: accounts[1] }), 'caller is not the owner');
    });

    it('ownerWithdraw works to receive contract balance', async function () {
        const amountToSend = toWei('0.01', 'ether');

        // Another account uses addWord function and deposit some ether
        await this.phrase.addWord('test', { value: amountToSend, from: accounts[1] });

        // Owner withdraws balance from contract
        const balanceBeforeWithdraw = await web3.eth.getBalance(owner);
        await this.phrase.ownerWithdraw({ from: owner });
        const balanceAfterWithdraw = await web3.eth.getBalance(owner);

        // Calculate ownerWithdraw price
        const ownerWithDrawPrice = toBN(balanceBeforeWithdraw).sub(toBN(balanceAfterWithdraw)).add(toBN(amountToSend));

        expect(fromWei(toBN(balanceAfterWithdraw).add(ownerWithDrawPrice))).to.equal(fromWei(toBN(balanceBeforeWithdraw).add(toBN(amountToSend))));
    });
});
