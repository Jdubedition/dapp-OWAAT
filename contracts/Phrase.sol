// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Phrase {
    string storedData;

    function addWord(string memory word) public {
        if (bytes(storedData).length == 0) {
            storedData = word;
        } else {
            storedData = string(abi.encodePacked(storedData, " ", word));
        }
    }

    function getPhrase() public view returns (string memory) {
        return storedData;
    }
}
