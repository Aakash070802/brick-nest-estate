import api from "./api";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

// LOGIN
export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};

// REGISTER
export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
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
      photo: result.user.photoURL,
    });

    return res.data;
  } catch (error) {
    // normalize error
    throw {
      message:
        error.code === "auth/popup-closed-by-user"
          ? "Google login cancelled"
          : "Google login failed",
    };
  }
};
