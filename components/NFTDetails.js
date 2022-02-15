import React from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Address from './Address'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketplaceaddress } from '../config'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'
import { useRouter } from 'next/router'

const NFTDetails = ({ nft, open, setOpen, action, type, style, text }) => {
    const { image, price, name, description } = nft
    const [formInput, updateFormInput] = useState({ price: '' })
    const router = useRouter()

    const placeBid = async (nft) => {
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        await contract.submitOffer(nftaddress, nft.listingId, price)
        router.push('/dashboard')
    }

    const getSeller = (listing) => {
        if (listing.status == 1) {
            return { text: 'Owned by', address: listing.owner }
        }
        return { text: 'From', address: listing.seller }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-40 inset-0 overflow-y-auto "
                onClose={setOpen}
            >
                <div
                    className="flex  text-center md:block md:px-2 lg:px-4"
                    style={{ fontSize: 0 }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden md:inline-block md:align-middle md:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        enterTo="opacity-100 translate-y-0 md:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 md:scale-100"
                        leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                    >
                        <div className="flex text-base text-left transform transition text-white w-full full-height md:inline-block md:px-4 md:my-8 md:align-middle ">
                            <div className="rounded-lg  w-full relative flex items-center bg-purple px-8 pl-12 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-16">
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="text-white">Close</span>
                                </button>
                                <div className="w-full flex flex-row gap-x-10 ">
                                    <div className="w-1/2 rounded-lg bg-gray-100 overflow-scroll ">
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={image}
                                                alt="#"
                                                className=""
                                            />
                                        </div>
                                    </div>
                                    <div className="w-1/2  flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-5xl sm:pr-12">
                                                {name}
                                            </h2>
                                            <p className="text-lg text-yellow">
                                                {getSeller(nft).text}{' '}
                                                <Address
                                                    userAddress={
                                                        getSeller(nft).address
                                                    }
                                                />
                                            </p>
                                            <section
                                                aria-labelledby="information-heading"
                                                className="mt-2"
                                            >
                                                <p className="text-sm text-white ">
                                                    PRICE
                                                </p>
                                                <p className="text-3xl text-yellow ">
                                                    {price} MATIC
                                                </p>
                                                <p className="text-sm text-white mt-2 ">
                                                    DESCRIPTION
                                                </p>
                                                <p className="text-lg text-yellow">
                                                    {description}
                                                </p>
                                            </section>
                                        </div>
                                        <div className="flex flex-col">
                                            {type != 'BUY' ? (
                                                ' '
                                            ) : (
                                                <div className="w-full flex flex-row gap-x-1 mb-2">
                                                    <input
                                                        placeholder="Bid (ETH)"
                                                        className="relative text-black border rounded h-12 p-4 w-2/3"
                                                        onChange={(e) =>
                                                            updateFormInput({
                                                                ...formInput,
                                                                price: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            placeBid(nft)
                                                        }
                                                        className={`z-20 w-1/3 h-12 flex items-center justify-center px-4 py-1 border border-transparent  rounded-lg bg-yellow text-black md:py-4 md:text-lg md:px-10`}
                                                    >
                                                        Place bid
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => action(nft)}
                                                className={`${style} z-20 w-full h-12 flex items-center justify-center px-4 py-1 border border-transparent  rounded-lg hover:bg-yellow hover:text-black md:py-4 md:text-lg md:px-10`}
                                            >
                                                {text}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
export default NFTDetails
