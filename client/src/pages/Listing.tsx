/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LISTING } from "../utility/types";
import { CgSpinnerTwo } from "react-icons/cg";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
// Import Swiper styles
import "swiper/css/bundle";

const Listing = () => {
  const {listingID} = useParams();// Get Listing ID from url
  const [listing, setListing] = useState<LISTING | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
        loading && <CgSpinnerTwo className='animate-spin text-5xl text-slate-500' />
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
                    <div className="h-[550px]" style={{'background': `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>
                    </div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </>
        )
      }
    </main>
  )
}

export default Listing;