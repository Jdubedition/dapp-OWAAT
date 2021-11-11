// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract RandomNumberGenerator {
    function getNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp))) % 43;
    }
}
