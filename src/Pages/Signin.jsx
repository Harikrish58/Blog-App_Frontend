import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { HiMail, HiLockClosed, HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../Redux/Slice/userSlice";
import OAuth from "../Components/OAuth"; // Import Google OAuth component

const Signin = () => {
  const [formData, setFormData] = useState({}); // Track form data (email and password)
  const { loading, error: errorMessage } = useSelector((state) => state.user); // Redux states for loading and error
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigating to different routes

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission (user login)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (!formData.email || !formData.password) {
      // Check if fields are empty
      return dispatch(signInFailure("Please fill out all the fields"));
    }

    try {
      dispatch(signInStart()); // Set loading state in Redux
      const response = await fetch(
        "http://localhost:5000/api/auth/signin-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // Send email and password in request body
        }
      );
      const data = await response.json();

      if (data.success === false) {
        return dispatch(signInFailure(data.message)); // Handle failure response
      }

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token in localStorage
        dispatch(signInSuccess(data.result)); // Dispatch user data (without password) to Redux
        navigate("/blogs"); // Redirect to blogs page on successful login
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Handle API errors
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Sign In Page */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <div className="grid grid-cols-12 gap-6">
          {/* Left side content: Logo and description */}
          <div className="col-span-6 flex flex-col items-center justify-center">
            <div className="flex items-center">
              <div className="text-4xl font-bold px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 rounded-lg text-white inline-block">
                Dev
              </div>
              <span className="text-4xl font-bold text-gray-900 dark:text-white ml-2">
                Hub
              </span>
            </div>
            <p className="text-sm mt-6 text-center text-gray-900 dark:text-gray-300">
              For signin, you can use your email and password, or authenticate
              with Google.
            </p>
          </div>

          {/* Right side: Sign In form */}
          <div className="col-span-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Sign In
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <Label
                  htmlFor="email"
                  value="Email"
                  className="text-gray-900 dark:text-white"
                />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  icon={HiMail}
                  onChange={handleChange}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <Label
                  htmlFor="password"
                  value="Password"
                  className="text-gray-900 dark:text-white"
                />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  icon={HiLockClosed}
                  onChange={handleChange}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      color="purple"
                      aria-label="Purple spinner example"
                      size="sm"
                    />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Google OAuth Button */}
              <OAuth />
            </form>

            {/* Sign Up Link */}
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Sign Up
              </Link>
            </p>

            {/* Error Message */}
            {errorMessage && (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                className="mt-5 dark:bg-gray-700 dark:text-white"
              >
                <span className="font-medium me-2">OOPS!</span>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
