import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { logOutUserSuccess } from "../../redux/features/userSlice";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await api.get("/user/me"); // backend validation
        setIsValid(true);
      } catch (err) {
        // token invalid / session invalid
        dispatch(logOutUserSuccess());
        setIsValid(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, []);

  // ⏳ loading state (important)
  if (checkingAuth) {
    return <div>Checking authentication...</div>;
  }

  return isValid && currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
