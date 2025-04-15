// ThemeProvider.jsx
// Global theme provider to apply dark or light mode to the application

import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  // Access the current theme ('dark' or 'light') from Redux state
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    // Add or remove the 'dark' class from <html> based on current theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Render all wrapped children inside this provider
  return children;
};

export default ThemeProvider;
