const {ethers} = require("hardhat")
 async function _mintNFT(){
    const nft = await ethers.getContract("ApeNFT");
    console.log("minting...")
    const tx = await nft.mintNFT();
    const txResponse = await tx.wait(1);
    console.log("successfully minted");
}

_mintNFT().then(()=>{console.log("success")
        process.exit(1)
    }).catch((err)=>{console.log(err)})