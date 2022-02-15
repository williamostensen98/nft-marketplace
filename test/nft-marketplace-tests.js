const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFT Marketplace Tests', async function () {
    let marketAddress
    let marketplace
    let nft
    let nftContractAddress
    let owner
    let buyer1
    let buyer2
    let seller
    let listingCommission

    before(async function () {
        // Getting the signers
        ;[owner, seller, buyer1, buyer2] = await ethers.getSigners()
    })
    beforeEach(async function () {
        // Getting the market contract and deploying
        const NFTMarketPlace = await ethers.getContractFactory(
            'NFTMarketplaceContract'
        )
        marketplace = await NFTMarketPlace.deploy()
        marketAddress = marketplace.address

        // Getting the nft contract and deploying
        const NFTContract = await ethers.getContractFactory('NFTContract')
        nft = await NFTContract.deploy(marketAddress)
        nftContractAddress = nft.address

        // Get the commission for listing nfts
        listingCommission = await marketplace.getListingCommission()
        listingCommission = listingCommission.toString()

        // Create a NFT listing before each test
        let price = ethers.utils.parseUnits('1', 'ether')
        await nft
            .connect(seller)
            .createNFT(
                'https://www.outpump.com/wp-content/uploads/2021/03/beeple.jpg'
            )
        await marketplace
            .connect(seller)
            .createListing(nftContractAddress, 1, price, {
                value: listingCommission,
            })
    })

    describe('Testing Create NFT', async function () {
        it('Should successfully create additional NFT', async function () {
            let nftPrice = ethers.utils.parseUnits('0.1', 'ether')
            await nft
                .connect(seller)
                .createNFT(
                    'https://www.outpump.com/wp-content/uploads/2021/03/beeple.jpg'
                )
            listingId = await marketplace
                .connect(seller)
                .createListing(nftContractAddress, 2, nftPrice, {
                    value: listingCommission,
                })
            expect(await marketplace.getNumberOfListings()).to.equal(2)
        })
    })

    describe('Testing buying NFT', async function () {
        it('Should reject too low price', async function () {
            let lowPrice = ethers.utils.parseUnits('0.1', 'ether')
            //buyer makes sell offer on nft number 1 which is to low
            await expect(
                marketplace
                    .connect(buyer1)
                    .makeSale(nftContractAddress, 1, { value: lowPrice })
            ).to.be.revertedWith(
                'Submitted value needs to be equal to listingPrice'
            )
        })

        it('Should accept correct price', async function () {
            let correctPrice = ethers.utils.parseUnits('1', 'ether')
            //buyer makes sell offer on nft number 1 which is to low
            await marketplace
                .connect(buyer1)
                .makeSale(nftContractAddress, 1, { value: correctPrice })
            expect(await marketplace.getNumberOfSoldListings()).to.equal(1)
        })

        it('Should have owner equal to buyer', async function () {
            let correctPrice = ethers.utils.parseUnits('1', 'ether')
            await marketplace
                .connect(buyer1)
                .makeSale(nftContractAddress, 1, { value: correctPrice })
            // fetch the buyers owned listings and print them to console
            let owned = await marketplace.connect(buyer1).fetchOwnedNFTs()
            expect(owned[0].owner).to.equal(buyer1.address)
        })
        it('Should return 0 active listings after sale', async function () {
            let correctPrice = ethers.utils.parseUnits('1', 'ether')
            await marketplace
                .connect(buyer1)
                .makeSale(nftContractAddress, 1, { value: correctPrice })
            expect(await marketplace.getNumberOfActiveListings()).to.equal(0)
        })
    })

    describe('Testing cancelling a Listing', async function () {
        it('Should cancel listing and return 0 active listing', async function () {
            listings = await marketplace.fetchListings()
            listing = listings[0]
            await marketplace
                .connect(seller)
                .cancelListing(nftContractAddress, listing.listingId)
            expect(await marketplace.getNumberOfActiveListings()).to.equal(0)
        })
    })

    describe('Bidding on NFT', async function () {
        it('Should create bid on NFT and fetch correct', async function () {
            let offer = ethers.utils.parseUnits('10', 'ether')
            let offer2 = ethers.utils.parseUnits('1', 'ether')
            await marketplace
                .connect(buyer1)
                .submitOffer(nftContractAddress, 1, offer)
            bid1 = await marketplace.connect(buyer1).fetchMyBids()
            expect(bid1.length).to.equal(1)

            bid2 = await marketplace
                .connect(buyer2)
                .submitOffer(nftContractAddress, 1, offer2)
            listingOffers = await marketplace.fetchPendingListingOffers(1)
            expect(listingOffers.length).to.equal(2)

            // Reject offer2
            await marketplace
                .connect(seller)
                .decideOffer(nftContractAddress, 1, 2, 0)
            rejected = await marketplace.fetchListingOffers(1)
            r = rejected[1]
            // Check that status of offer is REJECTED (3)
            expect(r.status).to.equal(3)
            //  Check that offer is removed from listing
            listings = await marketplace.fetchListings()
            l = listings[0]
            expect(l.offerSize).to.equal(2)
        })
        it('Should create bid on NFT and accept it', async function () {
            let offer = ethers.utils.parseUnits('1', 'ether')
            await marketplace
                .connect(buyer1)
                .submitOffer(nftContractAddress, 1, offer)
            bid1 = await marketplace.connect(buyer1).fetchMyBids()
            expect(bid1.length).to.equal(1)
            // Expect undecided offer to have status PENDING (1)
            pending = await marketplace.fetchListingOffers(1)
            p = pending[0]
            expect(p.status).to.equal(1)

            // Expect no pending offers after descision
            await marketplace
                .connect(seller)
                .decideOffer(nftContractAddress, 1, 1, 1)
            listingOffer = await marketplace
                .connect(seller)
                .fetchListingOffers(1)
            expect(listingOffer.length).to.equal(1)

            l = listingOffer[0]

            expect(l.status).to.equal(2)

            // Bidder needs to sign offer in order to go through with transaction
            await marketplace
                .connect(buyer1)
                .signOffer(nftContractAddress, 1, 1, { value: l.bid })
            listingOffer = await marketplace
                .connect(seller)
                .fetchListingOffers(1)
            expect(listingOffer.length).to.equal(0)

            // Expect bidder of wining bid to now be owner of NFT
            let owned = await marketplace.connect(buyer1).fetchOwnedNFTs()
            expect(owned[0].owner).to.equal(buyer1.address)
            expect(owned[0].offerSize).to.equal(0)
            expect(owned[0].offerIds.length).to.equal(0)

            // Expect 1 sold listing and 0 active ones
            expect(await marketplace.getNumberOfSoldListings()).to.equal(1)
            expect(await marketplace.getNumberOfActiveListings()).to.equal(0)
        })
        it('Should accept bid, sell nft again, make new offer and offer should be listed in my offers', async function () {
            // This tests all the found edge cases
            let offer = ethers.utils.parseUnits('1', 'ether')
            await marketplace
                .connect(buyer1)
                .submitOffer(nftContractAddress, 1, offer)
            bid1 = await marketplace.connect(buyer1).fetchMyBids()
            expect(bid1.length).to.equal(1)
            expect(await marketplace.getNumberOfOffers()).to.equal(1)
            // Expect undecided offer to have status PENDING (1)
            pending = await marketplace.fetchPendingListingOffers(1)
            p = pending[0]
            expect(p.status).to.equal(1)

            // Expect no pending offers after descision
            await marketplace
                .connect(seller)
                .decideOffer(nftContractAddress, 1, 1, 1)
            listingOffer = await marketplace
                .connect(seller)
                .fetchListingOffers(1)
            expect(listingOffer.length).to.equal(1)

            l = listingOffer[0]

            expect(l.status).to.equal(2)

            // Bidder needs to sign offer in order to go through with transaction
            await marketplace
                .connect(buyer1)
                .signOffer(nftContractAddress, 1, 1, { value: l.bid })
            listingOffer = await marketplace
                .connect(seller)
                .fetchListingOffers(1)
            expect(listingOffer.length).to.equal(0)

            // Expect bidder of wining bid to now be owner of NFT
            let owned = await marketplace.connect(buyer1).fetchOwnedNFTs()
            expect(owned[0].owner).to.equal(buyer1.address)
            expect(owned[0].offerSize).to.equal(0)
            expect(owned[0].offerIds.length).to.equal(0)

            // Expect 1 sold listing and 0 active ones
            expect(await marketplace.getNumberOfSoldListings()).to.equal(1)
            expect(await marketplace.getNumberOfActiveListings()).to.equal(0)

            let price = ethers.utils.parseUnits('1', 'ether')

            expect(owned[0].owner).to.equal(buyer1.address)
            let id = await nft
                .connect(buyer1)
                .createNFT(
                    'https://www.outpump.com/wp-content/uploads/2021/03/beeple.jpg'
                )
            await marketplace
                .connect(buyer1)
                .sellNFT(owned[0].nftContract, 1, 2, price, {
                    value: listingCommission,
                })
            expect(await marketplace.getNumberOfActiveListings()).to.equal(1)

            let o = await marketplace.connect(buyer1).fetchOwnedNFTs()
            expect(o.length).to.equal(0)

            // make new offer
            await marketplace
                .connect(buyer2)
                .submitOffer(nftContractAddress, 2, offer)
            expect(await marketplace.getNumberOfOffers()).to.equal(2)
            let pendinglistingOffer = await marketplace
                .connect(buyer1)
                .fetchPendingListingOffers(2)
            expect(pendinglistingOffer.length).to.equal(1)
            bid2 = await marketplace.connect(buyer2).fetchMyBids()

            // Expect no pending offers after descision
            await marketplace
                .connect(buyer1)
                .decideOffer(nftContractAddress, 2, 2, 1)
            listingOffer = await marketplace
                .connect(buyer1)
                .fetchListingOffers(2)
            expect(listingOffer.length).to.equal(1)
            let listings = await marketplace.fetchListings()
            expect(listings.length).to.equal(1)
        })
    })
})
