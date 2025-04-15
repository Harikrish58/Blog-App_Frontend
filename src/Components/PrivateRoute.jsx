// OnlyAdminPrivateRoute.jsx
// Route guard component to restrict access to admin-only routes

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  // Get the current user from Redux state
  const { user } = useSelector((state) => state.user);

  // If user is admin, render the requested child route (Outlet)
  // Otherwise, redirect to the Sign In page
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
};

export default OnlyAdminPrivateRoute;
