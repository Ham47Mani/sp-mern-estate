/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivetRoute = () => {
  const {currentUser} = useSelector((state: any) => state.user.user);

  return (
    currentUser ? <Outlet /> : <Navigate to={"/sign-in"}/>
  )
}

export default PrivetRoute