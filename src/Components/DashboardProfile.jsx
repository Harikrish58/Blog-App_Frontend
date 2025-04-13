import {
  Alert,
  Button,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase"; // Firebase app
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Circular progress bar
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../Redux/Slice/userSlice"; // Redux actions for user state
import { Modal } from "flowbite-react"; // Modal for delete confirmation
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom"; // For navigation

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

const DashboardProfile = () => {
  // Redux dispatch and selector hooks
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  // Local state for handling image, form data, and errors
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

  // File picker reference for selecting the profile image
  const filePickerRef = useRef();

  useEffect(() => {
    // Automatically upload image if it is set
    if (imageFile) {
      uploadimage();
    }
  }, [imageFile]);

  // Handle image upload to Firebase storage
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
      (error) => {
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

  // Handle image file change (on file input)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2000000) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    } else {
      setImageFileUploadError("File size must be less than 2MB");
    }
  };

  // Handle changes in form fields (name, email, password)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle the form submission for updating the user profile
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
      const response = await fetch(
        `${API}/user/update/${user._id}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify(formData),
        }
      );

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

  // Handle user account deletion
  const handleDeleteUser = async () => {
    setDeleteUserError(null);
    setDeleteUserModal(false);
    dispatch(deleteStart());

    try {
      const response = await fetch(
        `${API}/user/delete/${user._id}`,

        {
          method: "DELETE",
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
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
      {/* Title and Profile Update Form */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        User Profile
      </h1>

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
                path: { stroke: `#4f46e5,${imageFileUploadProgress / 100}` },
              }}
            />
          )}
          <div>
            <img
              src={imageFileUrl || user.profilePicture}
              alt="Profile"
              className={`w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity ${
                imageFileUploadProgress ? "opacity-50" : "opacity-100"
              }`}
              onClick={() => filePickerRef.current.click()}
            />
          </div>
        </div>

        {/* Image Upload Error */}
        {imageFileUploadError && (
          <Alert
            color="failure"
            className="mt-2 w-64 dark:bg-gray-800 dark:text-white"
          >
            <span>{imageFileUploadError}</span>
          </Alert>
        )}

        {/* Form Inputs: Username, Email, Password */}
        <div className="mb-4 w-64">
          <TextInput
            type="text"
            id="username"
            placeholder="Name"
            value={formData.username || user.username || ""}
            onChange={handleChange}
            className="mt-2 bg-white dark:bg-gray-800 dark:text-white"
          />
          <TextInput
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email || user.email || ""}
            onChange={handleChange}
            className="mt-2 bg-white dark:bg-gray-800 dark:text-white"
          />
          <TextInput
            type="password"
            id="password"
            placeholder="**********"
            value={formData.password || ""}
            onChange={handleChange}
            className="mt-2 bg-white dark:bg-gray-800 dark:text-white"
          />
          <Button
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800"
            disabled={loading || imageFileUploading}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </div>

        {/* Create Post Button for Admin */}
        {user.isAdmin && (
          <Link to="/create-post">
            <Button className="w-64 mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:bg-gradient-to-l focus:ring-green-200 dark:focus:ring-green-800">
              Create Post
            </Button>
          </Link>
        )}
      </form>

      {/* Delete and Sign Out Buttons */}
      <div className="w-64">
        <Button
          className="mt-4 w-full !bg-red-500 text-white hover:!bg-red-600 focus:ring-red-200 dark:focus:ring-red-800"
          onClick={() => setDeleteUserModal(true)}
        >
          <HiOutlineExclamationCircle className="mr-2" />
          Delete Account
        </Button>
        <Button
          className="mt-4 w-full !bg-gray-500 text-white hover:!bg-gray-600 focus:ring-gray-200 dark:focus:ring-gray-800"
          onClick={() => {
            dispatch(signOutSuccess());
            localStorage.removeItem("token");
            window.location.href = "/signin";
          }}
        >
          Sign Out
        </Button>
      </div>

      {/* Error Messages */}
      {updateUserError && (
        <Alert
          color="failure"
          className="mt-2 w-64 dark:bg-gray-800 dark:text-white"
        >
          <span>{updateUserError}</span>
        </Alert>
      )}
      {updateUserSuccess && (
        <Alert
          color="success"
          className="mt-2 w-64 dark:bg-gray-800 dark:text-white"
        >
          <span>{updateUserSuccess}</span>
        </Alert>
      )}

      {/* Modal for User Deletion */}
      <Modal
        show={deleteUserModal}
        onClose={() => setDeleteUserModal(false)}
        size="md"
        popup={true}
        dismissible={true}
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="!bg-red-500 hover:!bg-red-600 focus:!ring-red-200 dark:focus:!ring-red-800 text-white"
                onClick={handleDeleteUser}
              >
                <HiOutlineExclamationCircle className="mr-2" />
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setDeleteUserModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Delete User Error */}
      {deleteUserError && (
        <Alert
          color="failure"
          className="mt-2 w-64 dark:bg-gray-800 dark:text-white"
        >
          <span>{deleteUserError}</span>
        </Alert>
      )}
    </div>
  );
};

export default DashboardProfile;
