import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { ConnectButton } from "web3uikit";
import { activeContext } from "../context/context";
import logo from "../public/flc_design2022071955938.png";
import { MdSell } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const { active, setActive } = useContext(activeContext);
  const acitveStyles =
    "px-6 py-2 bg-[#181E31] text-[#ffffff] flex gap-1 items-center justify-center rounded-full";
  const normalStyles =
    "px-6 py-2 bg-[#F0F4F7] flex gap-1 items-center justify-center rounded-full text-[#5B6062]";

  const activeStylesBottom =
    "px-6 py-3 bg-[#181E31] text-[#ffffff] flex-1 text-lg flex gap-1 items-center justify-center rounded-full";
  const normalStylesBottom =
    "px-6 py-3 bg-[#F0F4F7] flex gap-1 items-center text-lg  flex-1 justify-center rounded-full text-[#5B6062]";

  return (
    <>
      <div className="flex max-w-screen min-w-screen z-10 items-center justify-between px-5 py-2 sticky bg-[#fff] top-0">
        <div>
          <Link href={"/"}>
            <Image
              src={logo}
              height={"60%"}
              width={"100%"}
              className="cursor-pointer"
              onClick={() => setActive("Buy")}
            />
          </Link>
        </div>
        <div className=" hidden sm:relative sm:flex items-center justify-between gap-3">
          <Link href={"/"}>
            <button
              className={active === "Buy" ? acitveStyles : normalStyles}
              onClick={() => setActive("Buy")}
            >
              <FaShoppingCart />
              Buy
            </button>
          </Link>
          <Link href={"/sellNFT"}>
            <button
              className={active === "Sell" ? acitveStyles : normalStyles}
              onClick={() => setActive("Sell")}
            >
              <MdSell />
              Sell
            </button>
          </Link>
        </div>
        <ConnectButton />
      </div>
      <div className="flex sm:hidden px-2 py-2 fixed w-full bottom-0 bg-white z-10 items-center gap-2">
        <Link href={"/"}>
          <button
            className={
              active === "Buy" ? activeStylesBottom : normalStylesBottom
            }
            onClick={() => setActive("Buy")}
          >
            <FaShoppingCart />
            Buy
          </button>
        </Link>
        <Link href={"/sellNFT"}>
          <button
            className={
              active === "Sell" ? activeStylesBottom : normalStylesBottom
            }
            onClick={() => setActive("Sell")}
          >
            <MdSell />
            Sell
          </button>
        </Link>
      </div>
    </>
  );
};

export default Header;
