import Home from "../containers/Home";
import About from "../containers/About";
import Contact from "../containers/Contact";

import Login from "../containers/auth/Login";
import Register from "../containers/auth/Register";

import Profile from "../containers/user/Profile";

import ViewMyListing from "../containers/listing/ViewMyListing";
import UpdateListingForm from "../components/listing/UpdateListingForm";
import DeleteListingModal from "../components/listing/DeleteListingModal";
import CreateListingForm from "../components/listing/CreateListingForm";
import PropertyDetails from "../containers/PropertyDetails";
import Favorites from "../containers/Favorites";

import Search from "../containers/Search";

import PrivateRoute from "../components/common/PrivateRoute";
import Layout from "../components/layout/Layout";

import NotFound from "../components/common/NotFound";

export const routes = [
  {
    element: <Layout />,
    children: [
      // PUBLIC ROUTES
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/search", element: <Search /> },
      { path: "/listing/:id", element: <PropertyDetails /> },

      // AUTH ROUTES
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      // PROTECTED ROUTES
      {
        element: <PrivateRoute />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/favorites", element: <Favorites /> },
          { path: "/view-my-lists", element: <ViewMyListing /> },
          { path: "/create-listing", element: <CreateListingForm /> },
          {
            path: "/update-listing/:listingId",
            element: <UpdateListingForm />,
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
];
