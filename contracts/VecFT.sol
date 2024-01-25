// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract VecFT is ERC721URIStorage {
    uint256 private _tokenId;

    constructor() ERC721("VecFT", "VFT") {
        _tokenId = 0;
    }

    function safeMint(address to, string memory uri) public returns (uint256) {
        _safeMint(to, _tokenId);
        _setTokenURI(_tokenId, uri);

        return _tokenId++;
    }

    function transferNFT(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId);
    }
}
