/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { USER } from "../utility/types";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { StorageReference, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utility/firebaseConfig";
import { Dispatch } from "@reduxjs/toolkit";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, resetError, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";

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
  // Check if there's a file upload it
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);
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
      </form>
      {/* -------- Form -------- */}
      <div className="flex justify-between items-center mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 hover:text-red-500 cursor-pointer text-lg">Delete acount</span>
        <span className="text-red-700 hover:text-red-500 cursor-pointer text-lg">Sign out</span>
      </div>
      {/* ------ Error ------ */}
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {/* ------ Success ------ */}
      {updateSuccess ? <p className="text-green-700 mt-5">User updated successfully!</p> : ""}
    </div>
  )
}

export default Profile