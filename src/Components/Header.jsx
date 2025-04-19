import React, { useState, useEffect } from "react"; // Importing React and useState for managing component state
import { FaMoon, FaSun } from "react-icons/fa"; // Importing components for dark/light mode toggle
import { AiOutlineSearch } from "react-icons/ai"; // Importing component for search button
import { useSelector, useDispatch } from "react-redux"; // Importing hooks to interact with Redux
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importing hooks for routing
import { signOutSuccess } from "../Redux/Slice/userSlice"; // Importing action for signing out
import { toggleTheme } from "../Redux/Slice/themeSlice"; // Importing action to toggle light/dark theme

const Header = () => {
  const path = useLocation().pathname; // Getting current route path
  const dispatch = useDispatch(); // Dispatching Redux actions
  const navigate = useNavigate(); // Navigation using React Router

  const { user } = useSelector((state) => state.user); // Getting current user from Redux state
  const { theme } = useSelector((state) => state.theme); // Getting current theme from Redux state

  const [search, setSearch] = useState(""); // State for search input
  const [searchError, setSearchError] = useState(null); // State to show error when search is empty
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false); // Toggling mobile search field
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Checking if user is logged in
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggling profile dropdown

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check token in localStorage
    if (!token) {
      setIsLoggedIn(false); // If no token, user is not logged in
    }
  }, []);

  // Redirect to sign-in page if user tries to access blogs without logging in
  const handleBlogsClick = () => {
    if (!user) {
      alert("Please log in to see blogs."); // Show alert if user not logged in
      navigate("/signin"); // Redirect to sign-in page
    }
  };

  // Update search input value
  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search state
    setSearchError(null); // Clear any error
  };

  // Submit search form
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (search.trim() === "") {
      setSearchError("Please enter a search term."); // Show error if empty
      return;
    }
    navigate(`/blogs?search=${search}`); // Navigate to blogs page with search query
    setSearch(""); // Clear input
    setMobileSearchOpen(false); // Close mobile search field
  };

  // Toggle mobile search field
  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!isMobileSearchOpen); // Open or close the search field
    setSearch(""); // Clear search input
    setSearchError(null); // Clear any error
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Open or close dropdown
  };

  // Close dropdown when clicked outside
  const closeDropdown = (e) => {
    if (!e.target.closest(".profile-dropdown")) {
      setIsDropdownOpen(false); // Close dropdown if click outside
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown); // Listen for outside clicks
    return () => {
      document.removeEventListener("click", closeDropdown); // Cleanup
    };
  }, []);

  return (
    <header className="bg-white text-black dark:bg-black dark:text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
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

        {/* Navigation links */}
        <div className="hidden md:flex space-x-6">
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

        {/* Mobile search toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className={`${
              isMobileSearchOpen ? "hidden" : ""
            } bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg`}
            onClick={handleMobileSearchToggle}
          >
            <AiOutlineSearch />
          </button>

          {/* Mobile search input */}
          <form
            onSubmit={handleSearchSubmit}
            className={`${
              isMobileSearchOpen ? "flex" : "hidden"
            } items-center gap-2 w-full`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Blogs...."
                className="pr-10 text-black dark:text-white border border-gray-300 rounded-lg py-2 px-3 w-full dark:bg-gray-800"
                value={search}
                onChange={handleSearchChange}
                autoFocus
              />
              {searchError && (
                <div className="text-red-500 text-sm mt-2">{searchError}</div>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search form (desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center w-1/3"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Blogs...."
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

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Theme toggle button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg"
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
              <button className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l rounded-lg">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
