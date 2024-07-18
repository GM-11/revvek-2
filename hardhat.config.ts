const { HardhatUserConfig } = require("hardhat/config");
const dotenv = require("dotenv");
dotenv.config();

require("@nomicfoundation/hardhat-toolbox");

const config: typeof HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/MvHvfT5YNsOuQ9qP6guB3qeiDbdpOjUc",
      chainId: 80002,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/MvHvfT5YNsOuQ9qP6guB3qeiDbdpOjUc",
      chainId: 11155111,
      accounts: [`${process.env.PRIVATE_KEY}`],
    }
  },
  paths: {
    artifacts: "./artifacts",
  },
};

module.exports = config;
