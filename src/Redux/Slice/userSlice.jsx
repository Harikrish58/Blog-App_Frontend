import { createSlice } from "@reduxjs/toolkit";

// Initial state for user management: user data, loading state, and error messages
const initialState = {
  user: null,     // Holds logged-in user data
  error: null,    // Stores any error message related to user actions
  loading: false, // Indicates if an async operation is in progress
};

// Redux slice for managing user authentication and profile actions
const userSlice = createSlice({
  name: "user", // Name of the slice
  initialState, // Default state
  reducers: {
    // ===== Sign In Actions =====
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Update User Actions =====
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Sign Out Action =====
    signOutSuccess: (state) => {
      state.user = null;
      state.error = null;
    },

    // ===== Delete User Actions =====
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Exporting Redux actions for use in components
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  signOutSuccess,
  deleteStart,
  deleteSuccess,
  deleteFailure,
} = userSlice.actions;

// Exporting reducer to be added to the Redux store
export default userSlice.reducer;
