// Importing required libraries and hooks
import React, { useState, useEffect } from "react"; // React core and hooks
import { FaMoon, FaSun, FaBars } from "react-icons/fa"; // Theme toggle and hamburger menu icon
import { AiOutlineSearch } from "react-icons/ai"; // Search icon
import { useSelector, useDispatch } from "react-redux"; // Redux state management
import { Link, useNavigate, useLocation } from "react-router-dom"; // Routing
import { signOutSuccess } from "../Redux/Slice/userSlice"; // Redux slice for user
import { toggleTheme } from "../Redux/Slice/themeSlice"; // Redux slice for theme

const Header = () => {
  const path = useLocation().pathname; // Current route path
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // React Router navigation

  const { user } = useSelector((state) => state.user); // Get user from Redux
  const { theme } = useSelector((state) => state.theme); // Get theme from Redux

  const [search, setSearch] = useState(""); // Search input value
  const [searchError, setSearchError] = useState(null); // Error message for search
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // Toggle for mobile nav
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggle for profile dropdown

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Navigate to blogs with check for login
  const handleBlogsClick = () => {
    if (!user) {
      alert("Please log in to see blogs.");
      navigate("/signin");
    }
  };

  // Update search input value
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchError(null);
  };

  // Submit search form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      setSearchError("Please enter a search term.");
      return;
    }
    navigate(`/blogs?search=${search}`);
    setSearch("");
    setMobileMenuOpen(false);
  };

  // Toggle hamburger menu for mobile nav
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle user profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const iconButtonStyle =
    "p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white";

  return (
    <header className="relative bg-white text-black dark:bg-black dark:text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-y-4">
        {/* Logo section */}
        <Link
          to="/blogs"
          className="flex items-center space-x-2 text-xl font-semibold dark:text-white"
        >
          <span className="px-3 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white rounded-lg">
            Dev
          </span>
          <span>Hub</span>
        </Link>

        {/* Desktop nav links and search */}
        <div className="hidden lg:flex items-center space-x-6">
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
              className="ml-2 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white px-4 py-2 rounded-lg"
            >
              <AiOutlineSearch />
            </button>
          </form>
        </div>

        {/* Theme toggle, profile dropdown, hamburger icon */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className={iconButtonStyle}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile or sign in */}
          {user ? (
            <div className="relative profile-dropdown">
              <button onClick={toggleDropdown} className={iconButtonStyle}>
                <img
                  src={user.profilePicture}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
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
              <button className="py-2 px-4 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white rounded-lg">
                Sign In
              </button>
            </Link>
          )}

          {/* Hamburger icon for mobile menu */}
          <button
            onClick={toggleMobileMenu}
            className={iconButtonStyle + " lg:hidden"}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-30 bg-white dark:bg-gray-900 shadow-md rounded-b-lg p-4 flex flex-col gap-3 lg:hidden">
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
              className="bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 text-white py-2 px-4 rounded-lg"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
