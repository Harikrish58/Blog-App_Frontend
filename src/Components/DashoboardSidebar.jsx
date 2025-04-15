// DashboardSidebar.jsx
// React component for displaying sidebar in the dashboard
// Shows profile link, create post (for admins), and sign out

import React, { useEffect, useState } from "react";
import { HiArrowSmRight, HiDocumentAdd, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../Redux/Slice/userSlice";

const DashboardSidebar = () => {
  // Access user from Redux state
  const { user } = useSelector((state) => state.user);

  // React Router location hook
  const location = useLocation();

  // Redux dispatch
  const dispatch = useDispatch();

  // Track the current active tab
  const [tab, setTab] = useState("");

  // Extract tab from URL and set it on component mount or change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    setTab(tabUrl || "profile");
  }, [location.search]);

  return (
    // Sidebar container
    <aside className="h-screen w-64 bg-white text-black dark:bg-gray-900 dark:text-white shadow-md p-4">
      {/* Sidebar navigation */}
      <nav className="flex flex-col gap-4">
        {/* Profile navigation link */}
        <Link
          to="/dashboard?tab=profile"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
            tab === "profile" ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
        >
          <HiUser className="text-xl" />
          <span>Profile</span>
          {/* Display user role badge */}
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-300 dark:bg-gray-700">
            {user.isAdmin ? "Admin" : "User"}
          </span>
        </Link>

        {/* Create Post navigation link (visible only to admins) */}
        {user.isAdmin && (
          <Link
            to="/create-post"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              tab === "create-post" ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
          >
            <HiDocumentAdd className="text-xl" />
            <span>Create Post</span>
          </Link>
        )}

        {/* Sign out button */}
        <button
          onClick={() => {
            dispatch(signOutSuccess());
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-left w-full"
        >
          <HiArrowSmRight className="text-xl" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
