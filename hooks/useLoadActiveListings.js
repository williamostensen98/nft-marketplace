import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketplaceaddress } from '../config'

import NFTContract from '../artifacts/contracts/NFTContract.sol/NFTContract.json'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'

const useLoadActiveListings = () => {
    const [nfts, setNfts] = useState([])
    const [loaded, setLoaded] = useState(false)
    async function loadActiveListings() {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
            nftaddress,
            NFTContract.abi,
            signer
        )
        const marketplaceContract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        const data = await marketplaceContract.fetchCreatedListings()
        const owned = await Promise.all(
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
                    status: i.status,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                    offerIds: i.offerIds.map((id) => id.toNumber()),
                    offerSize: i.offerSize,
                }
                return item
            })
        )
        setNfts(owned)
        setLoaded(true)
    }
    useEffect(() => {
        loadActiveListings()
    }, [])

    const update = () => {
        loadActiveListings()
    }

    return { nfts, loaded, update }
}

export default useLoadActiveListings
