import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketplaceaddress } from '../config'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'
import useLoadAllNFTs from '../hooks/useLoadAllNFTs'
import useLoadMyOffers from '../hooks/useLoadMyOffers'

function MyOffers() {
    const { offers, offersLoaded, updateOffers } = useLoadMyOffers()
    const { listings, loaded } = useLoadAllNFTs()

    useEffect(() => {
        updateOffers()
    }, [])

    const getContract = async () => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        return contract
    }

    const getListing = (offer) => {
        for (const item of listings) {
            if (item.listingId == offer.listingId) {
                return item
            }
        }
        return { image: '', name: '' }
    }
    const reject = async (offer) => {
        const contract = await getContract()
        await contract.decideOffer(
            nftaddress,
            offer.listingId,
            offer.offerId,
            0
        )
        updateOffers()
    }
    const accept = async (offer) => {
        const contract = await getContract()
        await contract.decideOffer(
            nftaddress,
            offer.listingId,
            offer.offerId,
            1
        )
        updateOffers()
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
            default:
                console.log(`${status} could not be found.`)
                return
        }
    }

    return (
        <div className="mt-8 mb-12 flex flex-col items-start justify-start px-4 ">
            <div className="flex flex-col items-start">
                <h1 className="text-xl">My Offers</h1>
                <p className="text-md">
                    Every bid put on a listing will show here
                </p>
            </div>
            <div className="flex flex-col w-full mt-4">
                {offersLoaded && loaded ? (
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
                                                Decide
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-light divide-y divide-gray-200">
                                        {offers.length ? (
                                            offers.map((offer) => {
                                                let item = getListing(offer)
                                                return offer.status == 0 ||
                                                    offer.status == 4 ? (
                                                    <tr
                                                        key={offer.offerId}
                                                    ></tr>
                                                ) : (
                                                    <tr key={offer.offerId}>
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
                                                                {offer.bid}{' '}
                                                                MATIC
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-sm leading-5  rounded-full bg-purple text-white">
                                                                {statusToText(
                                                                    offer.status
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-row items-center justify-center">
                                                                {offer.status !=
                                                                1 ? (
                                                                    <></>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            className="w-1/2 bg-red text-white text-sm leading-5  rounded-full"
                                                                            onClick={() =>
                                                                                reject(
                                                                                    offer
                                                                                )
                                                                            }
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                        <button
                                                                            className="w-1/2 bg-green text-white text-sm leading-5  rounded-full"
                                                                            onClick={() =>
                                                                                accept(
                                                                                    offer
                                                                                )
                                                                            }
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <></>
                                        )}
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
export default MyOffers
