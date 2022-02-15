import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftmarketplaceaddress } from '../config'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'

const useLoadMyOffers = () => {
    const [offers, setOffers] = useState([])
    const [offersLoaded, setOffersLoaded] = useState(false)

    async function loadMyOffers() {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const marketplaceContract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        const listings = await marketplaceContract.fetchCreatedListings()
        let data
        let results = []
        for (const listing of listings) {
            data = await marketplaceContract.fetchListingOffers(
                listing.listingId
            )
            Promise.all(
                data.map(async (i) => {
                    let bid = ethers.utils.formatUnits(
                        i.bid.toString(),
                        'ether'
                    )
                    let item = {
                        bid,
                        offerId: i.offerId,
                        listingId: i.listingId.toNumber(),
                        nftContract: i.nftContract,
                        listingId: i.listingId,
                        bidder: i.bidder,
                        status: i.status,
                        isDecided: i.isDecided,
                    }
                    results.push(item)
                    return item
                })
            )
        }
        setOffers(results)
        setOffersLoaded(true)
    }
    useEffect(() => {
        loadMyOffers()
    }, [])

    const updateOffers = () => {
        setOffersLoaded(false)
        loadMyOffers()
    }

    return { offers, offersLoaded, updateOffers }
}

export default useLoadMyOffers
