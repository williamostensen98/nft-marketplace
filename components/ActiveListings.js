import React from 'react'
import Card from '../components/Card'
import useLoadActiveListings from '../hooks/useLoadActivelistings'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketplaceaddress } from '../config'

import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'

function ActiveListings() {
    const { nfts, loaded, update } = useLoadActiveListings()

    const cancelListing = async (nft) => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        const transaction = await contract.cancelListing(
            nftaddress,
            nft.listingId
        )
        await transaction.wait()
        update()
    }

    return (
        <div className="mt-24 mb-12 flex flex-col items-start justify-start px-4 ">
            <div className="flex flex-col items-start">
                <h1 className="text-xl">My Created Listings</h1>
                <p className="text-md">
                    Every active listing by you will show here
                </p>
            </div>
            {loaded ? (
                nfts.length ? (
                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {nfts.map((item) => (
                            <div key={item.listingId} className="flex flex-col">
                                <Card
                                    key={item.listingId}
                                    listing={item}
                                    action={cancelListing}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className="py-10 text-xl text-gray sans-serif">
                        No Active Listings
                    </h1>
                )
            ) : (
                <h1 className="py-10  text-xl text-gray sans-serif">
                    Loading...
                </h1>
            )}
        </div>
    )
}

export default ActiveListings
