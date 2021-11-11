// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Phrase.sol";

contract TestPhrase {
    function testAddsFirstWordToPhrase() public {
        Phrase phrase = Phrase(DeployedAddresses.Phrase());

        phrase.addWord("test");

        string memory expected = "test";

        Assert.equal(phrase.getPhrase(), expected, "Phrase should be 'test'.");
    }

    function testAddsSecondWordToPhrase() public {
        Phrase phrase = Phrase(DeployedAddresses.Phrase());

        phrase.addWord("this");

        string memory expected = "test this";

        Assert.equal(
            phrase.getPhrase(),
            expected,
            "Phrase should be 'test this'."
        );
    }
}
