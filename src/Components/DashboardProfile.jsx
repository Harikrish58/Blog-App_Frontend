// DashboardProfile.jsx
// React component for displaying and editing user profile

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../Redux/Slice/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const DashboardProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (imageFile) {
      uploadimage();
    }
  }, [imageFile]);

  const uploadimage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, `profile/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadError(
          "Could not upload image, File size must be less than 2MB"
        );
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2000000) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    } else {
      setImageFileUploadError("File size must be less than 2MB");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(false);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Please fill at least one field to update");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const response = await fetch(`${API}/api/user/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(updateSuccess(data.result));
        setUpdateUserSuccess("Profile updated successfully");
        setTimeout(() => {
          setUpdateUserSuccess(false);
        }, 3000);
      } else {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError("Error updating profile. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    setDeleteUserError(null);
    setDeleteUserModal(false);
    dispatch(deleteStart());

    try {
      const response = await fetch(`${API}/api/user/delete/${user._id}`, {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(deleteSuccess(data.result));
        localStorage.removeItem("token");
        window.location.href = "/signin";
      } else {
        dispatch(deleteFailure(data.message));
        setDeleteUserError(data.message);
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
      setDeleteUserError("Error deleting user. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        User Profile
      </h1>

      {/* Profile Update Form */}
      <form
        className="mt-4 flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Profile Picture */}
        <div className="mt-2 relative">
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={10}
              className="w-24 h-24"
              styles={{
                root: {
                  width: "100px",
                  height: "100px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || user.profilePicture}
            alt="Profile"
            className={`w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity ${
              imageFileUploadProgress ? "opacity-50" : "opacity-100"
            }`}
            onClick={() => filePickerRef.current.click()}
          />
        </div>

        {/* Upload Error */}
        {imageFileUploadError && (
          <div className="bg-red-100 text-red-800 text-sm px-4 py-2 mt-2 w-64 rounded dark:bg-red-800 dark:text-white">
            {imageFileUploadError}
          </div>
        )}

        {/* Form Inputs */}
        <div className="mb-4 w-64">
          <input
            type="text"
            id="username"
            placeholder="Name"
            value={formData.username || user.username || ""}
            onChange={handleChange}
            className="mt-2 w-full px-3 py-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email || user.email || ""}
            onChange={handleChange}
            className="mt-2 w-full px-3 py-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
          />
          <input
            type="password"
            id="password"
            placeholder="**********"
            value={formData.password || ""}
            onChange={handleChange}
            className="mt-2 w-full px-3 py-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || imageFileUploading}
            className="mt-4 w-full px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>

        {/* Admin Create Post Button */}
        {user.isAdmin && (
          <Link to="/create-post" className="w-64">
            <button className="w-full px-4 py-2 rounded bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-blue-500 hover:to-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800">
              Create Post
            </button>
          </Link>
        )}
      </form>

      {/* Delete + Logout */}
      <div className="w-64">
        <button
          className="mt-4 w-full px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
          onClick={() => setDeleteUserModal(true)}
        >
          <HiOutlineExclamationCircle className="inline-block mr-2" />
          Delete Account
        </button>
        <button
          className="mt-4 w-full px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800"
          onClick={() => {
            dispatch(signOutSuccess());
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Update Feedback */}
      {updateUserError && (
        <div className="bg-red-100 text-red-800 text-sm px-4 py-2 mt-2 w-64 rounded dark:bg-red-800 dark:text-white">
          {updateUserError}
        </div>
      )}
      {updateUserSuccess && (
        <div className="bg-green-100 text-green-800 text-sm px-4 py-2 mt-2 w-64 rounded dark:bg-green-800 dark:text-white">
          {updateUserSuccess}
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {deleteUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Account?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                onClick={handleDeleteUser}
              >
                <HiOutlineExclamationCircle className="inline-block mr-2" />
                Yes, I'm sure
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setDeleteUserModal(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Error */}
      {deleteUserError && (
        <div className="bg-red-100 text-red-800 text-sm px-4 py-2 mt-2 w-64 rounded dark:bg-red-800 dark:text-white">
          {deleteUserError}
        </div>
      )}
    </div>
  );
};

export default DashboardProfile;
