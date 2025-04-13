import React, { useState } from "react"; // Importing React and useState for handling component state
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react"; // Importing Flowbite components
import { FaMoon, FaSun } from "react-icons/fa"; // Importing icons for dark/light mode toggle
import { AiOutlineSearch } from "react-icons/ai"; // Importing search icon
import { useSelector, useDispatch } from "react-redux"; // Importing Redux hooks
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importing React Router hooks
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

  // Toggle mobile search visibility
  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!isMobileSearchOpen);
    setSearch(""); // Clear search input when toggling search visibility
    setSearchError(null); // Clear search error
  };

  return (
    <Navbar className="border-b-2 bg-white text-black dark:bg-black dark:text-white">
      {/* Logo and App name */}
      <Link
        to="/blogs"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 rounded-lg text-white">
          Dev
        </span>
        Hub
      </Link>

      {/* Mobile search button */}
      <div className="lg:hidden flex items-center gap-2">
        <Button
          className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 ${isMobileSearchOpen ? "hidden" : ""}`}
          onClick={handleMobileSearchToggle}
        >
          <AiOutlineSearch />
        </Button>

        {/* Mobile search input */}
        <form
          onSubmit={handleSearchSubmit}
          className={`${isMobileSearchOpen ? "flex" : "hidden"} items-center gap-2 w-full`}
        >
          <div className="relative w-full">
            <TextInput
              type="text"
              placeholder="Search Blogs...."
              rightIcon={AiOutlineSearch}
              className="pr-10"
              value={search}
              onChange={handleSearchChange}
              autoFocus
            />
            {searchError && (
              <div className="text-red-500 text-sm mt-2">{searchError}</div>
            )}
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Desktop search form */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden lg:flex items-center"
      >
        <div className="relative w-96">
          <TextInput
            type="text"
            placeholder="Search Blogs...."
            rightIcon={AiOutlineSearch}
            className="pr-10"
            value={search}
            onChange={handleSearchChange}
          />
          {searchError && (
            <div className="text-red-500 text-sm mt-2">{searchError}</div>
          )}
        </div>
        <Button
          type="submit"
          className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800"
        >
          Search
        </Button>
      </form>

      {/* User Profile and Sign Out buttons */}
      <div className="flex gap-2 md:order-2">
        {/* Theme Toggle Button */}
        <Button
          className="hidden sm:inline bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800"
          onClick={() => dispatch(toggleTheme())} // Toggle theme on button click
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}{" "}
          {/* Display Sun icon for dark mode and Moon for light mode */}
        </Button>

        {user ? (
          // Dropdown for logged-in users with profile options
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={user.profilePicture} rounded />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user.username}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </DropdownHeader>
            <Link to="/dashboard?tab=profile">
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem
              onClick={() => {
                dispatch(signOutSuccess()); // Dispatch the sign out action
                localStorage.removeItem("token");
                window.location.href = "/signin"; // Redirect to sign in page
              }}
            >
              Sign Out
            </DropdownItem>
          </Dropdown>
        ) : (
          // If user is not logged in, show Sign In button
          <Link to="/signin">
            <Button>Sign In</Button>
          </Link>
        )}

        <NavbarToggle />
      </div>

      {/* Navbar Links */}
      <NavbarCollapse>
        <NavbarLink active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </NavbarLink>
        <NavbarLink active={path === "/blogs"} as={"div"}>
          <Link to="/blogs">Blogs</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
