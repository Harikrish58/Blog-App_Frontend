import { createSlice } from "@reduxjs/toolkit";

// Initial state for theme (dark/light), using localStorage to persist user preference
const initialState = {
  theme: localStorage.getItem("theme") || "light",
};

// Redux slice to manage theme toggling (light ↔ dark)
const themeSlice = createSlice({
  name: "theme", // Name of the slice
  initialState, // Initial theme state
  reducers: {
    // Reducer to toggle theme mode
    toggleTheme: (state) => {
      // Toggle theme value
      state.theme = state.theme === "light" ? "dark" : "light";

      // Persist theme in localStorage
      localStorage.setItem("theme", state.theme);
    },
  },
});

// Export action to use in components
export const { toggleTheme } = themeSlice.actions;

// Export reducer to add to the Redux store
export default themeSlice.reducer;
