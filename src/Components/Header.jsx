import React, { useState, useEffect } from "react"; // Importing React and useState for handling component state
import { FaMoon, FaSun } from "react-icons/fa"; // Importing components for dark/light mode toggle
import { AiOutlineSearch } from "react-icons/ai"; // Importing component for search button
import { useSelector, useDispatch } from "react-redux"; // Importing Redux hooks
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importing React Router hooks
import { signOutSuccess } from "../Redux/Slice/userSlice"; // Importing Redux action to handle sign-out
import { toggleTheme } from "../Redux/Slice/themeSlice"; // Importing the toggleTheme action for dark/light mode

const Header = () => {
  const path = useLocation().pathname; // Getting the current URL path for active link highlighting
  const dispatch = useDispatch(); // Getting the dispatch function from Redux
  const navigate = useNavigate(); // For navigation using React Router

  const { user } = useSelector((state) => state.user); // Accessing the current user from Redux state
  const { theme } = useSelector((state) => state.theme); // Accessing the current theme (light/dark) from Redux state

  const [search, setSearch] = useState(""); // State to manage the search input
  const [searchError, setSearchError] = useState(null); // State for handling search errors
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State to toggle mobile menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle the profile dropdown visibility

  useEffect(() => {
    document.addEventListener("click", closeDropdown); // Add listener to close dropdown on outside click
    return () => {
      document.removeEventListener("click", closeDropdown); // Cleanup listener
    };
  }, []);

  // Handle click for "Blogs" tab
  const handleBlogsClick = () => {
    if (!user) {
      alert("Please log in to see blogs."); // Show alert if not logged in
      navigate("/signin"); // Redirect to the sign-in page
    }
  };

  // Handle the change in the search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update input value
    setSearchError(null); // Clear error
  };

  // Handle the form submission for search
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent reload
    if (search.trim() === "") {
      setSearchError("Please enter a search term."); // Validate
      return;
    }
    setSearchError(null);
    navigate(`/blogs?search=${search}`); // Navigate with query
    setSearch(""); // Reset
    setMobileMenuOpen(false); // Close menu
  };

  // Toggle Profile Dropdown Visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  // Close the dropdown if clicked outside
  const closeDropdown = (e) => {
    if (!e.target.closest(".profile-dropdown")) {
      setIsDropdownOpen(false); // Close on outside click
    }
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen); // Open/close menu
  };

  return (
    <header className="bg-white text-black dark:bg-black dark:text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo and App name */}
        <Link
          to="/blogs"
          className="flex items-center space-x-2 text-xl font-semibold dark:text-white"
        >
          <span className="px-3 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white rounded-lg">
            Dev
          </span>
          <span>Hub</span>
        </Link>

        {/* Right section buttons */}
        <div className="flex items-center gap-2">
          {/* Theme toggle button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile dropdown or Sign In button */}
          {user ? (
            <div className="relative profile-dropdown">
              <button className="flex items-center" onClick={toggleDropdown}>
                <img
                  src={user.profilePicture}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full border-2 border-purple-600"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg z-20 dark:bg-gray-800 dark:border-gray-600">
                  <div className="p-4">
                    <span className="block text-sm">{user.username}</span>
                    <span className="block truncate text-sm font-medium">
                      {user.email}
                    </span>
                  </div>
                  <Link to="/dashboard?tab=profile">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                      Profile
                    </button>
                  </Link>
                  <div className="border-t border-gray-300 dark:border-gray-600"></div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/signin";
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin">
              <button className="py-2 px-4 bg-purple-600 text-white rounded-lg">
                Sign In
              </button>
            </Link>
          )}

          {/* Hamburger Menu for mobile */}
          <button
            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg lg:hidden"
            onClick={toggleMobileMenu}
          >
            Menu
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-6">
          <Link
            to="/about"
            className={`text-lg font-medium ${
              path === "/about"
                ? "text-purple-600"
                : "text-gray-800 dark:text-white"
            }`}
          >
            About
          </Link>
          <Link
            to="/blogs"
            className={`text-lg font-medium ${
              path === "/blogs"
                ? "text-purple-600"
                : "text-gray-800 dark:text-white"
            }`}
            onClick={handleBlogsClick}
          >
            Blogs
          </Link>
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Search Blogs..."
              className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={search}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              <AiOutlineSearch />
            </button>
          </form>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 mt-3 p-4 rounded-lg shadow-lg flex flex-col gap-3 z-20 lg:hidden">
            <Link
              to="/about"
              className={`text-lg font-medium ${
                path === "/about"
                  ? "text-purple-600"
                  : "text-gray-800 dark:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/blogs"
              className={`text-lg font-medium ${
                path === "/blogs"
                  ? "text-purple-600"
                  : "text-gray-800 dark:text-white"
              }`}
              onClick={() => {
                handleBlogsClick();
                setMobileMenuOpen(false);
              }}
            >
              Blogs
            </Link>
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search Blogs..."
                className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={search}
                onChange={handleSearchChange}
              />
              {searchError && (
                <div className="text-red-500 text-sm">{searchError}</div>
              )}
              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
