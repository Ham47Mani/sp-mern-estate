/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { resetError, signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import OAuth from "../components/OAuth";

// Interface of user inputs data
interface FORMDATA {
  email: string,
  password: string
}

const SignIn = () => {
  const [formInputs, setFormInputs] = useState<FORMDATA>({email: "", password: ""});
  // Navigate to forward
  const navigate:NavigateFunction = useNavigate();
  // Use redux
  const dispatch:Dispatch = useDispatch();
  const {error, loading} = useSelector((state: any) => state.user.user);
  
  useEffect(() => {
    dispatch(resetError());// Reset Error when reload page
  }, [dispatch]);
  
  //- Handle change input value
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormInputs({
      ...formInputs,
      [id]: value
    })
  }
  // Handle submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      // Send a request
      const res = await fetch("/api/auth/sigin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formInputs)
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.data));
      navigate('/');
    } catch (err: any) {
      dispatch(signInFailure(err.message));
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* ------ Title ------ */}
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      {/* ------ Form ------ */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" placeholder="Email" className="border p-3 rounded-lg" onChange={handleChange}/>
        <input type="password" name="password" id="password" placeholder="Password" className="border p-3 rounded-lg" onChange={handleChange}/>
        <button type="submit" disabled={loading} className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      {/* ------ Link to sign in ------ */}
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up" className="text-blue-700">Sign up</Link>
      </div>
      {/* ------ Error ------ */}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default SignIn