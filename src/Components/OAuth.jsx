import { Button } from "flowbite-react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import { signInSuccess, signInFailure } from "../Redux/Slice/userSlice";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

// OAuth component to handle Google sign-in
const OAuth = () => {
  const auth = getAuth(app); // Initialize Firebase Auth
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // React Router navigation

  // Function to handle Google sign-in
  const handleSubmit = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      // Trigger sign-in with Google
      const result = await signInWithPopup(auth, provider);

      // Send user details to backend
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
        // On success, store token and navigate
        localStorage.setItem("token", data.token);
        dispatch(signInSuccess(data.result));
        navigate("/");
      }
    } catch (error) {
      // Handle errors and dispatch failure
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div>
      {/* Google sign-in button */}
      <Button
        type="button"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
        onClick={handleSubmit}
      >
        <FcGoogle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </div>
  );
};

export default OAuth;
