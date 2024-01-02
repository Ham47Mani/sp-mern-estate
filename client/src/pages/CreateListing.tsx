
const CreateListing = () => {
  return (
    <main className="p-3 max-w-5xl mx-auto">
      {/* -------- Title -------- */}
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      {/* -------- Form -------- */}
      <form className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* -------- Inputs -------- */}
          <input type="text" name="name" id="name" placeholder="Name" maxLength={62} minLength={10} className="border p-3 rounded-lg" required/>
          <input type="text" name="discription" id="discription" placeholder="Discription" className="border p-3 rounded-lg" required/>
          <input type="text" name="address" id="address" placeholder="Address" className="border p-3 rounded-lg" required/>
          {/* -------- Check Boxs -------- */}
          <div className="flex gap-6 flex-wrap px-3">
            <div className="flex gap-2">
              <input type="checkbox" name="sell" id="sell" className="w-4"/>
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-4"/>
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="parking" id="parking" className="w-4"/>
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="furnished" id="furnished" className="w-4"/>
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-4"/>
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          {/* -------- Bads & Baths -------- */}
          <div className="flex gap-6 px-3 flex-wrap">
            <div className="flex gap-2 items-center">
              <input type="number" name="badRooms" id="badRooms" min={1} max={10} defaultValue={1} required  className="p-3 border border-gray-300 rounded-lg"/>
              <label htmlFor="badRooms">Beds</label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" name="bathRooms" id="bathRooms" min={1} max={10} defaultValue={1} required  className="p-3 border border-gray-300 rounded-lg"/>
              <label htmlFor="bathRooms">Baths</label>
            </div>
          </div>
          {/* -------- Price -------- */}
          <div className="flex gap-2 items-center px-3">
            <input type="number" name="regularPrice" id="regularPrice" min={1} defaultValue={1} required  className="p-3 border border-gray-300 rounded-lg w-32 lg:w-auto"/>
            <div className="flex flex-col items-center">
              <p>Regular Price</p>
              <span className="text-sm">($ / month)</span>
            </div>
          </div>
          <div className="flex gap-2 items-center px-3">
            <input type="number" name="discountPrice" id="discountPrice" min={1} defaultValue={1} required  className="p-3 border border-gray-300 rounded-lg w-32 lg:w-auto"/>
            <div className="flex flex-col items-center">
              <p>Discount Price</p>
              <span className="text-sm">($ / month)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="p-3 font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          {/* -------- Input File -------- */}
          <div className="flex gap-4">
            <input type="file" name="images" id="images" accept="image/*" multiple className="p-3 border border-gray-300 rounded-lg w-full"/>
            <button className="p-3 rounded-lg uppercase text-green-700 border border-green-700 hover:shadow-lg disabled:opacity-80">Upload</button>
          </div>
          {/* -------- Button -------- */}
          <button className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80">Create Listing</button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing