// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Phrase.sol";

contract TestPhrase {
    function testAddsFirstWordToPhrase() public {
        Phrase phrase = Phrase(DeployedAddresses.Phrase());

        phrase.addWord("test");

        string memory expected = "Once upon a time test";

        Assert.equal(phrase.getPhrase(), expected, "Phrase should be 'Once upon a time test'.");
    }

    function testAddsSecondWordToPhrase() public {
        Phrase phrase = Phrase(DeployedAddresses.Phrase());

        phrase.addWord("this");

        string memory expected = "Once upon a time test this";

        Assert.equal(
            phrase.getPhrase(),
            expected,
            "Phrase should be 'Once upon a time test this'."
        );
    }
}
