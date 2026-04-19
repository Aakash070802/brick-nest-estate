import api from "./api";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

const handleError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Something went wrong";

  throw new Error(message);
};

// LOGIN
export const loginUser = async (formData) => {
  try {
    const res = await api.post("/auth/login", formData, {
      _skipLoader: true, // IMPORTANT
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// REGISTER
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/auth/register", formData, {
      _skipLoader: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// GOOGLE LOGIN
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);

    const res = await api.post(
      "/auth/google",
      {
        name: result.user.displayName,
        email: result.user.email,
      },
      {
        _skipLoader: true,
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(
      error.code === "auth/popup-closed-by-user"
        ? "Google login cancelled"
        : "Google login failed",
    );
  }
};

// LOGOUT (blocking → keep loader)
export const logoutCurrentDevice = async () => {
  try {
    const res = await api.get("/auth/logout");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// LOGOUT ALL (blocking)
export const logoutAllDevices = async () => {
  try {
    const res = await api.get("/auth/logout-all");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// REQUEST OTP FOR RESTORE
export const requestRestore = async (email) => {
  try {
    const res = await api.post(
      "/auth/request-restore-account",
      { email },
      { _skipLoader: true },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// VERIFY OTP FOR RESTORE
export const verifyRestore = async (email, otp) => {
  try {
    const res = await api.post(
      "/auth/verify-restore-account",
      { email, otp },
      { _skipLoader: true },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// REQUEST OTP RESET PASSWORD
export const forgotPasswordRequest = async (email) => {
  try {
    const res = await api.post(
      "/auth/forgot-password",
      { email },
      { _skipLoader: true },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// VERIFY OTP RESET PASSWORD
export const verifyForgotOtp = async (email, otp) => {
  try {
    const res = await api.post(
      "/auth/verify-forgot-password",
      { email, otp },
      { _skipLoader: true },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// RESET PASSWORD
export const resetPassword = async (email, newPassword) => {
  try {
    const res = await api.post(
      "/auth/reset-password",
      { email, newPassword },
      { _skipLoader: true },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
