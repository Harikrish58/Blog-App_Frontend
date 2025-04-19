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
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false); // State to toggle mobile search visibility
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State to toggle mobile menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle the profile dropdown visibility
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Add state to check if the user is logged in

  useEffect(() => {
    const token = localStorage.getItem("token"); // Checking token to verify if user is logged in
    if (!token) {
      setIsLoggedIn(false); // Set logged in state
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeDropdown); // Close dropdown when clicking outside
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  // Handle click for "Blogs" tab
  const handleBlogsClick = () => {
    if (!user) {
      alert("Please log in to see blogs."); // Show alert if not logged in
      navigate("/signin"); // Redirect to sign-in page
    }
  };

  // Handle the change in the search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search input state
    setSearchError(null); // Clear error message
  };

  // Handle the form submission for search
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form reload
    if (search.trim() === "") {
      setSearchError("Please enter a search term."); // Set error if empty
      return;
    }
    navigate(`/blogs?search=${search}`); // Redirect to search result
    setSearch(""); // Clear search input
    setMobileSearchOpen(false); // Close mobile search
  };

  // Toggle mobile search input
  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!isMobileSearchOpen); // Toggle mobile search
    setSearch(""); // Clear input
    setSearchError(null); // Clear error
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown
  };

  // Close dropdown on outside click
  const closeDropdown = (e) => {
    if (!e.target.closest(".profile-dropdown")) {
      setIsDropdownOpen(false); // Close dropdown
    }
  };

  // Toggle mobile nav menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen); // Toggle menu visibility
  };

  return (
    <header className="bg-white text-black dark:bg-black dark:text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <Link
          to="/blogs"
          className="flex items-center space-x-2 text-xl font-semibold dark:text-white"
        >
          <span className="px-3 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white rounded-lg">
            Dev
          </span>
          <span>Hub</span>
        </Link>

        {/* Hamburger menu (visible only on mobile) */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="px-3 py-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
          >
            Menu
          </button>
        </div>

        {/* Desktop Nav Links */}
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
        </div>

        {/* Desktop search form */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center w-1/3"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Blogs..."
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={search}
              onChange={handleSearchChange}
            />
            {searchError && (
              <div className="text-red-500 text-sm mt-2">{searchError}</div>
            )}
          </div>
          <button
            type="submit"
            className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg"
          >
            <AiOutlineSearch />
          </button>
        </form>

        {/* Right-side buttons */}
        <div className="flex items-center gap-2 ml-4">
          {/* Mobile search toggle */}
          <div className="block md:hidden">
            <button
              className="px-3 py-2 bg-purple-600 text-white rounded-lg"
              onClick={handleMobileSearchToggle}
            >
              Search
            </button>
          </div>

          {/* Theme toggle button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile/Sign In button */}
          {user ? (
            <div className="relative profile-dropdown">
              <button className="flex items-center" onClick={toggleDropdown}>
                <img
                  src={user.profilePicture}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg z-10 dark:bg-gray-800 dark:border-gray-600">
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
        </div>

        {/* Mobile search form (below nav) */}
        <div className="w-full mt-2 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className={`${
              isMobileSearchOpen ? "flex" : "hidden"
            } flex-col gap-2`}
          >
            <input
              type="text"
              placeholder="Search Blogs..."
              className="text-black dark:text-white border border-gray-300 rounded-lg py-2 px-3 w-full dark:bg-gray-800"
              value={search}
              onChange={handleSearchChange}
              autoFocus
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

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 mt-2 px-4 py-3 rounded-lg shadow-lg flex flex-col gap-3 lg:hidden z-20">
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
