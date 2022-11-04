import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useContext, useEffect } from "react";
import NFT from "../components/NFT";
import { activeContext } from "../context/context";
import GET_ACTIVE_ITEMS from "../components/graphSubquery";
import { useMoralis } from "react-moralis";
import Loader from "../components/Loader";
import UpdateModal from "../components/UpdateModal";

const Home: NextPage = () => {
  const { active, setActive, activeItems, setActiveItems, activeModal } =
    useContext(activeContext);

  const { loading, error, data: listedNFT } = useQuery(GET_ACTIVE_ITEMS);
  const { isWeb3Enabled, chainId } = useMoralis();


  useEffect(() => {
    console.log(listedNFT)
    listedNFT && setActiveItems(listedNFT?.activeItems);
  }, [listedNFT]);

  useEffect(() => {
    if (Router.route === "/") {
      if (active === "Sell") {
        setActive("Buy");
      }
    }
  }, []);

  return (
    <>
      <div className="p-2 flex-1 flex flex-col">
        <Head>
          <title>NFT Marketplace</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className=" flex-1 bg-[#EAEEF2] rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center md:justify-start pb-28 sm:pb-6 gap-2">
          {!isWeb3Enabled ? (
            <h1 className="font-semibold col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text w-full text-4xl text-[#48C0D4] text-center">
              Connect Wallet First.
            </h1>
          ) : !listedNFT ? (
            <Loader />
          ) : listedNFT?.activeItems.length === 0 ? (
            <h1 className="font-semibold col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text w-full text-4xl text-[#48C0D4] text-center">
              No NFT Listed currently
            </h1>
          ) : (
            listedNFT?.activeItems.map((item: any) => (
              <NFT
                price={item.price}
                nftAddress={item.nftAddress}
                seller={item.seller}
                buyer={item.buyer}
                id={item.tokenId}
                key={`${item.nftAddress}${item.tokenId}`}
              />
            ))
          )}
        </main>
      </div>
      {activeModal && <UpdateModal />}
    </>
  );
};

export default Home;
