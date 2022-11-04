import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { FiArrowUpRight, FiMoreVertical } from "react-icons/fi";
import { activeContext } from "../context/context";
import { useMoralis, useWeb3Contract } from "react-moralis";
import BasicNFTAbi from "../constants/BasicNft.json";
import Link from "next/link";
import NFTMarketplaceAbi from "../constants/abi.json";
import marketPlaceAddresses from "../constants/address.json";
import toast from "react-hot-toast";
import axios from "axios"
import Moralis from "moralis";

const NFT = ({ price, nftAddress, seller, buyer, id }) => {
  const { usdPrice, setUsdPrice, setActiveModal, setItemToUpdate } =
    useContext(activeContext);
  const [nftMetaData, setNftMetaData] = useState({});
  const [nftImage, setNftImage] = useState("");
  const { isWeb3Enabled, account, chainId } = useMoralis();
  let ethUsdPriceSync;
  const originalChainId = Number(chainId).toString()
  const marketPlaceAddress =
    marketPlaceAddresses[originalChainId]["NFTMarketplace"][
      marketPlaceAddresses[originalChainId]["NFTMarketplace"].length - 1
    ];

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNFTAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: id,
    },
  });

  const { runContractFunction: buyItemClick } = useWeb3Contract({
    abi: NFTMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: id,
    },
  });

  const { runContractFunction: cancleItemClick } = useWeb3Contract({
    abi: NFTMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "cancleListing",
    params: {
      nftAddress: nftAddress,
      tokenId: id,
    },
  });

  async function updateUI() {
    const tokenURI = await getTokenURI();

    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const URIResponse = await axios.get(requestURL)
      const URIData = URIResponse.data

      URIData.image = URIData.image.replace("ipfs://", "http://ipfs.io/ipfs/");
      setNftMetaData(URIData);
      setNftImage(URIData.image);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);


  function handleClick() {
    if (seller === account) {
      toast("You own the NFT", {
        icon: "🔔",
        style: {
          color: "#48c0d4",
          border: "2px solid #48C0D4",
          padding: "20px 35px",
        },
        duration: 4000,
      });
      return;
    }
    buyItemClick({
      onError: (err) => {
        toast.error("An Error occured", {
          style: {
            backgroundColor: "#E84D6104",
            color: "white",
            padding: "20px 35px",
          },
          duration: 4000,
          icon: "⚠",
        });
        console.log(err);
      },
      onSuccess: () => {
        toast.success("Item Bought! \nReferesh once confirmed", {
          icon: "🎉",
          style: {
            backgroundColor: "#48c0d4",
            border: "1px solid #48c0d4",
            color: "white",
            padding: "20px 35px",
          },
          duration: 4000,
        });
      },
    });
  }

  async function hancleCancleClick() {
    await cancleItemClick({
      onError: (err) => {
        toast.error("An Error occured", {
          style: {
            backgroundColor: "#E84D6104",
            color: "white",
            padding: "20px 35px",
          },
          duration: 4000,
          icon: "⚠",
        });
        console.log(err);
      },
      onSuccess: () => {
        toast.success("Item Removed! \nReferesh once confirmed", {
          icon: "🎉",
          style: {
            backgroundColor: "#48c0d4",
            border: "1px solid #48c0d4",
            color: "white",
            padding: "20px 35px",
          },
          duration: 4000,
        });
      },
    });
  }

  return (
    <div className="  w-full p-1 rounded-3xl bg-[#fff] cursor-pointer h-fit group">
      <div className="h-[250px] w-full relative rounded-3xl overflow-hidden">
        {nftImage.length > 0 && (
          <Image
            src={nftImage}
            layout="fill"
            className="object-contain group-hover:scale-[110%] ease-in-out duration-100"
          />
        )}
        <div className=" absolute top-3 right-3 shadow-lg rounded-full  font-bold flex items-center justify-center bg-[#fff] text-[#48C0D4] px-2 py-1 select-none">
          {`#${id}`}
        </div>
        {seller === account && (
          <button
            onClick={() => {
              setItemToUpdate({ price, nftAddress, seller, buyer, id });
              setActiveModal(true);
            }}
            className="absolute top-3 left-3 shadow-lg rounded-full  font-bold flex items-center justify-center bg-[#48C0D4] text-[#fff] w-8 h-8 text-xl border-2 border-white active:border-[#43c1d4b5]"
          >
            <FiMoreVertical />
          </button>
        )}
      </div>

      <div className="p-2">
        <div className="font-bold text-md">
          {nftMetaData &&
            nftMetaData.name &&
            (nftMetaData.name.includes("#")
              ? nftMetaData.description
              : nftMetaData.name)}
        </div>
        <p className="text-[#c7b55a] text-right text-sm w-full">
          Owned by{" "}
          {seller === account
            ? "you"
            : seller.slice(0, 5) + "..." + seller.slice(-5)}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Price:{" "}
            <span className="text-black">
              {" "}
              {Moralis.Units.FromWei(price.toString())} ETH
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 flex items-center justify-between gap-2">
        {seller !== account ? (
          <Link href={`https://explorer.celo.org/alfajores/address/${nftAddress}`}>
            <button className="flex-1 flex gap-[1px] items-center justify-center bg-[#fff] border-2 px-5 py-3 font-semibold text-sm text-gray-600 rounded-full hover:bg-[#181E31] hover:text-white active:ring-2 active:ring-gray-300 hover:border-white">
              Etherscan
              <FiArrowUpRight />
            </button>
          </Link>
        ) : (
          <button
            className="flex-1 flex gap-[1px] items-center justify-center bg-[#fff] border-2 px-5 py-3 font-semibold text-sm text-gray-600 rounded-full hover:bg-[#181E31] hover:text-white active:ring-2 active:ring-gray-300 hover:border-white"
            onClick={hancleCancleClick}
          >
            Cancle
          </button>
        )}
        <button
          type="submit"
          className="flex-1 active:ring-4 ring-[#48c8d452] bg-[#48C0D4] px-5 py-3 font-semibold text-sm text-white rounded-full"
          onClick={handleClick}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default NFT;
