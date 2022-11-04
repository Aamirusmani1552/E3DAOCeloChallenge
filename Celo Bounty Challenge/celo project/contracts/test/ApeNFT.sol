//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ApeNFT is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://QmWfidESYC6iJNQYVfUR37hoBP7Nx8UpXqbAsB1Bbutb2q";
    uint256 private s_counter;

    constructor() ERC721("ApeNFT", "APE") {
        s_counter = 0;
    }

    function mintNFT() public returns (uint256) {
        _safeMint(msg.sender, s_counter);
        s_counter = s_counter + 1;
        return s_counter;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_counter;
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override
        returns (string memory)
    {
        return TOKEN_URI;
    }
}
