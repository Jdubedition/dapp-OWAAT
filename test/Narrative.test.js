const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');
const [owner] = accounts;

const { expect } = require('chai');

const Narrative = contract.fromArtifact('Narrative'); // Loads a compiled contract

const fromWei = web3.utils.fromWei;
const toWei = web3.utils.toWei;
const toBN = web3.utils.toBN;

describe('Narrative', function () {
    beforeEach(async function () {
        this.narrative = await Narrative.new({ from: owner });
        await this.narrative.initialize({ from: owner });
    });

    it('validateWord should cause fail in newStory for certain values', async function () {
        expectRevert(this.narrative.newStory(''), 'Word must be at least 1 character');
        expectRevert(this.narrative.newStory('a'.repeat(43)), 'Word must be at least 42 characters');
    });

    it('add Story and then get Story titles', async function () {
        await this.narrative.newStory('Test', { value: toWei('0.1', 'ether'), from: accounts[1] });
        const numStories = await this.narrative.getNumStories();
        const titles = await this.narrative.getStoryTitles();
        expect(titles.length).to.be.equal(2);
        expect(numStories).to.be.eql(toBN(2));
        expect(titles[0]).to.be.eql(['0', 'The']);
        expect(titles[1]).to.be.eql(['1', 'Test']);
    });

    it('check that variables should be private', async function () {
        expectRevert(this.narrative.numStories);
        expectRevert(this.narrative.Stories);
    });

    it('getBalance should only work with owner and return value of ether in contract', async function () {
        const balance1 = await this.narrative.getBalance({ from: owner });
        await this.narrative.deposit({ from: accounts[1], value: toWei('1', 'ether') });
        const balance2 = await this.narrative.getBalance({ from: owner });
        expect(balance1).to.be.eql(toBN(0));
        expect(fromWei(balance2)).to.be.equal(fromWei(toWei('1')));
        expectRevert(this.narrative.getBalance({ from: accounts[1] }));
    });

    it('should add word to story', async function () {
        await this.narrative.addWordToStory(0, 'test', { value: toWei('0.01', 'ether'), from: owner });
        const story = await this.narrative.getStory(0);
        expect((await this.narrative.getBalance({ from: owner })).toString()).to.equal(toWei('0.01', 'ether'));
        expect(story.title).to.equal('The');
        expect(story.words.length).to.equal(1);
        expect(story.words[0]).to.equal('test');
    });

    // it('should addWord twice', async function () {
    //     await this.narrative.addWord('test', { value: toWei('0.01', 'ether') });
    //     await this.narrative.addWord('this', { value: toWei('0.01', 'ether') });
    //     expect((await this.narrative.getBalance({ from: owner })).toString()).to.equal(toWei('0.02', 'ether'));
    //     expect(await this.narrative.getPhrase()).to.equal('test this');
    // });

    // it('getBalance from non-owner should error', async function () {
    //     await expectRevert(this.narrative.getBalance({ from: accounts[1] }), 'caller is not the owner');
    // });

    // it('ownerWithdraw from non-owner should error', async function () {
    //     await expectRevert(this.narrative.ownerWithdraw({ from: accounts[1] }), 'caller is not the owner');
    // });

    // it('ownerWithdraw works to receive contract balance', async function () {
    //     const amountToSend = toWei('0.01', 'ether');

    //     // Another account uses addWord function and deposit some ether
    //     await this.narrative.addWord('test', { value: amountToSend, from: accounts[1] });

    //     // Owner withdraws balance from contract
    //     const balanceBeforeWithdraw = await web3.eth.getBalance(owner);
    //     await this.narrative.ownerWithdraw({ from: owner });
    //     const balanceAfterWithdraw = await web3.eth.getBalance(owner);

    //     // Calculate ownerWithdraw price
    //     const ownerWithDrawPrice = toBN(balanceBeforeWithdraw).sub(toBN(balanceAfterWithdraw)).add(toBN(amountToSend));

    //     expect(fromWei(toBN(balanceAfterWithdraw).add(ownerWithDrawPrice))).to.equal(fromWei(toBN(balanceBeforeWithdraw).add(toBN(amountToSend))));
    // });

    // it('addWord should not accept a zero or over 42 character length word', async function () {
    //     await expectRevert(this.narrative.addWord('', { value: toWei('0.01', 'ether') }), 'word must be between 1 than 42 characters, inclusive');
    //     await expectRevert(this.narrative.addWord('a'.repeat(43), { value: toWei('0.01', 'ether') }), 'word must be between 1 than 42 characters, inclusive');
    // });

});
