// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Phrase.sol";

contract TestPhrase {
    function testAddsFirstWordToPhrase() public {
        Phrase phrase = Phrase(DeployedAddresses.Phrase());

        phrase.addWord("test");

        string memory expectedPhrase = "Once upon a time test";

        address expectedTransactionHistoryAddress = address(this);
        string memory expectedTransactionHistoryPhrase = "test";

        address[] memory addressResult;
        string[] memory phraseResult;
        (addressResult, phraseResult) = phrase.getTransactionHistory();

        Assert.equal(
            phrase.getPhrase(),
            expectedPhrase,
            "Phrase should be 'Once upon a time test'."
        );

        Assert.equal(
            addressResult[0],
            expectedTransactionHistoryAddress,
            "Transaction history address should be 'this'."
        );

        Assert.equal(
            phraseResult[0],
            expectedTransactionHistoryPhrase,
            "Transaction history phrase should be 'test'."
        );
    }

    function testAddsSecondWordToPhrase() public {
        Phrase phrase = Phrase(DeployedAddresses.Phrase());

        phrase.addWord("this");

        string memory expected = "Once upon a time test this";

        address expectedTransactionHistoryAddress = address(this);
        string memory expectedTransactionHistoryPhrase = "this";

        address[] memory addressResult;
        string[] memory phraseResult;
        (addressResult, phraseResult) = phrase.getTransactionHistory();

        Assert.equal(
            phrase.getPhrase(),
            expected,
            "Phrase should be 'Once upon a time test this'."
        );

        Assert.equal(
            addressResult.length,
            2,
            "Transaction history addresses should have 2 entries."
        );

        Assert.equal(
            addressResult[1],
            expectedTransactionHistoryAddress,
            "Transaction history address should be 'this'."
        );

        Assert.equal(
            phraseResult[1],
            expectedTransactionHistoryPhrase,
            "Transaction history phrase should be 'this'."
        );
    }
}
