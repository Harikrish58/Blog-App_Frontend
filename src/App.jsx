import React, { Suspense, lazy } from "react"; // Importing React, Suspense, and lazy
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Importing React Router for routing
import PrivateRoute from "./Components/PrivateRoute"; // Importing PrivateRoute component to protect certain routes
import Header from "./Components/Header"; // Importing the Header component
import FooterCom from "./Components/Footer"; // Importing the Footer component
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute"; // Importing the OnlyAdminPrivateRoute component to restrict admin routes
import { useSelector } from "react-redux"; // Importing useSelector to access Redux store

// Lazy load the components
const About = lazy(() => import("./Pages/About")); // Lazy load About page
const Dashboard = lazy(() => import("./Pages/Dashboard")); // Lazy load Dashboard page
const Blogs = lazy(() => import("./Pages/Blogs")); // Lazy load Blogs page
const Signin = lazy(() => import("./Pages/Signin")); // Lazy load Signin page
const Signup = lazy(() => import("./Pages/Signup")); // Lazy load Signup page
const CreatePost = lazy(() => import("./Pages/CreatePost")); // Lazy load CreatePost page
const SingleBlog = lazy(() => import("./Pages/SingleBlog")); // Lazy load SingleBlog page

const App = () => {
  const user = useSelector((state) => state.user.user); // Accessing the user from the Redux store

  return (
    <BrowserRouter>
      <Header /> {/* Top header component */}
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        {/* Show fallback loading UI while lazy-loaded components are loading */}
        <Routes>
          {/* Route: Redirect to dashboard if logged in, else to sign in */}
          <Route path="/" element={user ? <Dashboard /> : <Signin />} />

          {/* Public routes */}
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<SingleBlog />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private routes (authenticated users only) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Admin-only route */}
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
          </Route>
        </Routes>
      </Suspense>
      <FooterCom /> {/* Footer component */}
    </BrowserRouter>
  );
};

export default App;
