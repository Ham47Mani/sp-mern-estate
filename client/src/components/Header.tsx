/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {FaSearch} from "react-icons/fa"
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom"

const Header = () => {
  const {currentUser} = useSelector((state: any) => state.user.user);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* -------- Logo -------- */}
        <Link to="/" className="flex gap-1 items-center">
          <img className="w-8 h-8" src="/logo.png" alt="Logo" />
          <h1 className="font-bold text-xs flex flex-col uppercase">
            <span className="text-slate-500">Spaider</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        {/* -------- Search Bar -------- */}
        <form className="bg-slate-100 py-1 px-3 rounded-lg flex items-center">
          <input type="text" name="search" placeholder="Search..." className="bg-transparent focus:outline-none w-32 sm:w-64 lg:w-80"/>
          <FaSearch className="text-slate-600 cursor-pointer" />
        </form>
        {/* -------- Menu -------- */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className="hidden md:inline text-slate-700 hover:underline underline-offset-[22px]">Home</NavLink>
          <NavLink to="/about" className="hidden md:inline text-slate-700 hover:underline underline-offset-[22px]">About</NavLink>
          <Link to="/profile" className="text-slate-700 hover:underline underline-offset-[22px]">
            {
              currentUser ? (
                <img src={currentUser[0].photo} alt="Photo" className="w-7 h-7 rounded-full object-cover" />
              ):(
                <span className="text-slate-700 hover:underline underline-offset-[22px]">Sign in</span>
              )
            }
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header