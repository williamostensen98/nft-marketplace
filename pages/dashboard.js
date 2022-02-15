import React, { useContext, useEffect } from 'react'
import ActiveListings from '../components/ActiveListings'
import MyNFTs from '../components/MyNFTs'
import Address from '../components/Address'
import { UserContext } from './_app.js'
import MyBids from '../components/MyBids'
import MyOffers from '../components/MyOffers'

function Dashboard() {
    const userAddress = useContext(UserContext)

    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-col  items-center  ">
                <p className="text-sm mt-1 sm:mt-5 sm:text-sm sm:max-w-xl sm:mx-auto md:mt-1 md:text-sm lg:mx-0">
                    Connected to
                </p>
                <Address userAddress={userAddress} />
            </div>
            <div className="flex flex-row w-full item-start justify-start gap-x-10">
                <div className="w-1/2">
                    <MyBids />
                </div>
                <div className="w-1/2">
                    <MyOffers />
                </div>
            </div>
            <MyNFTs />
            <ActiveListings />
        </div>
    )
}

export default Dashboard
