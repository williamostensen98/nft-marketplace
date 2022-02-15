import React, { useContext, useState } from 'react'
import { UserContext } from '../pages/_app'
import Address from './Address'
import NFTDetails from './NFTDetails'

const Card = ({ listing, action }) => {
    const [open, setOpen] = useState(false)
    const userAddress = useContext(UserContext)

    const getSeller = () => {
        if (listing.status == 1) {
            return { text: 'Owned by', address: listing.owner }
        }
        return { text: 'From', address: listing.seller }
    }
    const getPrice = () => {
        if (listing.status == 1) {
            return ''
        }
        return listing.price + 'MATIC'
    }
    function getType() {
        if (listing.status == 0) {
            if (listing.seller.toLowerCase() == userAddress) {
                return 'CANCEL'
            } else {
                return 'BUY'
            }
        } else if (listing.status == 1) {
            return 'SELL'
        } else {
            return 'NONE'
        }
    }
    function getText() {
        switch (getType(listing)) {
            case 'BUY':
                return 'Buy NFT'
            case 'SELL':
                return 'Sell NFT'
            case 'CANCEL':
                return 'Cancel NFT'
            default:
                return ''
        }
    }
    function getStyle() {
        switch (getType(listing)) {
            case 'BUY':
                return 'bg-black text-white'
            case 'SELL':
                return 'bg-purple text-white border border-yellow'
            case 'CANCEL':
                return 'bg-gray text-black border-black'
            default:
                return 'hidden'
        }
    }

    return (
        <div>
            <div className="group relative mb-6">
                <div className="relative hover w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-xl overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                    <img
                        src={listing.image}
                        className=" w-full h-full object-center object-cover lg:w-full lg:h-full"
                    />
                    <div
                        className={`absolute top-0 left-0 w-full flex flex-col h-full items-center justify-center bg-gray opacity-75 ${
                            listing.status == 2 ? 'block' : 'hidden'
                        }`}
                    >
                        <p className="text-3xl text-white z-100">Cancelled</p>
                    </div>
                    <div className="box absolute h-20 bottom-0 left-0 bg-black opacity-50 z-10 blur"></div>
                    <p className="pb-2 text-xl text-white absolute bottom-0 right-5 z-20">
                        {getPrice()}
                    </p>
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-xl text-black">
                            <a href="#" onClick={() => setOpen(true)}>
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                />
                                {listing.name}
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-purple">
                            {getSeller(listing).text}{' '}
                            <Address userAddress={getSeller().address} />
                        </p>
                    </div>
                </div>
            </div>
            <NFTDetails
                open={open}
                setOpen={setOpen}
                nft={listing}
                type={getType()}
                action={action}
                style={getStyle()}
                text={getText()}
            />
        </div>
    )
}

export default Card
