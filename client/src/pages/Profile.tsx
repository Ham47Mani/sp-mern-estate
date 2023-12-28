/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { USER } from "../utility/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { StorageReference, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../utility/firebaseConfig";

const Profile = () => {
  const user: USER = useSelector((state: any) => state.user.user.currentUser[0]);
  const fileInputRef = useRef<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState<number>(0);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<USER>(user);
  
  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  // Handle file upload
  const handleFileUpload = (image: File) => {
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
      <form className="flex flex-col gap-4">
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
        <input type="text" name="username" id="username" placeholder="Username" className="border p-3 rounded-lg" />
        <input type="email" name="email" id="email" placeholder="Email" className="border p-3 rounded-lg" />
        <input type="password" name="password" id="password" placeholder="Password" className="border p-3 rounded-lg" />
        <button className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      {/* -------- Form -------- */}
      <div className="flex justify-between items-center mt-5">
        <span className="text-red-700 hover:text-red-500 cursor-pointer text-lg">Delete acount</span>
        <span className="text-red-700 hover:text-red-500 cursor-pointer text-lg">Sign out</span>
      </div>
    </div>
  )
}

export default Profile