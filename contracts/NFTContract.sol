// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NFTContract is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721('Knip Tokens', 'NHKT') {
        contractAddress = marketplaceAddress;
    }

    function createNFT(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 nftId = _tokenIds.current();
        _mint(msg.sender, nftId);
        _setTokenURI(nftId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return nftId;
    }
}
