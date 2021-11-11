// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RandomNumberGenerator.sol";

contract TestRandomNumberGenerator {
    function testNumberGeneration() public {
        RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator(
            DeployedAddresses.RandomNumberGenerator()
        );

        Assert.isAtMost(
            randomNumberGenerator.getNumber(),
            uint256(42),
            "Number should be between 0 and 42."
        );
    }
}
