//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NFTMarketplace__priceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);
error NFTMarketplace__notOwner();
error NFTMarketplace__alreadyListed(address nftAddress, uint256 tokenId);
error NFTMarketplace__notApprovedForMarketplace(
    address nftAddress,
    uint256 tokenId,
    address seller
);
error NFTMarketplace__notListed(address nftAddress, uint256 tokenId);
error NFTMarketplace__noProceedsForOwner(address requester);
error NFTMarketplace__transferFailed();

contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
    }

    constructor() {}

    event ItemListed(
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 indexed price,
        address seller
    );
    event ItemUpdated(
        address indexed nftAddress,
        uint256 indexed newPrice,
        uint256 indexed tokenId,
        address seller
    );
    event ItemRemoved(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller
    );
    event ItemBought(
        address indexed seller,
        address indexed buyer,
        uint256 tokenId,
        uint256 indexed price,
        address nftAddress
    );

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (owner != spender) {
            revert NFTMarketplace__notOwner();
        }
        _;
    }

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NFTMarketplace__alreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NFTMarketplace__notListed(nftAddress, tokenId);
        }
        _;
    }

    /*
     * @notice method for listing the nft to marketplace
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        notListed(nftAddress, tokenId)
    {
        if (price <= 0) {
            revert NFTMarketplace__priceNotMet(nftAddress, tokenId, price);
        }

        IERC721 nft = IERC721(nftAddress);

        if (nft.getApproved(tokenId) != address(this)) {
            revert NFTMarketplace__notApprovedForMarketplace(
                nftAddress,
                tokenId,
                msg.sender
            );
        }

        s_listings[nftAddress][tokenId] = Listing(msg.sender, price);

        emit ItemListed(nftAddress, tokenId, price, msg.sender);
    }

    /*
     * @notice Method for updating the listing of an nft
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        if (newPrice <= 0) {
            revert NFTMarketplace__priceNotMet(nftAddress, tokenId, newPrice);
        }
        s_listings[nftAddress][tokenId].price = newPrice;

        emit ItemUpdated(nftAddress, newPrice, tokenId, msg.sender);
    }

    /*
     * @notice Method to cancel the nft listing
     */
    function cancleListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemRemoved(nftAddress, tokenId, msg.sender);
    }

    /*
     * @notice Method for buying an nft
     */
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > msg.value) {
            revert NFTMarketplace__priceNotMet(
                nftAddress,
                tokenId,
                listing.price
            );
        }

        s_proceeds[msg.sender] = s_proceeds[msg.sender] + msg.value;

        delete (s_listings[nftAddress][tokenId]);

        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );

        emit ItemBought(
            listing.seller,
            msg.sender,
            tokenId,
            msg.value,
            nftAddress
        );
    }

    /*
     * @notice Method for withdrawing proceeds from sales
     */
    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];

        if (proceeds <= 0) {
            revert NFTMarketplace__noProceedsForOwner(msg.sender);
        }

        s_proceeds[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: proceeds}("");
        if (!success) {
            revert NFTMarketplace__transferFailed();
        }
    }

    // getter functions

    function getListing(address nftAddress, uint256 tokenId)
        public
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) public view returns (uint256) {
        return s_proceeds[seller];
    }
}

// Thing we need to do for our contract
// 1. list an nft with address and tokenId and price -- completed
// 2. should be able to update the listing -- completed
// 3. should be able to cancle the listing -- completed
// 4. should hold the proceeds and let the owner withdraw them when they want to. -- completed
// 5. other people should be able to buy the nft listed --completed
