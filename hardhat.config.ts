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
    polygon_zk_test: {
      url: "https://rpc.public.zkevm-test.net	",
      chainId: 1442,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/MvHvfT5YNsOuQ9qP6guB3qeiDbdpOjUc",
      chainId: 80001,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
};

module.exports = config;
