import { gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      seller
      buyer
      nftAddress
      price
      tokenId
    }
  }
`;

export default GET_ACTIVE_ITEMS;
