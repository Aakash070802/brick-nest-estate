import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // AUTH
    loginStart: (state) => {
      ((state.loading = true), (state.error = null));
    },
    loginSuccess: (state, action) => {
      ((state.currentUser = action.payload), (state.loading = false));
    },
    loginFailure: (state, action) => {
      ((state.error = action.payload), (state.loading = false));
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
} = userSlice.actions;

export default userSlice.reducer;
