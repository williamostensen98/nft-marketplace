# NFT Marketplace

This project is a part of the project in 90748 - BLOCKCHAIN AND CRYPTOCURRENCIES at the University of Bologna. 
The project demonstrates a NFT market place for selling and buying NFTs using hardhat, next.js, solidity smart contracts and deployment to the polygon Mumbai testnet.

# Description
This project was created from the project proposal "Ethereum Layer 2 solutions:
Developing a Dapp on one of Etheruem's layer 2 solutions". The DApp consists of smart contracts for NFTs and for a NFTMarketplace written in solidity running on the Polygon PoS sidechain. The application allows one to connect via Metamask wallet and create, sell, bid on and buy NFTs on the marketplace. It has a dashboard where users can see all their bids and offers, owned NFTs and created listings and accept or reject offers on created listings.

The project is run with Hardhat, an Ethereum development environment, that allows for running solidity contracts locally and deploy to the blockchain networks. The application can either be run on a local node that can be setup woth hardhat, or as it is now on one of Ethereums layer 2 solutions, Polygon PoS. The Polygon PoS chain and node is used for much faster transaction speed, and smaller gas fees and full EVM compatibility. PolygonPOS uses the robust Plasma bridging framework to ensure securty and a decentralized network of Proof-of-Stake (PoS) validators. This can be considered less secure (but certainly not insecure!) than the ethereum main blockchain, but for small applications like this with many small transactionsthat you wouldnt' want high gas fees and slow transactions for, it is perfect. 

Most of the challenges met in this project has been regarding the Solidity smart contracts. Solidity is a high level, object oriented language for creating smart contracts and looks deceptively simple, but can be quite tricky to work with. The datastructures are not like javascript or any other high level language and because keys are handled wth hashes, iterations of these ar ealso very challenging to work with. Code written in solidity is often expensive to run and is also not easy to debug without using a framework like hardhat to write tests. Thus the greatest challenge of this project has been to get the correct datastructures of the marketplace and with it the code for interacting with it. It has also been very demanding to handle all logical edge cases regarding the application in terms of handlin offers and bids in solidty, but however it has been an experience where I have learned alot in a short period of time. 

# Technologies and libraries
* Solidity 
* Hardhat
* Polygon PoS Scalng solution
* Next.js (React)
* Web3Modal
* @openzeppelin/contracts
* Tailwind CSS for styling
* Ipfs-http-client for file uploading
* Ethers
* Axios
* Chai for testing
* Metamask (Wallet)
* Moralis speedy node (polygon node)

# Features
* Connectin via Metamask wallet
* Creating and NFT via form and uploading through IPFS
* See everyone elses listings
* See your owned NFTs
* See your active, created listings
* Buying or placing bids on listings
* Cancelling listings
* Selling owned NFTs with possibility to change metadata(price, description etc.)
* See status of bids placed by you
* See offers placed on your active listings with possibility to accept or reject offer
* Signing accepted offers in order to buy them

# Status and further development
The code is finalized for the intended project and purpose but still has some bug fixes in the front end part(loading of data is not great with respect to the feedback of the system) and some logical "errors" that are things that wouldn't be possible to do in a real world application, which I would like to fix in the future. I would also like to implement the possibility for everyone to see all offers on a listing and not just the seller and to add timed autions, highest bidder and purchase history functionalities. 

# Screenshots


