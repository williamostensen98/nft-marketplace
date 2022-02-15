const hre = require('hardhat')

async function main() {
    const NFTMarketplace = await hre.ethers.getContractFactory(
        'NFTMarketplaceContract'
    )
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed()
    console.log('Marketplace deployed to:', nftMarketplace.address)

    const NFT = await hre.ethers.getContractFactory('NFTContract')
    const nft = await NFT.deploy(nftMarketplace.address)
    await nft.deployed()
    console.log('NFT deployed to:', nft.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
