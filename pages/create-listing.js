import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, nftmarketplaceaddress } from '../config'

import NFTContract from '../artifacts/contracts/NFTContract.sol/NFTContract.json'
import NFTMarketplaceContract from '../artifacts/contracts/NFTMarketplaceContract.sol/NFTMarketplaceContract.json'

const base_url = 'https://ipfs.infura.io/ipfs'
function CreateListing() {
    const router = useRouter()
    const [isOwned, setIsOwned] = useState(false)
    const {
        query: { listingId, price, name, description, image },
    } = router

    const [fileURL, setFileURL] = useState(null)
    const [formInput, updateFormInput] = useState({
        price: '',
        name: '',
        description: '',
    })

    useEffect(() => {
        if (name && price && description && image && listingId) {
            setIsOwned(true)
            setFileURL(image)
            updateFormInput({
                price: price,
                name: name,
                description: description,
            })
        }
    }, [])

    const onChange = async (e) => {
        console.log('adding file')
        const file = e.target.files[0]
        try {
            const added = await client.add(file, {
                progress: (prog) => console.log(`received: ${prog}`),
            })
            console.log('Uploaded')
            const url = `${base_url}/${added.path}`
            setFileURL(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const createListing = async () => {
        console.log('Creating Listing')
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileURL) {
            return 'Error with creating listing: some Arguments Missing'
        }
        const data = JSON.stringify({
            name,
            description,
            image: fileURL,
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
            console.log('Creating nft')
            isOwned ? sellNFT(url) : createNFT(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const createNFT = async (url) => {
        console.log('create')
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        console.log('connection set')
        let nftContract = new ethers.Contract(
            nftaddress,
            NFTContract.abi,
            signer
        )
        let transaction = await nftContract.createNFT(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let nftId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        const marketContract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        let listingCommission = await marketContract.getListingCommission()
        const commission = listingCommission.toString()
        transaction = await marketContract.createListing(
            nftaddress,
            nftId,
            price,
            { value: commission }
        )
        await transaction.wait()
        router.push('/')
    }
    const sellNFT = async (url) => {
        console.log('create')
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        console.log('connection set')
        let nftContract = new ethers.Contract(
            nftaddress,
            NFTContract.abi,
            signer
        )
        let transaction = await nftContract.createNFT(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let nftId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        const marketContract = new ethers.Contract(
            nftmarketplaceaddress,
            NFTMarketplaceContract.abi,
            signer
        )
        let listingCommission = await marketContract.getListingCommission()
        const commission = listingCommission.toString()
        transaction = await marketContract.sellNFT(
            nftaddress,
            listingId,
            nftId,
            price,
            { value: commission }
        )
        await transaction.wait()
        router.push('/')
    }

    return (
        <div className="m-6  flex flex-col  items-center">
            <h1 className="text-7xl">Create a Listing</h1>

            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder={name ? name : 'Asset Name'}
                    className="mt-8 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                    }
                />
                <textarea
                    placeholder={
                        description ? description : 'Asset Description'
                    }
                    className="mt-2 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({
                            ...formInput,
                            description: e.target.value,
                        })
                    }
                />
                <input
                    placeholder={price ? price : 'Asset Price in MATIC'}
                    className="mt-2 border rounded p-4"
                    onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                    }
                />
                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={(e) => onChange(e)}
                />
                {fileURL && (
                    <img className="rounded my-4" width="250" src={fileURL} />
                )}
                <div className="rounded-md shadow">
                    <button
                        href="/create-listing"
                        onClick={createListing}
                        className="w-full flex items-center  h-12 justify-center px-8 py-3 border border-transparent rounded-md text-white bg-black hover:bg-purple md:py-4 md:text-lg md:px-10"
                    >
                        Create digital asset
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateListing
