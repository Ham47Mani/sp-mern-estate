import React from 'react'
import { LISTING } from '../utility/types'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBath, FaBed } from 'react-icons/fa'

type listingItemProps = {
  listing: LISTING
}

const ListingItem = ({listing}: listingItemProps) => {
  return (
    <Link to={`/listing/${listing._id}`} className='flex flex-col gap-4 w-full md:w-80 md:h-[500px] bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
      {/* -------- Listing Image Cover -------- */}
      <img src={listing.imageURLs[0] || "https://blog.hubspot.com/hubfs/Sales_Blog/real-estate-business-compressor.jpg"} alt={listing.name} className='h-80 md:h-56 w-full object-cover hover:scale-110 transition-scale duration-300' />
      {/* -------- Listing Information -------- */}
      <div className="flex flex-col gap-4 p-3 w-full">
        {/* --- Listing Name --- */}
        <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
        {/* --- Listing Address --- */}
        <div className="flex items-center gap-1">
          <MdLocationOn className="text-green-700 text-xl"/>
          <p className='text-sm text-slate-500 truncate font-semibold'>{listing.address}</p>
        </div>
        {/* --- Listing Description --- */}
        <p className='text-sm text-slate-500 line-clamp-3 font-semibold'>{listing.description}</p>
        {/* --- Listing Price --- */}
        <p className=' text-slate-600 font-semibold mt-2'>$
          {listing.offer ? listing.discountPrice?.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
          {listing.type === "rent" && `/ Month`}
        </p>
        {/* --- Listing Bad & Bath --- */}
        {/* ---------- Listing Specification ---------- */}
        <ul className="flex items-center flex-wrap gap-4 md:gap-6 text-green-900 font-semibold text-sm">
          {/* --- Badrooms --- */}
          <li className="flex gap-1 md:gap-2 items-center whitespace-nowrap">
            <FaBed className="text-xl"/>
            {listing.badRooms > 1 ? `${listing.badRooms} Beds` : `${listing.badRooms} Bed`}
          </li>
          {/* --- Bathrooms --- */}
          <li className="flex gap-1 items-center whitespace-nowrap text-sm">
            <FaBath className="text-xl"/>
            {listing.bathRooms > 1 ? `${listing.bathRooms} Baths` : `${listing.bathRooms} Bath`}
          </li>
        </ul>
      </div>
    </Link>
  )
}

export default ListingItem