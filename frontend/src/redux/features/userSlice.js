import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  globalLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // AUTH
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // UPDATE
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // DELETE
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    // LOGOUT
    logOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    toggleFavoriteLocal: (state, action) => {
      if (!state.currentUser) return;

      const listingId = action.payload;

      const exists = state.currentUser.favorites.some(
        (fav) => fav.toString() === listingId.toString(),
      );

      if (exists) {
        state.currentUser.favorites = state.currentUser.favorites.filter(
          (fav) => fav.toString() !== listingId.toString(),
        );
      } else {
        state.currentUser.favorites.push(listingId);
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
