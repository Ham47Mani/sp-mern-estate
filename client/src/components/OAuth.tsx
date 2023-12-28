/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, UserCredential, signInWithPopup } from "firebase/auth";
import { auth } from "../utility/firebaseConfig";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Dispatch } from "@reduxjs/toolkit";

const OAuth = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  
  // Handle Google click
  const handleGoogleClick = async () => {
    try {
      // Sign in with google using firebase and get info
      const provider: GoogleAuthProvider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);      
      // Register user info in mongodb
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
      });
      const data = await res.json();
      dispatch(signInSuccess(data.data));
      navigate('/');
    } catch (err: any) {
      console.log("Could not sign in with google", err.message);
    }
  }
  return (
    <button type="button" onClick={handleGoogleClick} className="bg-red-700 p-3 text-white rounded-lg uppercase hover:opacity-95">Continue with google</button>
  )
}

export default OAuth