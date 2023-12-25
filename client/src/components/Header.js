"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fa_1 = require("react-icons/fa");
const react_router_dom_1 = require("react-router-dom");
const Header = () => {
    return (<header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* -------- Logo -------- */}
        <react_router_dom_1.Link to="/" className="flex gap-1 items-center">
          <img className="w-8 h-8" src="/public/logo.png" alt="Logo"/>
          <h1 className="font-bold text-xs flex flex-col uppercase">
            <span className="text-slate-500">Spaider</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </react_router_dom_1.Link>
        {/* -------- Search Bar -------- */}
        <form className="bg-slate-100 py-1 px-3 rounded-lg flex items-center">
          <input type="text" name="search" placeholder="Search..." className="bg-transparent focus:outline-none w-32 sm:w-64 lg:w-80"/>
          <fa_1.FaSearch className="text-slate-600 cursor-pointer"/>
        </form>
        {/* -------- Menu -------- */}
        <div className="flex gap-4">
          <react_router_dom_1.NavLink to="/" className="hidden md:inline text-slate-700 hover:underline underline-offset-[22px]">Home</react_router_dom_1.NavLink>
          <react_router_dom_1.NavLink to="/about" className="hidden md:inline text-slate-700 hover:underline underline-offset-[22px]">About</react_router_dom_1.NavLink>
          <react_router_dom_1.Link to="/sign-in" className="text-slate-700 hover:underline underline-offset-[22px]">Sign in</react_router_dom_1.Link>
        </div>
      </div>
    </header>);
};
exports.default = Header;
