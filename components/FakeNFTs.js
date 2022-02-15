import Link from 'next/link';
import React from 'react';
import Card from '../components/Card';

function FakeNFTs() {
  const listing = [{
    price: '100',
    nftId: 200,
    seller: "0x53d567567567567567567567",
    image: "https://images.unsplash.com/photo-1642386231408-5b06e67b17dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    name: "NFT 1",
  }, {
    price: '1',
    nftId: 300,
    seller: "0x53d567567567567567567567",
    image: "https://images.unsplash.com/photo-1643101447013-bba33bb702d3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2874&q=80",
    name: "NFT 1",
  }, {
    price: '0.002',
    nftId: 400,
    seller: "0x53d567567567567567567567",
    image: "https://images.unsplash.com/photo-1643101809652-ef56a14818ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    name: "NFT 1",
  }, {
    price: '1000',
    nftId: 500,
    seller: "0x53d567567567567567567567",
    image: "https://images.unsplash.com/photo-1639818694784-b516f798ae77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
    name: "NFT 1",
  }]

  const onClick = (item) => {
    return
  }

  return (
  <div className="flex flex-col justify-center">
  
  <div className="mt-24 mb-12 flex flex-col items-start justify-start px-4 ">
  <div  className='flex flex-row items-end'>
              <h1 className="text-5xl">Trending now</h1>
              <Link href="/Explore">
                <a className='ml-6 text-lg text-purple hover:underline'>
                  See all
                </a>
              </Link>
            </div>
<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
    {listing.map(item => (
      <Card key={item.nftId} listing={item} type="text-white bg-black" text="Buy" action={onClick}/>
    ))}
  </div>
  </div>
</div>)
}

export default FakeNFTs;
