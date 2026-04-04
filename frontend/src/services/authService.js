import api from "./api";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

const handleError = (error) => {
  const message =
    error?.response?.data?.message || // -> backend message
    error?.message ||
    "Something went wrong";

  throw new Error(message);
};

// LOGIN
export const loginUser = async (formData) => {
  try {
    const res = await api.post("/auth/login", formData);
    return res.data;
  } catch (error) {
    // console.log("BACKEND ERROR:", error.response?.data);
    handleError(error);
  }
};

// REGISTER
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/auth/register", formData);
    return res.data;
  } catch (error) {
    // console.log("BACKEND ERROR:", error.response?.data);
    handleError(error);
  }
};

// GOOGLE LOGIN
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);

    const res = await api.post("/auth/google", {
      name: result.user.displayName,
      email: result.user.email,
    });

    return res.data;
  } catch (error) {
    throw {
      message:
        error.code === "auth/popup-closed-by-user"
          ? "Google login cancelled"
          : "Google login failed",
    };
  }
};
