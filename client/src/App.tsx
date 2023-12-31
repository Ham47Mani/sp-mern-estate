import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import PrivetRoute from "./components/PrivetRoute";
import RedirectToPRofile from "./components/RedirectToPRofile";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Layout/>}>
          <Route path="" index element={<Home />}/>
          <Route path="about" element={<About />} />
          <Route path="listing/:listingID" element={<Listing />} />
          <Route path="search/" element={<Search />} />
          {/* --- Protect the profile page --- */}
          <Route element={<PrivetRoute />} >
            <Route path="profile" element={<Profile />} />
            <Route path="create-listing" element={<CreateListing />} />
            <Route path="update-listing/:listingID" element={<UpdateListing />} />
          </Route>
          {/* --- Not allow user authenticate to go to SignIn|SignOut page --- */}
          <Route element={<RedirectToPRofile />} >
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;