/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LISTING } from "../utility/types";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";

// Import Swiper styles
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState<LISTING[]>([]);
  const [sellListings, setSellListings] = useState<LISTING[]>([]);
  const [rentListings, setRentListings] = useState<LISTING[]>([]);

  const fetchListings = useCallback(async (searchQuery: string = "", setState: Dispatch<React.SetStateAction<LISTING[]>>) => {
      try {
        const res = await fetch(`/api/listings?limit=4&sort=-createdAt${(searchQuery) ? `&${searchQuery}` : ""}`, {method: 'GET'});
        const data = await res.json();
        if (!data.success) {
          console.log(data.message);
          return;
        }
        setState(data.data);
      } catch (err: any) {
        console.log(err.message);
      }
    },[],
  );

  useEffect(() => {
    fetchListings("offer=true", setOfferListings);
    fetchListings("type=sell", setSellListings);
    fetchListings("type=rent", setRentListings);
  }, [fetchListings]);
  console.log("Offer : ", offerListings);
  console.log("Rent : ", rentListings);
  console.log("Sell : ", sellListings);
  return (
    <>
      {/* -------------- Top Section Heading -------------- */}
      <div className="flex flex-col gap-6 pt-28 pb-20 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find your next <span className="text-slate-500">perfect</span><br />
            place with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Spaider Tech will help you find your home fast, easy and comfortable.<br />
            Our expert support are always available.
          </div>
          <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">Let's start now &#8594;</Link>
      </div>
      {/* -------------- Swipper Section -------------- */}
      <Swiper modules={[Navigation]} navigation>
        {
          offerListings && (offerListings.length > 0) && offerListings.map(listing => (
            <SwiperSlide key={listing._id} className="h-[500px]" style={{background: `url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize: "cover"}}></SwiperSlide>
          ))
        }
      </Swiper>
      {/* -------------- Listing results for offer, sale and rent -------------- */}
      <div className="flex flex-col max-w-6xl mx-auto p-3 gap-12 my-10">
        {/* -------- Leatest Offer Listing -------- */}
        {
          offerListings && (offerListings.length > 0) && (
            <>
              <div className="">
                <h2 className="text-slate-700 text-3xl font-semibold">Recent offers: </h2>
                <Link to={'/search?sort=-createdAt&offer=true'} className="text-blue-800 text-sm font-semibold hover:underline">Show more offers &#8594;</Link>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {
                  offerListings.map(listing => (
                    <ListingItem key={listing._id} listing={listing}/>
                  ))
                }
              </div>
            </>
          )
        }
        {/* -------- Leatest Rent Listing -------- */}
        {
          rentListings && (rentListings.length > 0) && (
            <>
              <div className="">
                <h2 className="text-slate-700 text-3xl font-semibold">Recent places for rent:</h2>
                <Link to={'/search?sort=-createdAt&type=rent'} className="text-blue-800 text-sm font-semibold hover:underline">Show more rents &#8594;</Link>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {
                  rentListings.map(listing => (
                    <ListingItem key={listing._id} listing={listing}/>
                  ))
                }
              </div>
            </>
          )
        }
        {/* -------- Leatest Offer Listing -------- */}
        {
          sellListings && (sellListings.length > 0) && (
            <>
              <div className="">
                <h2 className="text-slate-700 text-3xl font-semibold">Recent places for sell:</h2>
                <Link to={'/search?sort=-createdAt&type=sell'} className="text-blue-800 text-sm font-semibold hover:underline">Show more sells &#8594;</Link>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {
                  sellListings.map(listing => (
                    <ListingItem key={listing._id} listing={listing}/>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default Home