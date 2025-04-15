// OAuth.jsx
// Google sign-in component using Firebase and Redux

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import { signInSuccess, signInFailure } from "../Redux/Slice/userSlice";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const API = import.meta.env.VITE_API_BASE_URL;

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Google Sign-In logic
  const handleSubmit = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);

      // Send Google user info to backend
      const res = await fetch(`${API}/api/auth/googleauth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          picture: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        dispatch(signInSuccess(data.result));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    // Google OAuth Button
    <div>
      <button
        type="button"
        onClick={handleSubmit}
        className="flex items-center justify-center w-full px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
      >
        <FcGoogle className="w-6 h-6 mr-2" />
        Continue with Google
      </button>
    </div>
  );
};

export default OAuth;
