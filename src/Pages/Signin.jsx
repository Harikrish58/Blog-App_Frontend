import React, { useState } from "react";
import { HiMail, HiLockClosed, HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../Redux/Slice/userSlice";
import OAuth from "../Components/OAuth";

const API = import.meta.env.VITE_API_BASE_URL;

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle sign-in form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch(`${API}/api/auth/signin-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        dispatch(signInSuccess(data.result));
        navigate("/blogs");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left section: logo + message */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <div className="text-4xl font-bold px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 rounded-lg text-white">
                Dev
              </div>
              <span className="text-4xl font-bold ml-2">Hub</span>
            </div>
            <p className="text-sm mt-6 text-center text-gray-900 dark:text-gray-300 max-w-xs">
              For signin, you can use your email and password, or authenticate with Google.
            </p>
          </div>

          {/* Right section: sign-in form */}
          <div>
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <HiMail className="absolute top-3 right-4 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <HiLockClosed className="absolute top-3 right-4 text-gray-400" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-2 rounded focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {loading ? "Loading..." : "Sign In"}
              </button>

              {/* Google OAuth */}
              <OAuth />
            </form>

            {/* Sign up link */}
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:underline dark:text-purple-400">
                Sign Up
              </Link>
            </p>

            {/* Error alert */}
            {errorMessage && (
              <div className="mt-5 flex items-start gap-2 p-3 border border-red-300 bg-red-100 text-red-800 rounded text-sm dark:bg-gray-700 dark:text-red-300">
                <HiInformationCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <span className="font-semibold">Oops!</span> {errorMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
