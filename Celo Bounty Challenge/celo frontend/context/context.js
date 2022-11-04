import { createContext, useState } from "react";
import React, { useContext, useEffect } from "react";
import { useMoralisWeb3Api } from "react-moralis";
import Moralis from "moralis";

export const activeContext = createContext();

const ActiveContext = ({ children }) => {
  const [active, setActive] = useState("Buy");
  const [activeItems, setActiveItems] = useState([]);
  const [usdPrice, setUsdPrice] = useState(0);
  const [Description, setDescription] = useState({
    main: "",
    secondary: "",
  });
  const [activeNotification, setActiveNotification] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState({});

  const [formData, setFormData] = useState({
    address: "",
    price: "",
    tokenId: "",
  });
  return (
    <activeContext.Provider
      value={{
        active,
        setActive,
        formData,
        setFormData,
        activeItems,
        setActiveItems,
        usdPrice,
        setUsdPrice,
        Description,
        setDescription,
        activeNotification,
        setActiveNotification,
        activeModal,
        setActiveModal,
        itemToUpdate,
        setItemToUpdate,
      }}
    >
      {children}
    </activeContext.Provider>
  );
};

export default ActiveContext;
