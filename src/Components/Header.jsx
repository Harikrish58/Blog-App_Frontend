import React, { useState, useEffect } from "react"; // Importing React and useState for handling component state
import { FaMoon, FaSun } from "react-icons/fa"; // Importing icons for dark/light mode toggle
import { AiOutlineSearch } from "react-icons/ai"; // Importing search icon
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
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Add state to check if the user is logged in

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Handle click for "Blogs" tab
  const handleBlogsClick = () => {
    if (!user) {
      // If the user is not logged in, show an alert or message and redirect them to sign in page
      alert("Please log in to see blogs.");
      navigate("/signin"); // Redirect to the sign-in page
    }
  };

  // Handle the change in the search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchError(null); // Reset search error on input change
  };

  // Handle the form submission for search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      setSearchError("Please enter a search term.");
      return;
    }
    setSearchError(null);
    navigate(`/blogs?search=${search}`); // Navigate to the blogs page with search query
    setSearch(""); // Reset search input
    setMobileSearchOpen(false); // Close the mobile search input if open
  };

  // Mobile Search Toggle
  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!isMobileSearchOpen);
    setSearch(""); // Clear search input when toggling search visibility
    setSearchError(null); // Clear search error
  };

  return (
    <header className="bg-white text-black dark:bg-black dark:text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
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

        {/* Links: About, Blogs */}
        <div className="flex space-x-6">
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
            onClick={handleBlogsClick} // Handle click for Blogs
          >
            Blogs
          </Link>
        </div>

        {/* Mobile Search Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className={`${
              isMobileSearchOpen ? "hidden" : ""
            } bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800`}
            onClick={handleMobileSearchToggle}
          >
            <AiOutlineSearch />
          </button>

          {/* Mobile Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className={`${isMobileSearchOpen ? "flex" : "hidden"} items-center gap-2 w-full`}
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

        {/* Desktop Search Form */}
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

        {/* Right-side buttons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => dispatch(toggleTheme())} // Toggle theme on button click
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}{" "}
            {/* Display Sun for dark mode and Moon for light mode */}
          </button>

          {/* Profile/Sign In Button */}
          {user ? (
            <div className="relative">
              <button className="flex items-center">
                <img
                  src={user.profilePicture}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </button>
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
                    window.location.href = "/signin"; // Redirect to sign-in page
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
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
