import { useEffect } from "react";
import { useSelector } from "react-redux";

// ThemeProvider component to manage dark/light mode based on Redux state
const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme); // Get the current theme from Redux

  useEffect(() => {
    // Update the <html> element's class to reflect the current theme (dark or light)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]); // Re-run the effect whenever the theme state changes

  return children; // Render the children (wrapped components) with the applied theme
};

export default ThemeProvider;
