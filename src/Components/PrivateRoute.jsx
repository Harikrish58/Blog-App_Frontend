import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Component to protect private routes that require a logged-in user
const PrivateRoute = () => {
  const { user } = useSelector((state) => state.user); // Get user data from Redux

  // If the user is logged in, render the nested routes (Outlet), otherwise redirect to signin page
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
