import Home from "../containers/Home";
import About from "../containers/About";
import Contact from "../containers/Contact";

import Login from "../containers/auth/Login";
import Register from "../containers/auth/Register";

import Profile from "../containers/user/Profile";

import Listing from "../containers/listing/Listing";
import CreateListing from "../containers/listing/CreateListing";
import UpdateListing from "../containers/listing/UpdateListing";

import Search from "../containers/Search";

import PrivateRoute from "../components/common/PrivateRoute";
import Layout from "../components/layout/Layout";

export const routes = [
  {
    element: <Layout />,
    children: [
      // PUBLIC
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
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
