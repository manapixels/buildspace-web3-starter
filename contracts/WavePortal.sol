// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint totalWaves;
    mapping(address => uint) totalWavesByAddress;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function wave() public {
        totalWaves += 1;
        totalWavesByAddress[msg.sender] += 1;
        console.log('%s has waved!', msg.sender);
    }

    function getTotalWaves() public view returns (uint) {
        console.log('Total waves: %d', totalWaves);
        return totalWaves;
    }

    function getWavesByAddress() public view returns (uint) {
        console.log('Total waves by %s: %d', msg.sender, totalWavesByAddress[msg.sender]);
        return totalWavesByAddress[msg.sender];
    }
}