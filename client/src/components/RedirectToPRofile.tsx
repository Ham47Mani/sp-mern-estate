/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RedirectToPRofile = () => {
  const {currentUser} = useSelector((state: any) => state.user.user);

  return (
    currentUser ? <Navigate to={"/profile"}/> : <Outlet />
  )
}

export default RedirectToPRofile