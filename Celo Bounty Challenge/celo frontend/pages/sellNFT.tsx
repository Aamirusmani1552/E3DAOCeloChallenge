import Head from "next/head";
import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { activeContext } from "../context/context";
import NFTMarketplaceAbi from "../constants/abi.json";
import marketPlaceAddress from "../constants/address.js";
import Notification from "../components/Notification";
import nftAbi from "../constants/BasicNft.json";
import toast from "react-hot-toast";
import Moralis from "moralis";

const Sell = () => {
  const { formData, setFormData, setActive, active } =
    useContext(activeContext);
  const [proceeds, setProceeds] = useState("");
  const { isWeb3Enabled, account } = useMoralis();

  const ethInWei = 1000000000000000000;

  const { runContractFunction: listItemClick } = useWeb3Contract({
    abi: NFTMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "listItem",
    params: {
      nftAddress: formData.address,
      tokenId: Number(formData.tokenId),
      price: (Number(formData.price) * ethInWei).toString(),
    },
  });

  const { runContractFunction: approveMarketplace } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: formData.address,
    functionName: "approve",
    params: {
      to: marketPlaceAddress,
      tokenId: formData.tokenId,
    },
  });

  const { runContractFunction: withdrawSaleProceeds } = useWeb3Contract({
    abi: NFTMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "withdrawProceeds",
  });

  const { runContractFunction: getSaleProceeds } = useWeb3Contract({
    abi: NFTMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "getProceeds",
    params: {
      seller: account,
    },
  });

  useEffect(() => {
    if (Router.route === "/sellNFT") {
      if (active === "Buy") {
        setActive("Sell");
      }
    }
  }, []);

  async function getSaleProceedsWithSeller() {
    const amount: any = await getSaleProceeds();
    setProceeds(Moralis.Units.FromWei(amount.toString()));
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      getSaleProceedsWithSeller();
    }
  }, [isWeb3Enabled]);

  async function handleListClick(e: any) {
    e.preventDefault();
    if (!isWeb3Enabled) {
      alert("Please connect wallet first");
    }

    await approveMarketplace({
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
      onSuccess: () => console.log("approved form marketplace"),
    });

    await listItemClick({
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
        toast.success("Item Listed! \nReferesh once confirmed", {
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

  function handleSellCancleClick(e: any) {
    e.preventDefault();
    if (!isWeb3Enabled) {
      alert("Please connect wallet first");
    }

    setFormData({
      address: "",
      price: "",
      tokenId: "",
    });
  }

  function handleWithdrawClick(e: any) {
    if (!isWeb3Enabled) {
      alert("Please connect wallet first");
    }

    if (proceeds === "0") {
      toast("Sorry You don't have balance", {
        style: {
          backgroundColor: "#fff",
          color: "gray",
          padding: "20px 35px",
        },
        duration: 4000,
        icon: "⚠",
      });
      return;
    }

    withdrawSaleProceeds({
      onError: (err) => {
        toast.error("An Error occured", {
          style: {
            backgroundColor: "#E84D61",
            color: "white",
            padding: "20px 35px",
          },
          duration: 4000,
          icon: "⚠",
        });
        console.log("an error occured", err);
      },
      onSuccess: () => {
        toast.success("Withdraw Successfull! \nReferesh once confirmed", {
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
    <div className="flex p-2 flex-1">
      <Head>
        <title>NFT Marketplace-sell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-1 w-full bg-[#EAEEF2] rounded-lg p-6 flex flex-wrap gap-4 items-center justify-center pb-28 sm:pb-6 ">
        <div className="p-1 bg-white w-full md:w-[50%] rounded-lg">
          <form className="bg-[#27303F] w-full p-6 flex gap-4 flex-col rounded-lg">
            <h1 className="text-white text-center text-3xl capitalize">
              Enter NFT Details
            </h1>
            <label>
              <input
                type={"text"}
                value={formData.address}
                name="address"
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                className={
                  "bg-[#6d7681] border-none outline-none text-white text-2xl px-2 py-2 w-full border-2 border-[#6d7681] active:border-2 active:border-white"
                }
                placeholder={"Enter Address of Contract here"}
              />
            </label>
            <label>
              <input
                type={"number"}
                value={formData.tokenId}
                name="tokenId"
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                className={
                  "bg-[#6d7681] border-none outline-none text-white text-2xl px-2 py-2 w-full border-2 border-[#6d7681] active:border-2 active:border-white"
                }
                placeholder={"Enter Token Id"}
              />
            </label>
            <label>
              <input
                type={"number"}
                value={formData.price}
                name="price"
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                className={
                  "bg-[#6d7681] border-none outline-none text-white text-2xl px-2 py-2 w-full border-2 border-[#6d7681] active:border-2 active:border-white"
                }
                placeholder={"Enter Price in ETH"}
              />
            </label>
            <div className="w-full flex gap-3">
              <button
                className="flex-1 bg-[#fff] border-2 px-5 py-3 font-semibold text-sm text-gray-600 rounded-lg"
                onClick={handleSellCancleClick}
              >
                Cancle
              </button>
              <button
                className="flex-1 bg-[#48C0D4] px-5 py-3 font-semibold text-sm text-white rounded-lg "
                onClick={handleListClick}
              >
                List NFT
              </button>
            </div>
          </form>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="text-xl sm:text-2xl flex w-full sm:w-fit sm:gap-4 justify-between items-center">
            <span className="capitalize">Your sale proceeds: </span>
            <span className="font-semibold">{Number(proceeds).toFixed(2)}</span>
          </div>
          <div>
            <button
              className="flex-1 bg-[#48C0D4] px-5 py-3 font-semibold text-sm text-white rounded-lg"
              onClick={handleWithdrawClick}
            >
              Withdraw
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sell;
