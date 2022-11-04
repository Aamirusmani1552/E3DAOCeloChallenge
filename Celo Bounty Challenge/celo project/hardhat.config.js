require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
      alfajores:{
        url: process.env.RPC_URL,
        accounts: [process.env.PRIVATE_KEY]
      },
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: {
          alfajores:process.env.CELOSCAN_API_KEY
        },
    },
    solidity: {
        compilers: [{ version: "0.8.17" }],
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },

    mocha: {
        timeout: 200000,
    },
}
