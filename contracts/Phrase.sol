// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Phrase {
    string storedData;

    // function addWord(string memory word) public {
    //     if (bytes(storedData).length == 0) {
    //         storedData = word;
    //     } else {
    //         storedData = string(abi.encodePacked(storedData, " ", word));
    //     }
    // }

    // function getPhrase() public view returns (string memory) {
    //     return storedData;
    // }

    address[] transactionHistoryAddresses;
    string[] transactionHistoryPhrases;

    function addWord(string memory word) public {
        if (bytes(storedData).length == 0) {
            storedData = word;
        } else {
            storedData = string(abi.encodePacked(storedData, " ", word));
        }
        transactionHistoryAddresses.push(msg.sender);
        transactionHistoryPhrases.push(word);
    }

    function getPhrase() public view returns (string memory) {
        // Would actually make this change in client, but wanted to show how to upgrade
        // contracts with this example.  Make sure to look at OpenZeppelin docs for more.
        return string(abi.encodePacked("Once upon a time ", storedData));
    }

    function getTransactionHistory()
        public
        view
        returns (address[] memory, string[] memory)
    {
        return (transactionHistoryAddresses, transactionHistoryPhrases);
    }
}
