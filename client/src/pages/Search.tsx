/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { LISTING } from "../utility/types";
import { CgSpinnerTwo } from "react-icons/cg";
import ListingItem from "../components/ListingItem";

// Sidebar Data Search type
interface SIDEBARDATASEARCH {
  searchTerm: string,
  type: 'all' | "rent" | "sell",
  parking: boolean,
  furnished: boolean,
  offer: boolean,
  sort: string
}

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [listings, setListings] = useState<LISTING[]>([]);
  const [sidebarDataSearch, setSidebarDataSearch] = useState<SIDEBARDATASEARCH>({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: '-createdAt'
  });

  // Handle inputs change
  const handleChange = (e: ChangeEvent<any>) => {
    const {id, value, checked} = e.target;
    if (id === "all" || id === "rent" || id === "sell") setSidebarDataSearch({...sidebarDataSearch, type: id as 'all' | "rent" | "sell"});
    if (id === "searchTerm") setSidebarDataSearch({...sidebarDataSearch, searchTerm: value});
    if (id === "parking" || id === "furnished" || id === "offer") setSidebarDataSearch({...sidebarDataSearch, [id]: (checked || checked === 'true') ? true : false});
    if (id === "sort_order") setSidebarDataSearch({...sidebarDataSearch, sort: value});
  }

  // Handle Submit search form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", sidebarDataSearch.searchTerm);
    urlParams.set("type", sidebarDataSearch.type);
    urlParams.set("parking", sidebarDataSearch.parking ? "true" : "false");
    urlParams.set("furnished", sidebarDataSearch.furnished ? "true" : "false");
    urlParams.set("offer", sidebarDataSearch.offer ? "true" : "false");
    urlParams.set("sort", sidebarDataSearch.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    // Get params from URL
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const typeUrl = urlParams.get("type");
    const parkingUrl = urlParams.get("parking");
    const furnishedUrl = urlParams.get("furnished");
    const offerUrl = urlParams.get("offer");
    const sortUrl = urlParams.get("sort");
    // Update sidebarDataSearch
    if (searchTermUrl || typeUrl || parkingUrl || furnishedUrl || offerUrl || sortUrl) {
      setSidebarDataSearch({
        searchTerm: searchTermUrl || sidebarDataSearch.searchTerm,
        type: typeUrl as "all" | "rent" | "sell" || sidebarDataSearch.type,
        parking: (parkingUrl === "true" ? true : false) || sidebarDataSearch.parking,
        furnished: (furnishedUrl === "true" ? true : false) || sidebarDataSearch.furnished,
        offer: (offerUrl === "true" ? true : false) || sidebarDataSearch.offer,
        sort: sortUrl || sidebarDataSearch.sort
      });
    }
    // Fetch Listings
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings?${searchQuery}`, {method: 'GET'});
        const data: any = await res.json();
        if (!data.success) {
          setError(data.message);
          setLoading(false);
          return
        }
        setListings(data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchListings();
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* ----------- Search Filter ----------- */}
      <div className="p-6 border-b-2 md:border-b-0 md:border-r-2 border-slate-300 min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ------ Search Term ------ */}
          <div className="flex items-center gap-4">
            <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">Search Term :</label>
            <input type="text" name="searchTerm" id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full" 
              value={sidebarDataSearch.searchTerm} onChange={handleChange}
            />
          </div>
          {/* ------ Type ------ */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold">Type :</label>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="all" id="all" className="w-5 h-5" onChange={handleChange} checked={sidebarDataSearch.type === "all"}/>
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="rent" id="rent" className="w-5 h-5" onChange={handleChange} checked={sidebarDataSearch.type === "rent"}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="sell" id="sell" className="w-5 h-5" onChange={handleChange} checked={sidebarDataSearch.type === "sell"}/>
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="offer" id="offer" className="w-5 h-5"  onChange={handleChange} checked={sidebarDataSearch.offer}/>
              <span>Offer</span>
            </div>
          </div>
          {/* ------ Amenities ------ */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold">Amenities :</label>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="parking" id="parking" className="w-5 h-5"  onChange={handleChange} checked={sidebarDataSearch.parking}/>
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="furnished" id="furnished" className="w-5 h-5"  onChange={handleChange} checked={sidebarDataSearch.furnished}/>
              <span>Furnished</span>
            </div>
          </div>
          {/* ------ Sort ------ */}
          <div className="flex items-center gap-1">
            <label className="font-semibold">Sort :</label>
            <select name="sort_order" id="sort_order" onChange={handleChange} value={sidebarDataSearch.sort} className="border rounded-lg p-3">
              <option value="-regularPrice">Price high to low</option>
              <option value="regularPrice">Price low to high</option>
              <option value="-createdAt" defaultChecked>Latest</option>
              <option value="createdAt">Oldest</option>
            </select>
          </div>
          {/* ------ Search Button ------ */}
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      {/* ----------- Show Listings Part ----------- */}
      <div className="px-7 py-4 flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 w-full">Listing results :</h1>
        {/* ------------ Loading ------------ */}
        {
          loading && <CgSpinnerTwo className='animate-spin text-5xl text-slate-500 my-7 mx-auto' />
        }
        {/* ------------ Error ------------ */}
        {
          error && (
            <div className="p-2 mx-auto my-4">
              <p className='text-xl text-red-700 font-semibold my-3'>{error}</p>
            </div>
          )
        }
        {/* ----------- Show Listings ----------- */}
        <div className="flex items-center gap-6 my-7 flex-wrap">
          {
            !loading && listings.length == 0 && (
              <p className='text-xl text-slate-700 font-semibold my-3'>No listing found!!</p>
            )
          }
          {
            !loading && listings.map(listing => (
              <ListingItem key={listing._id} listing={listing}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Search