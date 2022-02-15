import React, { useEffect, useState } from 'react'
import styles from './metamask-auth.module.css'

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

export default function MetaMaskAuthentication({ onAddressChanged }) {
    const [userAddress, setUserAddress] = useState('')

    useEffect(() => {
        checkIfWalletIsConnected(setUserAddress)
    }, [])

    useEffect(() => {
        onAddressChanged(userAddress)
    }, [userAddress])

    return userAddress ? (
        <div>
            Connected with <Address userAddress={userAddress} />
        </div>
    ) : (
        <Connect setUserAddress={setUserAddress} />
    )
}
