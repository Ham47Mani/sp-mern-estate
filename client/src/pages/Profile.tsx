/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { USER } from "../utility/types";

const Profile = () => {
  const user: USER = useSelector((state: any) => state.user.user.currentUser[0]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* -------- Heading -------- */}
      <h1 className="text-3xl my-7 font-semibold text-center">Profile</h1>
      {/* -------- Form -------- */}
      <form className="flex flex-col gap-4">
        <img src={user.photo} alt="Phoro" className="mt-2 w-24 h-24 rounded-full object-cover cursor-pointer self-center"/>
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