/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { LISTING, USER } from "../utility/types";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { StorageReference, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utility/firebaseConfig";
import { Dispatch } from "@reduxjs/toolkit";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, resetError, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { MdDelete, MdEditDocument } from "react-icons/md";

const Profile = () => {
  const dispatch: Dispatch = useDispatch();
  const {error, loading, currentUser} = useSelector((state: any) => state.user.user);
  const user: USER = currentUser[0];
  const fileInputRef = useRef<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState<number>(0);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<USER>(user);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [showListingsError, setShowListingsError] = useState<string | null>(null);
  const [userListings, setUserListings] = useState<LISTING[]>([]);

  // Handle inputs change
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    })
  }

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  // Handle file upload
  const handleFileUpload = (image: File): void => {
    setFilePerc(0);
    setFileUploadError(null)
    const fileName: string = new Date().getTime() + image.name;
    const storageRef: StorageReference = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    }, (err: any) => {
      setFileUploadError(err.message);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({...formData, photo: downloadURL}));
    });
  }
  // Handle Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) : Promise<void> => {
    e.preventDefault();
    dispatch(resetError());
    setUpdateSuccess(false);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.data));
      setUpdateSuccess(true);
    } catch (err: any) {
      dispatch(updateUserFailure(err.message));
    }
  }
  // Handle delete user
  const handleDeleteUser = async (): Promise<void> => {
    dispatch(resetError());
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/users/delete/${user._id}`, {method: 'DELETE'});
      const data = await res.json();
      if(data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (err: any) {
      dispatch(deleteUserFailure(err.message));
    }
  }
  // Handle sign out user
  const handleSignOut = async (): Promise<void> => {
    dispatch(resetError());
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`api/auth/signout`, {method: 'GET'});
      const data = await res.json();
      if(data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err: any) {
      dispatch(signOutUserFailure(err.message));
    }
  }
  // Handle Show Listings
  const handleShowListings = async(): Promise<void> => {
    setShowListingsError(null);
    try {
      const res = await fetch('/api/users/listings', {method: "GET"});
      const data = await res.json();
      if(!data.success) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(data.data);
    } catch (err: any) {
      setShowListingsError(err.message);
    }
  }

  // Delete Listing
  const handleDeleteListing = async (listingID: string) => {
    try {
      if(listingID === "") {
        console.log("Check the id of listing, there's not exists");
        return;
      }
      // Delete listing
      const res = await fetch(`/api/listings/delete/${listingID}`, {method: "DELETE"});
      const data = await res.json();
      // Check if there's no error
      if(!data.success) {
        console.log(data.message);
        return;
      }
      // Update user listings state
      setUserListings(prev => prev.filter(listing => listing._id !== listingID));
    } catch (err: any) {
      console.log(err.message);
    }
  }

  // Check if there's a file upload it
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Clear the error when refresh the page
  useEffect(() => {
    dispatch(resetError());
  }, []);

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* -------- Heading -------- */}
      <h1 className="text-3xl my-7 font-semibold text-center">Profile</h1>
      {/* -------- Form -------- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" name="imageFile" id="imageFile" hidden accept="image/*" ref={fileInputRef} onChange={handleFileChange}/>
        <img src={formData.photo} alt="Phoro" className="my-2 w-24 h-24 rounded-full object-cover cursor-pointer self-center" onClick={() => fileInputRef.current.click()}/>
        <p className="mb-2 text-sm self-center">
          {
            fileUploadError?.includes("Firebase Storage: User does not have permission") ? (
              <span className="text-red-700">Image must be less than 2Mb</span>
            ):( fileUploadError &&
              <span className="text-red-700">Error Image Upload : {fileUploadError}</span>
            )
          }
          {
            (filePerc > 0 && filePerc < 100 && !fileUploadError) ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ): (filePerc === 100 && !fileUploadError) ? (
              <span className="text-green-700">Image successfully uploaded!</span>
            ): (
              ""
            )
          }
        </p>
        <input type="text" name="username" id="username" placeholder="Username" defaultValue={user.username} onChange={handleChange} className="border p-3 rounded-lg" />
        <input type="email" name="email" id="email" placeholder="Email" defaultValue={user.email} onChange={handleChange} className="border p-3 rounded-lg" />
        <input type="password" name="password" id="password" placeholder="Password" onChange={handleChange} className="border p-3 rounded-lg" />
        <button type="submit" disabled={loading} className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link to={"/create-listing"} className="bg-green-700 text-white uppercase p-3 rounded-lg text-center hover:opacity-95">Create Listing</Link>
      </form>
      {/* -------- Buttons -------- */}
      <div className="flex justify-between items-center mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 hover:text-red-500 cursor-pointer text-lg">Delete acount</span>
        <span onClick={handleSignOut} className="text-red-700 hover:text-red-500 cursor-pointer text-lg">Sign out</span>
      </div>
      {/* ------ Update Info Error ------ */}
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {/* ------ Update Info Success ------ */}
      {updateSuccess ? <p className="text-green-700 mt-5">User updated successfully!</p> : ""}
      {/* ------ Show Listings Button ------ */}
      <button onClick={handleShowListings} className="capitalize text-green-700 hover:text-green-600 w-full my-6 font-semibold">Show Listings</button>
      {/* ------ Show Listings Error ------ */}
      {showListingsError && <p className="text-red-700 mt-5">{showListingsError}</p>}
      {/* ------ Show Listings Boxs ------ */}
      {
        userListings.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-center font-semibold text-slate-900 text-2xl my-3">Your Listings :</h2>
            {
              userListings.map(listing => (
                /* ------ Listing Box ------ */
                <div className="flex items-center justify-between border gap-6 border-slate-300 rounded-lg px-3" key={listing._id}>
                  {/* ------ Listing image ------ */}
                  <Link to={`listing/${listing._id}`}>
                    <img src={listing.imageURLs[0]} alt={listing.name} className="w-24 h-24 object-contain rounded-lg"/>
                  </Link>
                  {/* ------ Listing name ------ */}
                  <Link to={`listing/${listing._id}`} className="text-slate-700 text-lg font-semibold flex-1 truncate hover:underline underline-offset-4">{listing.name}</Link>
                  {/* ------ Listing manipulate ------ */}
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleDeleteListing(listing._id ? listing._id : "")} className="text-red-700 text-2xl">
                      <MdDelete />
                    </button>
                    <button className="text-green-700 text-2xl">
                      <MdEditDocument />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default Profile