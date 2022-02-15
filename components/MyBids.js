import React from 'react'
import useLoadMyBids from '../hooks/useLoadMyBids'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketplaceaddress } from '../config'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'
import useLoadAllNFTs from '../hooks/useLoadAllNFTs'

function MyBids() {
    const { bids, bidsLoaded, update } = useLoadMyBids()
    const { listings, loaded } = useLoadAllNFTs()

    const getListing = (offer) => {
        for (const item of listings) {
            if (item.listingId == offer.listingId) {
                return item
            }
        }
        return { image: '', name: '' }
    }
    const sign = async (bid) => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        const price = ethers.utils.parseUnits(bid.bid.toString(), 'ether')
        await contract.signOffer(nftaddress, bid.listingId, bid.offerId, {
            value: price,
        })
        update()
    }

    const statusToText = (status) => {
        switch (status) {
            case 0:
                return 'Deleted'
            case 1:
                return 'Pending'
            case 2:
                return 'Accepted'
            case 3:
                return 'Rejected'
            case 4:
                return 'Signed'
            default:
                console.log(`${expr} could not be found.`)
                return
        }
    }

    return (
        <div className="mt-8 mb-12 flex flex-col items-start justify-start px-4 ">
            <div className="flex flex-col items-start">
                <h1 className="text-xl">My Bids</h1>
                <p className="text-md">
                    Every bid put on a listing will show here
                </p>
            </div>
            <div className="flex flex-col w-full mt-4">
                {loaded && bidsLoaded ? (
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden border-b rounded-lg">
                                <table className="min-w-full divide-y divide-black">
                                    <thead className="bg-purple text-white">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Listing
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Bid
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Sign
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-light divide-y divide-gray-200">
                                        {bids.map((bid) => {
                                            let item = getListing(bid)
                                            return item.name == '' ||
                                                bid.status == 4 ? (
                                                ''
                                            ) : (
                                                <tr key={bid.offerId}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-10">
                                                                <img
                                                                    className="h-8 w-8 rounded-full"
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="ml-1">
                                                                <div className="text-sm"></div>
                                                                {item.name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {bid.bid} MATIC
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-sm leading-5  rounded-full bg-purple text-white">
                                                            {statusToText(
                                                                bid.status
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {bid.status == 2 ? (
                                                                <button
                                                                    className=" bg-black text-white text-sm leading-5 p-2 rounded-lg"
                                                                    onClick={() =>
                                                                        sign(
                                                                            bid
                                                                        )
                                                                    }
                                                                >
                                                                    Sign Offer
                                                                </button>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center">
                        <div
                            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                            role="status"
                        >
                            <span className="hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default MyBids
