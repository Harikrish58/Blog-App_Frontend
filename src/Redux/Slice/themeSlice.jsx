import { createSlice } from "@reduxjs/toolkit";

// Initial state: Sets the initial theme from localStorage or defaults to "light"
const initialState = {
  theme: localStorage.getItem("theme") || "light", // Stores the user's theme preference (light or dark)
};

// Creating slice for theme management (Redux Toolkit)
const themeSlice = createSlice({
  name: "theme", // Slice name
  initialState, // Initial state for theme (light/dark)
  reducers: {
    // Action to toggle between light and dark theme
    toggleTheme: (state) => {
      // Switches theme between light and dark, stores the new theme in localStorage
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme); // Store the current theme in localStorage
    },
  },
});

// Export the action created by createSlice (toggleTheme)
export const { toggleTheme } = themeSlice.actions;

// Export the reducer for use in the store
export default themeSlice.reducer;
