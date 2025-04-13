import React, { Suspense, lazy } from "react"; // Importing React, Suspense, and lazy
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Importing React Router for routing
import PrivateRoute from "./Components/PrivateRoute"; // Importing PrivateRoute component to protect certain routes
import Header from "./Components/Header"; // Importing the Header component
import FooterCom from "./Components/Footer"; // Importing the Footer component
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute"; // Importing the OnlyAdminPrivateRoute component to restrict admin routes

// Lazy load the components
const About = lazy(() => import("./Pages/About")); // Lazy load About page
const Dashboard = lazy(() => import("./Pages/Dashboard")); // Lazy load Dashboard page
const Blogs = lazy(() => import("./Pages/Blogs")); // Lazy load Blogs page
const Signin = lazy(() => import("./Pages/Signin")); // Lazy load Signin page
const Signup = lazy(() => import("./Pages/Signup")); // Lazy load Signup page
const CreatePost = lazy(() => import("./Pages/CreatePost")); // Lazy load CreatePost page
const SingleBlog = lazy(() => import("./Pages/SingleBlog")); // Lazy load SingleBlog page
import { useSelector } from "react-redux"; // Importing useSelector to access Redux store

const App = () => {
  // Accessing the user from the Redux store
  const user = useSelector((state) => state.user.user);
  return (
    <BrowserRouter>
      <Header />

      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        {/* Show loading message while components are being loaded */}
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Signin />} />
          {/* Public Routes */}
          <Route path="/about" element={<About />} />{" "}
          {/* About page accessible to everyone */}
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            {/* Route requires authentication */}
            <Route path="/dashboard" element={<Dashboard />} />{" "}
            {/* Dashboard page for authenticated users */}
          </Route>
          {/* Admin-Only Routes */}
          <Route element={<OnlyAdminPrivateRoute />}>
            {/* Route restricted to admin users */}
            <Route path="/create-post" element={<CreatePost />} />{" "}
            {/* Page for creating posts (only accessible to admins) */}
          </Route>
          {/* Public Routes for blogs */}
          <Route path="/blogs" element={<Blogs />} />{" "}
          {/* Blogs listing page accessible to everyone */}
          <Route path="/blogs/:id" element={<SingleBlog />} />{" "}
          {/* Single blog page, dynamically fetched by blog ID */}
          {/* Authentication Routes */}
          <Route path="/signin" element={<Signin />} />{" "}
          {/* Signin page for user login */}
          <Route path="/signup" element={<Signup />} />{" "}
          {/* Signup page for user registration */}
        </Routes>
      </Suspense>

      <FooterCom />
    </BrowserRouter>
  );
};

export default App;
