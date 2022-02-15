import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketplaceaddress } from '../config'

import NFTContract from '../artifacts/contracts/NFTContract.sol/NFTContract.json'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'

const useLoadMyBids = () => {
    const [bids, setBids] = useState([])
    const [bidsLoaded, setBidsLoaded] = useState(false)
    async function loadMyBids() {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const marketplaceContract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        const data = await marketplaceContract.fetchMyBids()
        const bids = await Promise.all(
            data.map(async (i) => {
                let bid = ethers.utils.formatUnits(i.bid.toString(), 'ether')
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
                return item
            })
        )
        setBids(bids)
        setBidsLoaded(true)
    }
    useEffect(() => {
        loadMyBids()
    }, [])

    const update = () => {
        setBidsLoaded(false)
        loadMyBids()
    }

    return { bids, bidsLoaded, update }
}

export default useLoadMyBids
