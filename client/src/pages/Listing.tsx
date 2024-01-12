/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LISTING } from "../utility/types";
import { CgSpinnerTwo } from "react-icons/cg";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import ContactLandlord from "../components/ContactLandlord";
// Import Swiper styles
import "swiper/css/bundle";

const Listing = () => {
  const {listingID} = useParams();// Get Listing ID from url
  const {currentUser} = useSelector((state: any) => state.user.user);
  const [listing, setListing] = useState<LISTING | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showContact, setShowContact] = useState<boolean>(false);
  
  // Fetch the listing with listingID
  useEffect(() => {
    const getListing = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/listings/${listingID}`, {method: 'GET'});
        const data = await res.json();
        if (!data.success) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data.data[0]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
      }
    };
    getListing();
  }, [listingID]);

  return (
    <main>
      {/* ------------ Loading ------------ */}
      {
        loading && <CgSpinnerTwo className='animate-spin text-5xl text-slate-500 my-28 mx-auto' />
      }
      {/* ------------ Error ------------ */}
      {
        error && (
          <div className="text-center p-7 mx-auto my-7">
            <p className='text-xl text-red-700 font-semibold my-3'>{error}</p>
            <Link to={"/"} className="text-slate-900 hover:text-slate-500">Back to Home &#x2192;</Link>
          </div>
        )
      }
      {/* ------------ Show Listing ------------ */}
      {
        listing && !error && !loading && (
          <>
            {/* ---------- Slider ---------- */}
            <Swiper modules={[Navigation]} navigation>
              {
                listing.imageURLs.map((url) => (
                  <SwiperSlide key={url}>
                    <div className="h-[350px] md:h-[550px]" style={{'background': `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                    </div>
                  </SwiperSlide>
                ))
              }
              {
                listing.imageURLs.length === 0 && 
                <SwiperSlide key="https://blog.hubspot.com/hubfs/Sales_Blog/real-estate-business-compressor.jpg">
                  <div className="h-[350px] md:h-[550px]" style={{'background': `url("https://blog.hubspot.com/hubfs/Sales_Blog/real-estate-business-compressor.jpg") center no-repeat`, backgroundSize: 'cover'}}>
                  </div>
                </SwiperSlide>
              }
            </Swiper>
            {/* ---------- Share Icon ---------- */}
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
              <FaShare
                className='text-slate-500'
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className='fixed top-[23%] right-[1%] z-10 rounded-md bg-slate-100 p-2'>
                Link copied!
              </p>
            )}
            {/* ---------- Listing Details ---------- */}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6">
              {/* ---------- Listing Title & Price ---------- */}
              <p className='text-2xl font-semibold'>
                {listing.name} - ${' '}
                {(listing.offer && listing.discountPrice)
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>
              {/* ---------- Listing Address ---------- */}
              <p className="flex items-center gap-2 text-slate-600 my-2 text-sm">
                <FaMapMarkerAlt className="text-green-700"/>
                {listing.address}
              </p>
              {/* ---------- Listing Type & Offer---------- */}
              <div className=" flex items-center gap-6">
                <p className="bg-red-900 w-full max-w-[200px] text-white capitalize text-center p-2 rounded-md">
                  {`for ${listing.type}`}
                </p>
                {
                  listing.offer && listing.discountPrice &&
                  <p className="bg-green-700 w-full max-w-[200px] text-white capitalize text-center p-2 rounded-md">
                    s{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')} OFF
                  </p>
                }
              </div>
              {/* ---------- Listing Description ---------- */}
              <p className="text-slate-700 text-lg">
                <span className="font-semibold text-black">Description - </span>
                {listing.description}
              </p>
              {/* ---------- Listing Specification ---------- */}
              <ul className="flex items-center flex-wrap gap-4 md:gap-6 text-green-900 font-semibold text-sm">
                {/* --- Badrooms --- */}
                <li className="flex gap-2 md:gap-2 items-center whitespace-nowrap">
                  <FaBed className="text-2xl"/>
                  {listing.badRooms > 1 ? `${listing.badRooms} Beds` : `${listing.badRooms} Bed`}
                </li>
                {/* --- Bathrooms --- */}
                <li className="flex gap-2 items-center whitespace-nowrap">
                  <FaBath className="text-2xl"/>
                  {listing.bathRooms > 1 ? `${listing.bathRooms} Baths` : `${listing.bathRooms} Bath`}
                </li>
                {/* --- Parking --- */}
                <li className="flex gap-2 items-center whitespace-nowrap">
                  <FaParking className="text-2xl"/>
                  {listing.parking ? `Parking Spot` : `No Parking`}
                </li>
                {/* --- Furnished --- */}
                <li className="flex gap-2 items-center whitespace-nowrap">
                  <FaChair className="text-2xl"/>
                  {listing.parking ? `Furnished` : `Unfurnished`}
                </li>
              </ul>
              {/* ---------- Listing Contact Landlord Button ---------- */}
              {
                currentUser && (listing.userRef !== currentUser[0]._id) && !showContact && (
                  <button onClick={() => setShowContact(true)} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Contact Landlord</button>
                )
              }
              {/* ---------- Listing Contact Landlord form ---------- */}
              {
                currentUser && (listing.userRef !== currentUser[0]._id) && showContact && <ContactLandlord listing={listing}/>
              }
            </div>
          </>
        )
      }
    </main>
  )
}

export default Listing;