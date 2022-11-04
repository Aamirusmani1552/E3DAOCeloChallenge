import React from "react";

const Loader = () => {
  return (
    <div className="w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center flex-col gap-1">
      <div className="w-12 h-12 border-[10px] border-b-[#48C0D4] border-t-[#48C0D4] border-l-[#EAEEF2] animate-spin border-r-[#EAEEF2] rounded-full border-black"></div>
      <div className="animate-pulse text-[#48c0d4] font-semibold text-xl">
        Loading
      </div>
    </div>
  );
};

export default Loader;
