import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiInformationCircle,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  // State management for form data, loading state, and error messages
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes and update formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission, including validation and API request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all the fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(`${API}/auth/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      if (response.ok) {
        setLoading(false);
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Main Sign Up form */}
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <div className="grid grid-cols-12 gap-6">
          {/* Left side logo and instructions */}
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
              For signup, you can use your email and password, or authenticate
              with Google. <strong>This is a demo project.</strong>
            </p>
          </div>

          {/* Right side form for user details */}
          <div className="col-span-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Sign Up
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username field */}
              <div>
                <Label
                  htmlFor="username"
                  value="Username"
                  className="text-gray-900 dark:text-white"
                />
                <TextInput
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  icon={HiUser}
                  onChange={handleChange}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>
              {/* Email field */}
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
              {/* Password field */}
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
              {/* Submit button */}
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
                  "Sign Up"
                )}
              </Button>
              <OAuth /> {/* Google OAuth button component */}
            </form>

            {/* Sign In link */}
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Sign In
              </Link>
            </p>

            {/* Display error message if any */}
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

export default Signup;
