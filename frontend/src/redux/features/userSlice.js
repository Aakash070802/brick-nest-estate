import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,

  authLoading: false, // login/register
  userLoading: false, // profile update
  globalLoading: false, // blocking UI
  listingLoading: false, // home/listings

  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // AUTH
    loginStart: (state) => {
      state.authLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.authLoading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.authLoading = false;
    },

    // USER UPDATE
    updateUserStart: (state) => {
      state.userLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.userLoading = false;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.userLoading = false;
    },

    // DELETE
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.userLoading = false;
      state.error = null;
    },

    // LOGOUT
    logOutUserSuccess: (state) => {
      state.currentUser = null;
      state.authLoading = false;
      state.error = null;
    },

    // GLOBAL LOADER
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    // FAVORITES (SAFE)
    toggleFavoriteLocal: (state, action) => {
      if (!state.currentUser) return;

      const listingId = action.payload;
      const favorites = state.currentUser.favorites || [];

      const exists = favorites.some(
        (fav) => fav.toString() === listingId.toString(),
      );

      if (exists) {
        state.currentUser.favorites = favorites.filter(
          (fav) => fav.toString() !== listingId.toString(),
        );
      } else {
        state.currentUser.favorites = [...favorites, listingId];
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  logOutUserSuccess,
  setGlobalLoading,
  toggleFavoriteLocal,
} = userSlice.actions;

export default userSlice.reducer;
