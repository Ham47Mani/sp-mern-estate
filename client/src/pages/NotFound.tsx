import { useEffect } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate: NavigateFunction = useNavigate();// Create a navigate
  useEffect(() => {// Redirect to home page after 3 second
    setTimeout(() => {
      navigate("/")
    }, 3000);
  }, [navigate]);

  return (
    <div>
      This page NotFound
      <br />
      Redirect to home page after 3 second
    </div>
  )
}

export default NotFound