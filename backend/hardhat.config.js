require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config()
const ALCHEMY = process.env.ALCHEMY || "";
const PK = process.env.PK || "";
const ETHERSCAN = process.env.ETHERSCAN || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: ALCHEMY,
      accounts: [`0x${PK}`],
      chainId: 11155111
    },
    hardhat: {
      blockGasLimit: 3000000
    }
  },
  etherscan: {
    apiKey: ETHERSCAN
  },
};