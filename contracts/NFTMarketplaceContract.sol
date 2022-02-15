// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NFTMarketplaceContract is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _listingIds;
    Counters.Counter private _listingsSold;
    Counters.Counter private _offerIds;
    Counters.Counter private _offerIdsDecided;

    uint256 listingCommission = 0.025 ether;
    address payable marketplaceOwner;

    constructor() {
        marketplaceOwner = payable(msg.sender);
    }

    enum ListingStatus {
        ACTIVE,
        SOLD,
        CANCELLED
    }
    enum OfferStatus {
        NOOFFER,
        PENDING,
        ACCEPTED,
        REJECTED,
        SIGNED
    }

    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 nftId;
        address payable seller;
        address payable owner;
        uint256 listingPrice;
        ListingStatus status;
        uint256[] offerIds;
        uint256 offerSize;
    }

    struct Offer {
        uint256 offerId;
        address nftContract;
        uint256 listingId;
        address payable bidder;
        uint256 bid;
        OfferStatus status;
        bool isDecided;
    }

    mapping(uint256 => Listing) private _idToListing;
    mapping(uint256 => Offer) private _idToOffer;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed nftId,
        address seller,
        address owner,
        uint256 listingPrice,
        ListingStatus status
    );

    event OfferCreated(
        uint256 indexed listingId,
        address indexed nftContract,
        address bidder,
        uint256 bid
    );

    event Sale(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed nftId,
        address buyer,
        uint256 price
    );

    event CancelListing(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed nftId,
        address seller
    );

    event OfferAdded(uint256 offerId, uint256 listingId, address bidder);
    event OfferDecided(
        uint256 indexed listingId,
        OfferStatus status,
        address indexed nftContract,
        uint256 indexed offerId,
        address bidder,
        uint256 bid
    );

    function getNumberOfListings() public view returns (uint256) {
        return _listingIds.current();
    }

    function getNumberOfActiveListings() public view returns (uint256) {
        return _listingIds.current() - _listingsSold.current();
    }

    function getNumberOfOffers() public view returns (uint256) {
        return _offerIds.current();
    }

    function getNumberOfSoldListings() public view returns (uint256) {
        return _listingsSold.current();
    }

    function getListingCommission() public view returns (uint256) {
        return listingCommission;
    }

    function getListing(uint256 listingId)
        public
        view
        returns (Listing[] memory)
    {
        uint256 currentIndex = 0;

        Listing[] memory listings = new Listing[](1);
        for (uint256 i = 0; i < 1; i++) {
            uint256 currentId = listingId;
            Listing storage currentListing = _idToListing[currentId];
            listings[currentIndex] = currentListing;
            currentIndex++;
        }
        return listings;
    }

    function getOwner() public view returns (address) {
        return marketplaceOwner;
    }

    // If the nft is owned by someone and they want to sell it again this function needs to be called
    function sellNFT(
        address nftContract,
        uint256 listingId,
        uint256 nftId,
        uint256 listingPrice
    ) public payable nonReentrant returns (uint256) {
        Listing storage temp_listing = _idToListing[listingId];
        require(listingPrice > 0, 'Price must be more than 0');
        require(
            msg.value == listingCommission,
            'Price to list must be equal to the listing commission'
        );
        require(
            msg.sender == temp_listing.owner,
            'It is not possible to sell a NFT not owned by sender'
        );

        temp_listing.owner = payable(address(0));
        temp_listing.seller = payable(address(0));
        temp_listing.listingId = 0;
        temp_listing.offerSize = 0;

        _listingIds.increment();
        uint256 id = _listingIds.current();
        Listing memory listing;
        listing.listingId = id;
        listing.nftContract = nftContract;
        listing.nftId = nftId;
        listing.seller = payable(msg.sender);
        listing.owner = payable(address(0));
        listing.status = ListingStatus.ACTIVE;
        listing.listingPrice = listingPrice;
        listing.offerSize = 0;
        _idToListing[id] = listing;

        IERC721(nftContract).transferFrom(msg.sender, address(this), nftId);
        payable(marketplaceOwner).transfer(listingCommission);

        emit ListingCreated(
            id,
            nftContract,
            nftId,
            msg.sender,
            address(0),
            listingPrice,
            ListingStatus.ACTIVE
        );

        return id;
    }

    // Creating a new listing from the form interface
    function createListing(
        address nftContract,
        uint256 nftId,
        uint256 listingPrice
    ) public payable nonReentrant returns (uint256) {
        require(listingPrice > 0, 'Price must be more than 0');
        require(
            msg.value == listingCommission,
            'Price to list must be equal to the listing commission'
        );
        _listingIds.increment();
        uint256 listingId = _listingIds.current();

        Listing memory listing;
        listing.listingId = listingId;
        listing.nftContract = nftContract;
        listing.nftId = nftId;
        listing.seller = payable(msg.sender);
        listing.owner = payable(address(0));
        listing.status = ListingStatus.ACTIVE;
        listing.listingPrice = listingPrice;
        listing.offerSize = 0;
        _idToListing[listingId] = listing;

        IERC721(nftContract).transferFrom(msg.sender, address(this), nftId);
        payable(marketplaceOwner).transfer(listingCommission);

        emit ListingCreated(
            listingId,
            nftContract,
            nftId,
            msg.sender,
            address(0),
            listingPrice,
            ListingStatus.ACTIVE
        );
        return listingId;
    }

    // Placing a bid on an nft
    function submitOffer(
        address nftContract,
        uint256 listingId,
        uint256 bid
    ) public payable returns (uint256) {
        require(bid > 0, 'Bid must be more than 0');
        require(
            msg.sender != _idToListing[listingId].seller,
            'It is not possible to bid on own listing'
        );
        // require that no sender can place multiple offers
        _offerIds.increment();
        Offer memory offer;
        offer.offerId = _offerIds.current();
        offer.nftContract = nftContract;
        offer.listingId = listingId;
        offer.bid = bid;
        offer.bidder = payable(msg.sender);
        offer.status = OfferStatus.PENDING;

        _idToOffer[offer.offerId] = offer;
        _idToListing[listingId].offerIds.push(offer.offerId);
        _idToListing[listingId].offerSize += 1;
        emit OfferAdded(offer.offerId, offer.listingId, offer.bidder);
        return offer.offerId;
    }

    // Deciding whether a bid should be accepted (1) or rejected (0)
    // If accepted, every other bids will be deleted from the listings offers list
    function decideOffer(
        address nftContract,
        uint256 listingId,
        uint256 offerId,
        uint256 descision
    ) public returns (uint256) {
        Listing storage listing = _idToListing[listingId];
        Offer storage offer = _idToOffer[offerId];

        require(
            msg.sender == listing.seller,
            'Only the sender can decide on an offer'
        );
        require(
            offer.listingId == listingId,
            'ListingId has to relate to bidded listing'
        );
        require(
            offer.status == OfferStatus.PENDING,
            'Offer needs to be defined'
        );
        require(
            listing.status == ListingStatus.ACTIVE,
            'Listing needs to be active'
        );

        if (descision == 0) {
            for (uint256 k = 0; k < listing.offerIds.length; k++) {
                uint256 Id = listing.offerIds[k];
                if (Id == offerId) {
                    _idToOffer[Id].status = OfferStatus.REJECTED;
                    _idToOffer[Id].isDecided = true;
                    delete listing.offerIds[k];
                    _offerIdsDecided.increment();
                    return offerId;
                }
            }
        } else {
            // delete offers
            for (uint256 k = 0; k < listing.offerIds.length; k++) {
                uint256 Id = listing.offerIds[k];
                _idToOffer[Id].isDecided = true;
                if (Id == offer.offerId) {
                    _idToOffer[Id].status = OfferStatus.ACCEPTED;
                    delete listing.offerIds[k];
                    _offerIdsDecided.increment();
                    emit OfferDecided(
                        listingId,
                        _idToOffer[Id].status,
                        nftContract,
                        offer.offerId,
                        offer.bidder,
                        offer.bid
                    );
                } else {
                    _idToOffer[Id].status = OfferStatus.REJECTED;
                    delete listing.offerIds[k];
                    _offerIdsDecided.increment();
                    emit OfferDecided(
                        listingId,
                        _idToOffer[Id].status,
                        nftContract,
                        offer.offerId,
                        offer.bidder,
                        offer.bid
                    );
                }
            }
        }
        return offerId;
    }

    // When a bid has been accepted, the bidder needs to sign the transfer of bid to the seller
    function signOffer(
        address nftContract,
        uint256 listingId,
        uint256 offerId
    ) public payable nonReentrant returns (uint256) {
        Listing storage listing = _idToListing[listingId];
        Offer storage offer = _idToOffer[offerId];

        uint256 bid = offer.bid;
        require(msg.value == bid, 'Submitted value needs to be equal to bid');
        require(
            msg.sender == offer.bidder,
            'Only the sender can decide on an offer'
        );
        require(
            offer.listingId == listingId,
            'ListingId has to relate to bidded listing'
        );
        require(
            offer.status == OfferStatus.ACCEPTED,
            'Offer needs to be defined'
        );
        require(
            listing.status == ListingStatus.ACTIVE,
            'Listing needs to be active'
        );
        offer.status = OfferStatus.SIGNED;
        delete offer.listingId;

        //createSale
        listing.seller.transfer(bid);
        listing.seller = payable(address(0));
        listing.owner = payable(msg.sender);
        listing.status = ListingStatus.SOLD;
        listing.offerSize = 0;
        IERC721(nftContract).transferFrom(
            address(this),
            msg.sender,
            listing.nftId
        );
        _listingsSold.increment();
        for (uint256 _index = 0; _index < listing.offerIds.length; _index++) {
            for (uint256 i = _index; i < listing.offerIds.length - 1; i++) {
                listing.offerIds[i] = listing.offerIds[i + 1];
            }
            listing.offerIds.pop();
        }
        return offerId;
    }

    // when a buyer purchases a nft without placing bid
    function makeSale(address nftContract, uint256 listingId)
        public
        payable
        nonReentrant
    {
        Listing storage listing = _idToListing[listingId];
        uint256 listingPrice = listing.listingPrice;
        uint256 nftId = listing.nftId;

        require(
            msg.sender != _idToListing[listingId].seller,
            'One cannot buy your own listing'
        );
        require(
            _idToListing[listingId].status == ListingStatus.ACTIVE,
            'Listing is not active'
        );
        require(
            msg.value == listingPrice,
            'Submitted value needs to be equal to listingPrice'
        );

        listing.seller.transfer(listingPrice);
        IERC721(nftContract).transferFrom(address(this), msg.sender, nftId);
        listing.seller = payable(address(0));
        listing.owner = payable(msg.sender);
        listing.status = ListingStatus.SOLD;
        listing.offerSize = 0;
        _listingsSold.increment();

        //payable(marketplaceOwner).transfer(listingCommission);
        for (uint256 _index = 0; _index < listing.offerIds.length; _index++) {
            for (uint256 i = _index; i < listing.offerIds.length - 1; i++) {
                listing.offerIds[i] = listing.offerIds[i + 1];
            }
            listing.offerIds.pop();
        }
        emit Sale(listingId, nftContract, nftId, msg.sender, listingPrice);
    }

    function cancelListing(address nftContract, uint256 listingId) public {
        address seller = _idToListing[listingId].seller;
        uint256 nftId = _idToListing[listingId].nftId;
        ListingStatus status = _idToListing[listingId].status;
        require(
            msg.sender == seller,
            'Only the seller of the NFT can cancel a listing'
        );
        require(status == ListingStatus.ACTIVE, 'Listing is not active');

        _idToListing[listingId].status = ListingStatus.CANCELLED;
        _listingsSold.increment();
        emit CancelListing(listingId, nftContract, nftId, seller);
    }

    function fetchListings() public view returns (Listing[] memory) {
        uint256 listingCount = _listingIds.current();
        uint256 unsoldListingsCount = _listingIds.current() -
            _listingsSold.current();
        uint256 currentIndex = 0;

        Listing[] memory listings = new Listing[](unsoldListingsCount);
        for (uint256 i = 0; i < listingCount; i++) {
            if (_idToListing[i + 1].status == ListingStatus.ACTIVE) {
                uint256 currentId = i + 1;
                Listing storage currentListing = _idToListing[currentId];
                listings[currentIndex] = currentListing;
                currentIndex++;
            }
        }
        return listings;
    }

    function fetchOwnedNFTs() public view returns (Listing[] memory) {
        uint256 total = _listingIds.current();
        uint256 currentIndex = 0;
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (_idToListing[i + 1].owner == msg.sender) {
                count++;
            }
        }

        Listing[] memory listings = new Listing[](count);
        for (uint256 i = 0; i < total; i++) {
            if (_idToListing[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                Listing storage currentListing = _idToListing[currentId];
                listings[currentIndex] = currentListing;
                currentIndex++;
            }
        }
        return listings;
    }

    function fetchCreatedListings() public view returns (Listing[] memory) {
        uint256 total = _listingIds.current();
        uint256 currentIndex = 0;
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (
                _idToListing[i + 1].seller == msg.sender &&
                _idToListing[i + 1].status != ListingStatus.SOLD
            ) {
                count++;
            }
        }

        Listing[] memory listings = new Listing[](count);
        for (uint256 i = 0; i < total; i++) {
            if (
                _idToListing[i + 1].seller == msg.sender &&
                _idToListing[i + 1].status != ListingStatus.SOLD
            ) {
                uint256 currentId = i + 1;
                Listing storage currentListing = _idToListing[currentId];
                listings[currentIndex] = currentListing;
                currentIndex++;
            }
        }
        return listings;
    }

    function fetchListingOffers(uint256 listingId)
        public
        view
        returns (Offer[] memory)
    {
        uint256 currentIndex = 0;
        Listing memory listing = _idToListing[listingId];
        uint256 total = listing.offerSize;

        Offer[] memory offers = new Offer[](total);
        for (uint256 i = 0; i <= total; i++) {
            Offer storage currentOffer = _idToOffer[i + 1];
            if (
                !isEmpty(_idToOffer[i + 1].nftContract) &&
                _idToOffer[i + 1].listingId == listingId
            ) {
                offers[currentIndex] = currentOffer;
                currentIndex++;
            }
        }
        return offers;
    }

    function fetchPendingListingOffers(uint256 listingId)
        public
        view
        returns (Offer[] memory)
    {
        Listing memory listing = _idToListing[listingId];
        uint256 currentIndex = 0;
        uint256 total = listing.offerSize;
        Offer[] memory offers = new Offer[](total);
        uint256[] memory offerIds = listing.offerIds;

        if (total == 0) {
            return offers;
        }
        for (uint256 i = 0; i <= total; i++) {
            uint256 currentId = i + 1;
            Offer storage currentOffer = _idToOffer[currentId];
            if (contains(offerIds, currentOffer.offerId)) {
                offers[currentIndex] = currentOffer;
                currentIndex++;
            }
        }
        return offers;
    }

    function fetchMyBids() public view returns (Offer[] memory) {
        uint256 total = _offerIds.current();
        uint256 currentIndex = 0;
        uint256 count = 0;

        for (uint256 i = 0; i < total; i++) {
            if (
                _idToOffer[i + 1].bidder == msg.sender &&
                _idToListing[_idToOffer[i + 1].listingId].offerSize != 0
            ) {
                count++;
            }
        }
        Offer[] memory offers = new Offer[](count);
        for (uint256 i = 0; i < total; i++) {
            if (
                _idToOffer[i + 1].bidder == msg.sender &&
                _idToListing[_idToOffer[i + 1].listingId].offerSize != 0
            ) {
                uint256 currentId = i + 1;
                Offer storage currentOffer = _idToOffer[currentId];
                offers[currentIndex] = currentOffer;
                currentIndex++;
            }
        }
        return offers;
    }

    function contains(uint256[] memory ids, uint256 _id)
        public
        pure
        returns (bool)
    {
        bool result = false;
        for (uint256 i = 0; i < ids.length; i++) {
            if (_id == ids[i]) {
                result = true;
                return result;
            }
        }
        return result;
    }

    function isEmpty(address addr) public pure returns (bool) {
        if (addr == address(0)) {
            return true;
        }
        return false;
    }
}
