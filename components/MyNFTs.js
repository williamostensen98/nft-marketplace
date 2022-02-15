import React from 'react'
import Card from './Card'
import useLoadMyNFTs from '../hooks/useLoadMyNFTs'
import { useRouter } from 'next/router'

function MyNFTs() {
    const { nfts, loaded, update } = useLoadMyNFTs()
    const router = useRouter()

    const sellNFT = (nft) => {
        router.push({
            pathname: '/create-listing',
            query: {
                listingId: nft.listingId,
                price: nft.price,
                name: nft.name,
                description: nft.description,
                image: nft.image,
            },
        })
    }

    return (
        <div className="mt-24 mb-12 flex flex-col items-start justify-start px-4 ">
            <div className="flex flex-col items-start">
                <h1 className="text-xl">My owned NFTs</h1>
                <p className="text-md">
                    Every asset owned by you will show here
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
                                    action={sellNFT}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className="py-10 text-xl text-gray sans-serif">
                        No Listings in market
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
export default MyNFTs
