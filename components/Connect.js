async function connect(onConnected) {
    if (!window.ethereum) {
        alert('Get MetaMask!')
        return
    }

    const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
    })

    onConnected(accounts[0])
}

export default function Connect({ setUserAddress }) {
    return (
        <button
            className="z-20 h-12 flex items-center justify-center px-4 py-1 border border-transparent rounded-lg text-white bg-black hover:bg-purple md:py-4 md:text-lg md:px-10"
            onClick={() => connect(setUserAddress)}
        >
            Connect to MetaMask
        </button>
    )
}
