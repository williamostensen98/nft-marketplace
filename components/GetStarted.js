import React from 'react'
import Comp from '../assets/Component.svg'
const GetStarted = () => {
    return (
        <div className="full-height relative flex flex-col justify-center items-center text-white ">
            <Comp className="z-10" />
            <img
                className="absolute z-1 full-height w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                src="https://images.unsplash.com/photo-1633164442172-dc4147f21954?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
                alt=""
            />
            <h1 className="z-10 text-4xl text-center tracking-tight sm:text-6xl md:text-6xl">
                <span className="block ">Discover and </span>{' '}
                <span className="block text-indigo-600 xl:inline">
                    Sell Digital Art
                </span>
            </h1>
            <p className="z-10 text-lg mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                It hasn’t been easier to create and deploy your NFTs. Get
                started now!
            </p>
            <div className=" z-10 rounded-md">
                <a
                    href="/create-listing"
                    className="mt-6 h-12 flex items-center justify-center border border-transparent px-8 py-3  hover:bg-purple rounded-md text-white bg-black  "
                >
                    Get started
                </a>
            </div>
        </div>
    )
}

export default GetStarted
