const Phrase = artifacts.require("./Phrase.sol");

contract("Phrase", accounts => {

    it("test adding first word", async () => {
        const phraseInstance = await Phrase.deployed();

        await phraseInstance.addWord("test", { from: accounts[0] });

        const storedData = await phraseInstance.getPhrase.call();

        assert.equal(storedData, "test", "Phrase should be 'test'.");
    });

    it("test adding second word", async () => {
        const phraseInstance = await Phrase.deployed();

        await phraseInstance.addWord("this", { from: accounts[0] });

        const storedData = await phraseInstance.getPhrase.call();

        assert.equal(storedData, "test this", "Phrase should be 'test this'.");
    });
});
