const {ethers} = require("hardhat")

 async function _listNFT(){
    const nftMarketplace = await ethers.getContract("NFTMarketplace");
    const nft = await ethers.getContract("ApeNFT");

    //approve marketplace
    console.log("approving...")
    const tokenID = 0;
    const txn = await nft.approve(nftMarketplace.address, tokenID);
    const txnResponse = txn.wait(1);
    console.log("listing...")


    const tx = await nftMarketplace.listItem(nft.address,tokenID,2);
    const txResponse = await tx.wait(1);
    console.log("successfully listed on Marketplace");
}

_listNFT().then(()=>{console.log("success")
        process.exit(1)
    }).catch((err)=>{console.log(err)})