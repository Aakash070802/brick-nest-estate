import Home from "../pages/Home";
import About from "../pages/About";
import CreateListing from "../pages/CreateListing";
import Listing from "../pages/Listing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
import UpdateListing from "../pages/UpdateListing";
import PrivateRoute from "../components/PrivateRoute";
import Layout from "../components/Layout";

export const routes = [
  {
    element: <Layout />,
    children: [
      // PUBLIC
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/search", element: <Search /> },
      { path: "/listing/:listingId", element: <Listing /> },

      // PROTECTED
      {
        element: <PrivateRoute />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/create-listing", element: <CreateListing /> },
          { path: "/update-listing/:listingId", element: <UpdateListing /> },
        ],
      },
    ],
  },
];
