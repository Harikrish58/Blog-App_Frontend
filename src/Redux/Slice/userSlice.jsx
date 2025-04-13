import { createSlice } from "@reduxjs/toolkit";

// Initial state: Contains user data, loading state, and any error messages.
const initialState = {
  user: null, // Holds user data (null until user is signed in)
  error: null, // Stores any errors related to user actions (e.g., sign-in failure)
  loading: false, // Tracks whether an async action is in progress
};

// Creating slice for user management (sign-in, update, sign-out, delete)
const userSlice = createSlice({
  name: "user", // Slice name for user state management
  initialState, // Initial state setup
  reducers: {
    // Action to set loading state to true and reset error
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for successful sign-in, stores user data and clears error
    signInSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload; // Action payload contains user data
      state.error = null;
    },
    // Action for failed sign-in, sets error and resets loading state
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Action payload contains error message
    },
    // Action to set loading state to true and reset error during update
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for successful update, updates user data and clears error
    updateSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload; // Action payload contains updated user data
      state.error = null;
    },
    // Action for failed update, sets error and resets loading state
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Action payload contains error message
    },
    // Action for successful sign-out, clears user data and error
    signOutSuccess: (state) => {
      state.user = null;
      state.error = null;
    },
    // Action to set loading state to true and reset error during delete
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for successful deletion, clears user data and resets error
    deleteSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    // Action for failed deletion, sets error and resets loading state
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Action payload contains error message
    },
  },
});

// Exporting the actions for use in components
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

// Exporting the reducer to be used in the store
export default userSlice.reducer;
