import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { nftaddress, nftmarketplaceaddress } from '../config'
import NFTContract from '../artifacts/contracts/NFTContract.sol/NFTContract.json'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'

let rpc = null
if (process.env.NEXT_PUBLIC_RPC_MORALIS) {
    rpc = process.env.NEXT_PUBLIC_RPC_MORALIS
}

const useLoadAllNFTs = () => {
    const [listings, setListings] = useState([])
    const [loaded, setLoaded] = useState(false)
    async function loadAllListings() {
        const provider = new ethers.providers.JsonRpcProvider(rpc)
        const nftContract = new ethers.Contract(
            nftaddress,
            NFTContract.abi,
            provider
        )
        const marketplaceContract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            provider
        )
        const data = await marketplaceContract.fetchListings()
        const allListings = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await nftContract.tokenURI(i.nftId)
                const meta = await axios.get(tokenUri)
                let price = ethers.utils.formatUnits(
                    i.listingPrice.toString(),
                    'ether'
                )
                let item = {
                    price,
                    listingId: i.listingId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    status: i.status,
                    offerIds: i.offerIds.map((id) => id.toNumber()),
                    offerSize: i.offerSize,
                    description: meta.data.description,
                }
                return item
            })
        )
        setListings(allListings)
        setLoaded(true)
    }
    useEffect(() => {
        loadAllListings()
    }, [])

    const update = () => {
        loadAllListings()
    }
    return { listings, loaded, update }
}

export default useLoadAllNFTs
