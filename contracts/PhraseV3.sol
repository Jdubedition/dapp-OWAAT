// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract PhraseV3 is OwnableUpgradeable {
    string private storedData;
    address[] private transactionHistoryAddresses;
    string[] private transactionHistoryPhrases;

    function initialize() public initializer {
        __Ownable_init();
    }

    function alive() public pure returns (bool) {
        return true;
    }

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function ownerWithdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "ownerWithdraw failed");
    }

    function addWord(string memory word) public payable {
        require(
            bytes(word).length > 0 && bytes(word).length <= 42,
            "word must be between 1 than 42 characters, inclusive"
        );
        require(
            msg.value == 0.01 ether,
            "You must provide 0.01 ether to add a word"
        );

        if (bytes(storedData).length == 0) {
            storedData = word;
        } else {
            storedData = string(abi.encodePacked(storedData, " ", word));
        }

        transactionHistoryAddresses.push(msg.sender);
        transactionHistoryPhrases.push(word);
    }

    function getPhrase() public view returns (string memory) {
        return storedData;
    }

    function getTransactionHistory()
        public
        view
        returns (address[] memory, string[] memory)
    {
        return (transactionHistoryAddresses, transactionHistoryPhrases);
    }
}
