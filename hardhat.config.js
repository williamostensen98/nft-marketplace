require('@nomiclabs/hardhat-waffle')
const fs = require('fs')
const PRIVATE_KEY = fs.readFileSync('.secret').toString().trim()
const URL = fs.readFileSync('.moralisId').toString().trim()
module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            chainId: 1337,
        },
        mumbai: {
            url: URL,
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        version: '0.8.4',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
}
