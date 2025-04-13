import React, { useEffect, useState } from "react"; // Import React and hooks for component lifecycle
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react"; // Import Flowbite components for Sidebar
import {
  HiArrowSmRight,
  HiDocument,
  HiDocumentAdd,
  HiUser,
} from "react-icons/hi"; // Import icons from react-icons
import { Link, useLocation } from "react-router-dom"; // Import router functions to handle routing
import { useDispatch } from "react-redux"; // Import dispatch to interact with Redux store
import { signOutSuccess } from "../Redux/Slice/userSlice"; // Import action for user sign-out from Redux slice
import { useSelector } from "react-redux"; // Import selector to get state from Redux store

// Sidebar component for user dashboard with links for profile, create post, and sign out
const DashoboardSidebar = () => {
  // Get user state from Redux store
  const { user } = useSelector((state) => state.user);
  // Initialize location and dispatch hooks
  const location = useLocation();
  const dispatch = useDispatch();

  // State to track the active tab (profile or create-post)
  const [tab, setTab] = useState("");

  // Effect hook to update active tab based on URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Parse URL parameters
    const tabUrl = urlParams.get("tab"); // Get 'tab' parameter from URL
    if (tabUrl) {
      setTab(tabUrl); // Set the active tab based on URL
    } else {
      setTab("profile"); // Default tab is 'profile'
    }
  }, [location.search]); // Re-run effect when location.search changes

  return (
    // Sidebar container component with styling for dark and light themes
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example" // Aria label for accessibility
      className="h-screen w-64 bg-white text-black dark:bg-gray-900 dark:text-white"
    >
      <SidebarItems className="flex flex-col gap-2">
        <SidebarItemGroup className="flex flex-col gap-2">
          {/* Profile section */}
          <SidebarItem
            as={Link}
            to="/dashboard?tab=profile" // Link to Profile tab
            active={tab === "profile"} // Make the item active when 'profile' tab is selected
            icon={HiUser} // Profile icon
            className="cursor-pointer dark:hover:bg-gray-700 dark:text-white"
            label={user.isAdmin ? "Admin" : "User"} // Display 'Admin' or 'User' based on the user role
            labelColor="dark" // Set the label color to dark
          >
            Profile
          </SidebarItem>

          {/* Conditional link to Create Post page, only shown for admins */}
          {user.isAdmin && (
            <SidebarItem
              as={Link}
              to="/create-post"
              active={tab === "create-post"}
              icon={HiDocumentAdd} // Icon for Create Post
              className="cursor-pointer dark:hover:bg-gray-700 dark:text-white"
            >
              Create Post
            </SidebarItem>
          )}

          {/* Sign Out button */}
          <SidebarItem
            icon={HiArrowSmRight} // Sign-out icon
            className="cursor-pointer dark:hover:bg-gray-700 dark:text-white"
            onClick={() => {
              dispatch(signOutSuccess()); // Dispatch sign-out action
              localStorage.removeItem("token"); // Remove token from localStorage
              window.location.href = "/signin"; // Redirect to sign-in page
            }}
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default DashoboardSidebar;
