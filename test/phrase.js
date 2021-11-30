const Phrase = artifacts.require("./Phrase.sol");

contract("Phrase", accounts => {

    it("test adding first word", async () => {
        const phraseInstance = await Phrase.deployed();

        await phraseInstance.addWord("test", { from: accounts[0] });

        const storedData = await phraseInstance.getPhrase.call();

        assert.equal(storedData, "Once upon a time test", "Phrase should be 'Once upon a time test'.");
    });

    it("test adding second word", async () => {
        const phraseInstance = await Phrase.deployed();

        await phraseInstance.addWord("this", { from: accounts[0] });

        const storedData = await phraseInstance.getPhrase.call();

        assert.equal(storedData, "Once upon a time test this", "Phrase should be 'Once upon a time test this'.");
    });
});
