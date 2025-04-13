import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Component to restrict access to admin-only routes
const OnlyAdminPrivateRoute = () => {
  const { user } = useSelector((state) => state.user); // Get user data from Redux

  // If the user is admin, render the nested routes (Outlet), otherwise redirect to signin page
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
};

export default OnlyAdminPrivateRoute;
