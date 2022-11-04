import React, { useContext } from "react";
import { FaBell } from "react-icons/fa";
import { activeContext } from "../context/context";

const Notification = () => {
  const { Description, activeNotification, setActiveNotification } =
    useContext(activeContext);

  const activeNotificationStyles =
    " px-12 py-3 shadow-lg text-lg font-semibold  flex items-center justify-center flex-col rounded-lg bg-[#fff] absolute right-5  transition-all duration-200 top-24 cursor-pointer max-w-[300px]";

  const nonActiveNotificationStyles =
    " px-12 py-3 shadow-lg text-lg font-semibold  flex items-center justify-center flex-col rounded-lg bg-[#fff] absolute right-5  transition-all duration-200 top-[-100%] cursor-pointer max-w-[300px]";

  return (
    <div
      className={
        activeNotification
          ? activeNotificationStyles
          : nonActiveNotificationStyles
      }
    >
      <div className="flex items-center justify-center gap-3 text-[#48C0D4]">
        <FaBell />
        <div>{Description.main}</div>
      </div>
      <div className="text-xs text-center text-[#DDC25F] w-full capitalize">
        {Description.secondary}
      </div>
    </div>
  );
};

export default Notification;
