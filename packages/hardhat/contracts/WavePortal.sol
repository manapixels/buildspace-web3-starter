// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private seed;

    uint256 totalWaves;
    mapping(address => uint256) public totalWavesByAddress;
    mapping(address => uint256) public lastWavedAt;
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }
    Wave[] waves;

    event NewWave(address indexed from, string message, uint timeStamp);

    /*
    * Constructor
    */
    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {

        /*
         * Make sure the current timestamp is at least 15 min bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 1 minutes < block.timestamp,
            "Wait 1m"
        );

        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        totalWavesByAddress[msg.sender] += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: ", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, _message, block.timestamp);
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Total waves: %d", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getWavesByAddress() public view returns (uint256) {
        console.log(
            "Total waves by %s: %d",
            msg.sender,
            totalWavesByAddress[msg.sender]
        );
        return totalWavesByAddress[msg.sender];
    }
}
