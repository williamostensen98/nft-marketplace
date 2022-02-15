import React from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Link from 'next/link'

import { nftaddress, nftmarketplaceaddress } from '../config'

import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'
import Hero from '../components/Hero'
import Card from '../components/Card'
import GetStarted from '../components/GetStarted'
import useLoadAllNFTs from '../hooks/useLoadAllNFTs'

export default function Home() {
    const { listings, loaded, update } = useLoadAllNFTs()

    const purchaseNFT = async (nft) => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.makeSale(nftaddress, nft.listingId, {
            value: price,
        })
        await transaction.wait()
        update()
    }

    return (
        <div className="flex flex-col ">
            <Hero />
            <div className="mt-12 mb-24  px-8 justify-start items-start">
                <div className="flex flex-row items-end">
                    <h1 className="text-5xl">Latest</h1>
                    <Link href="/Explore">
                        <a className="ml-6 text-lg text-purple hover:underline">
                            See all
                        </a>
                    </Link>
                </div>
                {loaded ? (
                    listings.length ? (
                        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {listings.map((item) => (
                                <div
                                    key={item.listingId}
                                    className="flex flex-col"
                                >
                                    <Card
                                        key={item.listingId}
                                        listing={item}
                                        action={purchaseNFT}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h1 className="py-10 mx-auto text-xl text-gray sans-serif">
                            No Listings in market
                        </h1>
                    )
                ) : (
                    <h1 className="py-10 mx-auto text-xl text-gray sans-serif">
                        Loading...
                    </h1>
                )}
            </div>
            <GetStarted />
        </div>
    )
}
