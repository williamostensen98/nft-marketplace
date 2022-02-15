/* This example requires Tailwind CSS v2.0+ */

export default function Example() {
    return (
        <div className=" relative bg-yellow overflow-hidden">
            <div className="mx-auto">
                <div className="z-10 pb-8  sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-yellow transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100" />
                    </svg>

                    <main className="mt-16 mx-auto max-w-8xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-zxl tracking-tight sm:text-6xl md:text-7xl">
                                <span className="block ">Discover and </span>{' '}
                                <span className="block text-indigo-600 xl:inline">
                                    Sell Digital Art
                                </span>
                            </h1>
                            <p className="text-3xl mt-3 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0">
                                Start collectign or selling NFTs in only minute.{' '}
                                <br />
                                It has never been easier to sell your digital
                                assets
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a
                                        href="/create-listing"
                                        className="w-full flex items-center  h-12 justify-center px-8 py-3 border border-transparent rounded-md text-white bg-black hover:bg-purple md:py-4 md:text-lg md:px-10"
                                    >
                                        Get started
                                    </a>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <a
                                        href="/"
                                        className="h-12 w-full flex items-center justify-center px-8 py-3 border border-black rounded-md text-indigo-700  hover:bg-purple hover:border-transparent hover:text-white md:py-4 md:text-lg md:px-10"
                                    >
                                        Explore
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-3/5 clip">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                    src="https://images.unsplash.com/photo-1633743252577-ccb68cbdb6ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
                    alt=""
                />
            </div>
        </div>
    )
}
