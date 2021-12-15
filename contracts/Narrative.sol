// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

contract Narrative is OwnableUpgradeable {
    uint256 private numStories;
    mapping(uint256 => Story) private stories;

    struct Story {
        string title;
        string body;
        uint256 wordCount;
        mapping(uint256 => address) wordContributors;
        mapping(uint256 => string) words;
    }

    function initialize() public initializer {
        __Ownable_init();
        Story storage storyToUpdate = stories[0];
        storyToUpdate.title = "The";
        numStories = 1;

        storyToUpdate.wordContributors[storyToUpdate.wordCount] = owner();
        storyToUpdate.words[storyToUpdate.wordCount] = "The";
        storyToUpdate.wordCount += 1;
    }

    function getStoryTitles() public view returns (string[2][] memory) {
        string[2][] memory titles = new string[2][](numStories);
        for (uint256 i = 0; i < numStories; i++) {
            titles[i][0] = StringsUpgradeable.toString(i);
            titles[i][1] = stories[i].title;
        }
        return titles;
    }

    function getNumStories() public view returns (uint256) {
        return numStories;
    }

    function getStory(uint256 id)
        public
        view
        returns (
            string memory title,
            string memory body,
            uint256 wordCount,
            address[] memory wordContributors,
            string[] memory words
        )
    {
        require(id <= numStories);
        title = stories[id].title;
        body = stories[id].body;
        wordCount = stories[id].wordCount;

        words = new string[](wordCount);
        wordContributors = new address[](wordCount);
        for (uint256 i = 0; i < wordCount; i++) {
            wordContributors[i] = stories[id].wordContributors[i];
            words[i] = stories[id].words[i];
        }

        return (title, body, wordCount, wordContributors, words);
    }

    function newStory(string memory word) public payable {
        validateWord(word);
        require(
            msg.value == 0.1 ether,
            "You must provide 0.1 ether to create a new story"
        );
        Story storage storyToUpdate = stories[numStories];
        storyToUpdate.title = word;
        numStories += 1;

        storyToUpdate.wordContributors[storyToUpdate.wordCount] = msg.sender;
        storyToUpdate.words[storyToUpdate.wordCount] = word;
        storyToUpdate.wordCount += 1;
    }

    function addWordToTitle(uint256 storyID, string memory word)
        public
        payable
    {
        validateWord(word);
        require(
            msg.value == 0.02 ether,
            "You must provide 0.02 ether to add a word"
        );
        validateWord(word);
        Story storage storyToUpdate = stories[storyID];
        storyToUpdate.title = string(
            abi.encodePacked(storyToUpdate.title, " ", word)
        );

        storyToUpdate.wordContributors[storyToUpdate.wordCount] = msg.sender;
        storyToUpdate.words[storyToUpdate.wordCount] = word;
        storyToUpdate.wordCount += 1;
    }

    function deposit() public payable {}

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function ownerWithdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "ownerWithdraw failed");
    }

    function addWordToBody(uint256 storyID, string memory word)
        public
        payable
    {
        validateWord(word);
        require(
            msg.value == 0.01 ether,
            "You must provide 0.01 ether to add a word"
        );

        Story storage storyToUpdate = stories[storyID];

        if (bytes(storyToUpdate.body).length == 0) {
            storyToUpdate.body = word;
        } else {
            storyToUpdate.body = string(
                abi.encodePacked(storyToUpdate.body, " ", word)
            );
        }

        storyToUpdate.wordContributors[storyToUpdate.wordCount] = msg.sender;
        storyToUpdate.words[storyToUpdate.wordCount] = word;
        storyToUpdate.wordCount += 1;
    }

    function validateWord(string memory word) private pure {
        require(bytes(word).length > 0);
        require(bytes(word).length <= 42);
    }
}
