const { developementChains, networkConfig } = require("./helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

// rinkeby: 0xa68b71C378C75e7B7f663BeB82Bdf8b060211193
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = []
    log("----------------------------------------")

    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })

    if (!developementChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, args)
    }
    log("----------------------------------------")
}

module.exports.tags = ["all", "basicNft"]
