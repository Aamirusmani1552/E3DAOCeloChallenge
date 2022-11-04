import React, { useContext, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { activeContext } from "../context/context";
import nftMarketplaceAbi from "../constants/abi.json";
import nftMarketplaceAddress from "../constants/address.js";
import toast from "react-hot-toast";

const UpdateModal = () => {
  const { setActiveModal, activeModal, itemToUpdate } =
    useContext(activeContext);
  const [newPrice, setNewPrice] = useState("");
  const { isWeb3Enabled } = useMoralis();
  const ethInWei = "1000000000000000000";

  const { runContractFunction: updateListingItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: nftMarketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: itemToUpdate.nftAddress,
      tokenId: itemToUpdate.id,
      newPrice: (Number(newPrice) * Number(ethInWei)).toString(),
    },
  });

  async function handleUpdateClick(e) {
    e.preventDefault();
    if (!isWeb3Enabled) {
      alert("please connect to wallet");
    }

    await updateListingItem({
      onError: (err) => {
        console.log(err);
        toast.error("An Error occured", {
          style: {
            backgroundColor: "#E84D6104",
            color: "white",
            padding: "20px 35px",
          },
          duration: 4000,
          icon: "⚠",
        });
      },
      onSuccess: () => {
        toast.success("Item updated \nReferesh once confirmed", {
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

    setActiveModal(false);
  }

  return (
    <div className="w-screen h-screen bg-[#7d7a7ad3] fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center cursor-pointer">
      <div className="p-3 bg-white min-h-[200px] w-fit md:w-[50%] rounded-lg flex items-center justify-center z-50">
        <form
          className="flex flex-col items-center justify-center gap-8 text-left px-5 py-2 w-full "
          onSubmit={handleUpdateClick}
        >
          <div className="flex flex-col w-full gap-3">
            <label className="w-full text-2xl text-gray-400">
              Enter New Price
            </label>
            <input
              placeholder="Price in Eth"
              type={"text"}
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border-none bg-[#d8d5d5] rounded-md px-4 py-2 text-xl outline-none w-full"
            />
          </div>
          <div className="flex w-full self-start justify-between">
            <button
              className=" flex gap-[1px] items-center justify-center bg-[#fff] border-2 px-8 py-3 font-semibold text-sm text-gray-600 rounded-full hover:bg-[#181E31] hover:text-white active:ring-2 active:ring-gray-300 hover:border-white"
              onClick={(e) => {
                e.preventDefault();
                setActiveModal(false);
              }}
            >
              Cancle
            </button>
            <button
              className=" active:ring-4 ring-[#48c8d452] bg-[#48C0D4] px-8 py-3 font-semibold text-sm text-white rounded-full"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
