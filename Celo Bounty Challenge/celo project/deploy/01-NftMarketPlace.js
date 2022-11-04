const {developementNetworks} = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../scripts/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = []
    log("----------------------------------------")

    const nftMarketplace = await deploy("NFTMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })

    log("----------------------------------------")
}

module.exports.tags = ["all", "NFTMarketplace"]
