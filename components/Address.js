export default function Address({ userAddress }) {
    return (
        <span className="text-sm sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
            {userAddress.substring(0, 5)}…
            {userAddress.substring(userAddress.length - 4)}
        </span>
    )
}
