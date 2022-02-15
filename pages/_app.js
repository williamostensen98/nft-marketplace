import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState, createContext } from 'react'
import Connect from '../components/Connect'
export const UserContext = createContext()

function MyApp({ Component, pageProps }) {
    const [userAddress, setUserAddress] = useState('')
    async function checkIfWalletIsConnected(onConnected) {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts',
            })

            if (accounts.length > 0) {
                const account = accounts[0]
                onConnected(account)
                return
            }
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected(setUserAddress)
    }, [userAddress])

    return (
        <UserContext.Provider value={userAddress}>
            <div className="">
                <nav className="flex justify-between items-center flex-row p-8 sticky top-0 z-30 ">
                    <div className="flex mr-6 ">
                        <Link href="/">
                            <a className="mr-12 text-xl hover:text-purple">
                                [ knipverse ]
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="mr-6 text-lg hover:text-purple">
                                Home
                            </a>
                        </Link>
                        <Link href="/create-listing">
                            <a className="mr-6 text-lg hover:text-purple">
                                Create
                            </a>
                        </Link>
                    </div>

                    <Link href="/dashboard">
                        <a className="text-lg hover:text-purple active:text-purple">
                            My Dashboard
                        </a>
                    </Link>
                </nav>
                {userAddress ? (
                    <Component user={userAddress} {...pageProps} />
                ) : (
                    <div className="full-height flex items-center justify-center">
                        <Connect setUserAddress={setUserAddress} />
                    </div>
                )}

                <footer className="mb-0 footer w-full half-height bg-black flex flex-row justify-around items-center p-12">
                    <div>
                        <Link href="/">
                            <a className="mb-6 text-xl text-white">
                                [ knipverse ]
                            </a>
                        </Link>
                        <h1 className="text-4xl text-white tracking-tight sm:text-6xl md:text-6xl">
                            <span className="block">Discover and </span>{' '}
                            <span className="block xl:inline">
                                Sell Digital Art
                            </span>
                        </h1>
                        <p className="text-lg mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            It has not been easier to create and deploy your
                            NFTs. Get started now!
                        </p>
                    </div>
                    <div className="flex flex-col mb-6 text-white">
                        <h2 className="text-xl">Links</h2>
                        <Link href="/">
                            <a className="mr-6 text-lg">Home</a>
                        </Link>

                        <Link href="/create-listing">
                            <a className="mr-6 text-lg">Create</a>
                        </Link>

                        <Link href="/dashboard">
                            <a className="mr-6 text-lg">My Dashboard</a>
                        </Link>
                    </div>
                </footer>
            </div>
        </UserContext.Provider>
    )
}

export default MyApp
