const Phrase = artifacts.require("../contracts/Phrase.sol");

contract("Phrase", accounts => {

    it("test adding first word", async () => {
        const phraseInstance = await Phrase.deployed();

        await phraseInstance.addWord("test", { from: accounts[0] });

        const storedData = await phraseInstance.getPhrase.call();
        const transactionHistoryResponse = await phraseInstance.getTransactionHistory.call();
        const transactionHistory = [];
        for (let i = 0; i < transactionHistoryResponse[0].length; i++) {
            transactionHistory.push([transactionHistoryResponse[0][i], transactionHistoryResponse[1][i]]);
        }

        assert.equal(storedData, "Once upon a time test", "Phrase should be 'Once upon a time test'.");
        assert.equal(transactionHistory.length, 1, "Transaction history should have 1 entry.");
        assert.equal(transactionHistory[0][0], accounts[0], "Transaction history should have the correct sender.");
        assert.equal(transactionHistory[0][1], "test", "Transaction history should have the correct phrase, 'test'.");
    });

    it("test adding second word", async () => {
        const phraseInstance = await Phrase.deployed();

        await phraseInstance.addWord("this", { from: accounts[0] });

        const storedData = await phraseInstance.getPhrase.call();
        const transactionHistoryResponse = await phraseInstance.getTransactionHistory.call();
        const transactionHistory = [];
        for (let i = 0; i < transactionHistoryResponse[0].length; i++) {
            transactionHistory.push([transactionHistoryResponse[0][i], transactionHistoryResponse[1][i]]);
        }

        assert.equal(storedData, "Once upon a time test this", "Phrase should be 'Once upon a time test this'.");
        assert.equal(transactionHistory.length, 2, "Transaction history should have 2 entries.");
        assert.equal(transactionHistory[1][0], accounts[0], "Transaction history should have the correct sender.");
        assert.equal(transactionHistory[1][1], "this", "Transaction history should have the correct phrase, 'this'.");
    });
});
