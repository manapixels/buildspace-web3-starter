require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('@nomiclabs/hardhat-waffle');

 module.exports = {
   solidity: '0.8.4',
   networks: {
     kovan: {
       url: 'https://eth-kovan.alchemyapi.io/v2/L-g62EzDgTom85TK1GzMcu0R0lMwctQm',
       accounts: [process.env.PRIVATE_KEY],
     },
   },
 };
