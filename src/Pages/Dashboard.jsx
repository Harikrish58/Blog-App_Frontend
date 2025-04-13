import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardProfile from "../Components/DashboardProfile";
import DashoboardSidebar from "../Components/DashoboardSidebar";

const Dashboard = () => {
  // Getting the current URL location
  const location = useLocation();

  // State to manage the active tab (default is "profile")
  const [tab, setTab] = useState("");

  // useEffect to update the active tab when the URL query changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    setTab(tabUrl || "profile"); // Default to "profile" if no tab is found
  }, [location.search]);

  return (
    <div className="flex flex-row h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar Section */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <DashoboardSidebar /> {/* Sidebar Component for navigation */}
      </div>

      {/* Main Content Section */}
      <div className="flex-grow p-4 overflow-auto">
        {/* Conditional Rendering based on the selected tab */}
        {tab === "profile" && <DashboardProfile />}{" "}
        {/* Render Profile Section */}
      </div>
    </div>
  );
};

export default Dashboard;
