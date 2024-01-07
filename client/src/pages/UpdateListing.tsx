/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageError, StorageReference, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { storage } from "../utility/firebaseConfig";
import { LISTING } from "../utility/types";
import { MdDelete } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [imagesUploadsError, setImagesUploadsError] = useState<string>("");
  const [imagesUploadsLoading, setImagesUploadsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LISTING>({
    name: "",
    description: "",
    address: "",
    regularPrice: 10000,
    bathRooms: 1,
    badRooms: 1,
    furnished: false,
    parking: false,
    type: "sell",
    offer: false,
    imageURLs: [],
  });
  const [submitError, setSubmitError] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {listingID} = useParams();
  // Handle input file change
  const handleFilChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setImages(e.target.files);
  }

  // Handle Inputs Change
  const handleInputsChange = (e: any) => {
    const { id, value, checked, type } = e.target;
    if(id === 'sell' || id === 'rent') {
      setFormData({
        ...formData,
        type: id
      })
    }
    if(id === 'parking' || id === 'furnished' || id === 'offer') {
      setFormData({
        ...formData,
        [id]: checked
      })
    }
    if(type === 'number' || type === 'text' || type === 'textarea') {
      setFormData({
        ...formData,
        [id]: value
      })
    }
  }

  // Handle images submit
  const handleImagesSubmit = async (): Promise<void> => {
    if( images && images.length > 0 && images.length + formData.imageURLs.length < 7) {
      setImagesUploadsLoading(true);
      const promises = [];
      for(let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      setImagesUploadsError("");
      Promise.all(promises).then((url: any) => {
        setFormData({...formData, imageURLs: formData.imageURLs.concat(url)});
        setImagesUploadsLoading(false);
      }).catch(() => {
        setImagesUploadsError("Image uploads failed (2 mb max per image)");
        setImagesUploadsLoading(false);
      });
    } else if (!images || (images && images.length <= 0)) {
      setImagesUploadsError("Please select images to uploads before click upload button");
      return;
    } else {
      setImagesUploadsError("You can only uploads 6 images per listing");
      return;
    }
  }
  
  // Upload image
  const storeImage = async(image : File) => {
    return new Promise((resolve, reject) => {
      const imageName: string = new Date().getTime() + image.name;
      const storageRef: StorageReference = ref(storage, "/listing/" + imageName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on('state_changed',null,
        (error: StorageError) => reject(error),
        () => getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL))
      );
    })
  }

  // Handle Delete Image
  const handleDeleteImage = (imageIndex: number) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== imageIndex)
    });
  }

  // Handle Submit form
  const handleSubmitForm = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(formData.imageURLs.length < 1) {
      setSubmitError("You must upload at least one image");
      return;
    }
    if(formData.discountPrice && +formData.regularPrice < +formData.discountPrice) {
      setSubmitError("Discount price must be lower than regular price");
      return;
    }
    try {
      setSubmitLoading(true)
      setSubmitError("");
      const res = await fetch(`/api/listings/update/${listingID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setSubmitLoading(false);
      if (data.success === false) {
        setSubmitError(data.message)
      }
      navigate(`/listing/${data.data[0]._id}`);
    } catch (err: any) {
      setSubmitError(err.message);
      setSubmitLoading(false);
    }
  }

  // Fetch data when component created
  useEffect(() => {
    // Create Fetch listing method
    const fetchListing = async () => {
      const res = await fetch(`/api//listings/${listingID}`);
      const data = await res.json();
      if (!data.success) {
        console.log("Error : ", data.message);
        return;
      }
      setFormData(data.data[0]);
      return;      
    }
    fetchListing();
  }, [listingID]);

  return (
    <main className="p-3 max-w-5xl mx-auto">
      {/* -------- Title -------- */}
      <h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>
      {/* -------- Form -------- */}
      <form onSubmit={handleSubmitForm} className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* -------- Inputs -------- */}
          <input type="text" name="name" id="name" placeholder="Name" onChange={handleInputsChange} value={formData.name} maxLength={62} minLength={10} className="border p-3 rounded-lg" required/>
          <textarea name="description" id="description" placeholder="Discription" onChange={handleInputsChange} value={formData.description} className="border p-3 rounded-lg h-32 resize-none" required/>
          <input type="text" name="address" id="address" placeholder="Address" onChange={handleInputsChange} value={formData.address} className="border p-3 rounded-lg" required/>
          {/* -------- Check Boxs -------- */}
          <div className="flex gap-6 flex-wrap px-3">
            <div className="flex gap-2">
              <input type="checkbox" name="sell" id="sell" className="w-4" checked={formData.type==="sell"} onChange={handleInputsChange}/>
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-4" checked={formData.type==="rent"} onChange={handleInputsChange}/>
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="parking" id="parking" className="w-4" checked={formData.parking} onChange={handleInputsChange}/>
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="furnished" id="furnished" className="w-4" checked={formData.furnished} onChange={handleInputsChange}/>
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-4" checked={formData.offer} onChange={handleInputsChange}/>
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          {/* -------- Bads & Baths -------- */}
          <div className="flex gap-6 px-3 flex-wrap">
            <div className="flex gap-2 items-center">
              <input type="number" name="badRooms" id="badRooms" min={1} max={50} value={formData.badRooms} onChange={handleInputsChange} required  className="p-3 border border-gray-300 rounded-lg"/>
              <label htmlFor="badRooms">Beds</label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" name="bathRooms" id="bathRooms" min={1} max={50} value={formData.bathRooms} onChange={handleInputsChange} required  className="p-3 border border-gray-300 rounded-lg"/>
              <label htmlFor="bathRooms">Baths</label>
            </div>
          </div>
          {/* -------- Price -------- */}
          <div className="flex gap-2 items-center px-3">
            <input type="number" name="regularPrice" id="regularPrice" min={1} max={90000000} value={formData.regularPrice} onChange={handleInputsChange} required  className="p-3 border border-gray-300 rounded-lg w-32 lg:w-auto"/>
            <div className="flex flex-col items-center">
              <p>Regular Price</p>
              {
                formData.type === "rent" && (
                  <span className="text-sm">($ / month)</span>
                )
              }              
            </div>
          </div>
          {
            formData.offer && (
              <div className="flex gap-2 items-center px-3">
                <input type="number" name="discountPrice" id="discountPrice" min={1} max={90000000} value={formData.discountPrice} onChange={handleInputsChange} required  className="p-3 border border-gray-300 rounded-lg w-32 lg:w-auto"/>
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  {
                    formData.type === "rent" && (
                      <span className="text-sm">($ / month)</span>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="p-3 font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          {/* -------- Input File -------- */}
          <div className="flex gap-4">
            <input type="file" name="images" id="images" accept="image/*" multiple onChange={handleFilChange} className="p-3 border border-gray-300 rounded-lg w-full"/>
            <button type="button" disabled={imagesUploadsLoading} onClick={handleImagesSubmit} className="p-3 rounded-lg uppercase text-green-700 border border-green-700 hover:shadow-lg disabled:opacity-80 min-w-24">
              {imagesUploadsLoading ? <CgSpinnerTwo className='animate-spin text-3xl mx-auto' /> : "Upload"}
            </button>
          </div>
          {/* -------- Showing Images -------- */}
          {
            formData.imageURLs.length > 0 && (
              <div>
                {
                  formData.imageURLs.map((imageurl, index) => (
                    <div className="flex justify-between items-center p-3 border border-slate-300 rounded-lg my-3" key={imageurl}>
                      <img src={imageurl} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                      <button type="button" onClick={() => handleDeleteImage(index)} className="p-3 text-red-700 uppercase rounded-lg hover:opacity-75 text-4xl" >
                        <MdDelete />
                      </button>
                    </div>
                  ))
                }
              </div>
            )
          }
          {/* -------- Error Uploading images -------- */}
          {imagesUploadsError && (
            <p className="text-red-700 text-sm">{imagesUploadsError}</p>
          )}
          {/* -------- Button -------- */}
          <button disabled={submitLoading} className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
            {submitLoading ? <CgSpinnerTwo className='animate-spin text-3xl mx-auto' /> : "Update Listing"}
          </button>
          {/* -------- Error Uploading images -------- */}
          {submitError && (
            <p className="text-red-700 text-sm">{submitError}</p>
          )}
        </div>
      </form>
    </main>
  )
}

export default UpdateListing