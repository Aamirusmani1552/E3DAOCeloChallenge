const {
    contractAbiFile,
    contractAddressFile,
    nftAddressFile,
} = require("../helper-hardhat-config")
const fs = require("fs")
const { network, ethers } = require("hardhat")
const chianId = network.config.chainId

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end...")
        await updateContractFile(contractAddressFile)
        await updateAbiFile(contractAbiFile)
    }
}

async function updateContractFile(contractAddressFile) {
    const nftmarketplace = await ethers.getContract("NFTMarketplace")
    const addressFile = JSON.parse(fs.readFileSync(contractAddressFile, "utf-8"))
    if (chianId in addressFile) {
        if (!addressFile[chianId]["NFTMarketplace"].includes(nftmarketplace.address)) {
            addressFile[chianId]["NFTMarketplace"].push(nftmarketplace.address)
        }
    } else {
        addressFile[chianId] = { NFTMarketplace: [nftmarketplace.address] }
    }

    fs.writeFileSync(contractAddressFile, JSON.stringify(addressFile))
}

async function updateAbiFile(abifile) {
    const nftmarketplace = await ethers.getContract("NFTMarketplace")

    fs.writeFileSync(
        contractAbiFile,
        nftmarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(nftAddressFile, basicNft.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
