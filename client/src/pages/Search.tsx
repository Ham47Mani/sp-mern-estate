
const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* ----------- Search Filter ----------- */}
      <div className="p-6 border-b-2 md:border-b-0 md:border-r-2 border-slate-300 min-h-screen">
        <form className="flex flex-col gap-6">
          {/* ------ Search Term ------ */}
          <div className="flex items-center gap-4">
            <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">Search Term :</label>
            <input type="text" name="searchTerm" id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full" />
          </div>
          {/* ------ Type ------ */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold">Type :</label>
            <div className="flex gap-1 items-center">
              <input type="checkbox" name="all" id="all" className="w-5"/>
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" name="rent" id="rent" className="w-5"/>
              <span>Rent</span>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" name="sell" id="sell" className="w-5"/>
              <span>Sell</span>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" name="offer" id="offer" className="w-5"/>
              <span>Offer</span>
            </div>
          </div>
          {/* ------ Amenities ------ */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold">Amenities :</label>
            <div className="flex gap-1 items-center">
              <input type="checkbox" name="parking" id="parking" className="w-5"/>
              <span>Parking</span>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" name="furnished" id="furnished" className="w-5"/>
              <span>Furnished</span>
            </div>
          </div>
          {/* ------ Sort ------ */}
          <div className="flex items-center gap-1">
            <label className="font-semibold">Sort :</label>
            <select name="select_order" id="select_order" className="border rounded-lg p-3">
              <option value="-regularPrice">Price high to low</option>
              <option value="regularPrice">Price low to high</option>
              <option value="createAt" defaultChecked>Latest</option>
              <option value="-createAt">Oldest</option>
            </select>
          </div>
          {/* ------ Search Button ------ */}
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      {/* ----------- Listings ----------- */}
      <div className="px-7 py-4 flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 w-full">Listing results :</h1>
      </div>
    </div>
  )
}

export default Search