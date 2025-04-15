// Dashboard.jsx
// Main layout for the user/admin dashboard, showing sidebar and profile section

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardProfile from "../Components/DashboardProfile";
import DashoboardSidebar from "../Components/DashoboardSidebar";

const Dashboard = () => {
  // Get the current URL location to extract query parameters
  const location = useLocation();

  // Track the active tab (e.g., profile, settings, etc.)
  const [tab, setTab] = useState("");

  // Update the active tab based on URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    setTab(tabUrl || "profile"); // Default to profile
  }, [location.search]);

  return (
    <div className="flex flex-row h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <DashoboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 overflow-auto">
        {tab === "profile" && <DashboardProfile />}
        {/* Add more tabs like settings, posts etc., as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
