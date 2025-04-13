import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

const CreatePost = () => {
  // State initialization for form data, errors, file upload, etc.
  const [file, setFile] = useState(null); // Store the selected image file
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // Store upload progress
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // Store error messages for image upload
  const [formData, setFormData] = useState({}); // Store form data
  const [publishError, setPublishError] = useState(null); // Store error messages for publishing the post
  const navigate = useNavigate();

  // Function to handle image upload to Firebase storage
  const handleUploadImage = async () => {
    if (!file) {
      setImageFileUploadError("Please select an image file.");
      return;
    }
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and set upload progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImageFileUploadProgress(progress);
      },
      () => {
        setImageFileUploadError("Error uploading image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Update formData with image URL once the upload is successful
          setImageFileUploadProgress(null);
          setImageFileUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const strippedContent = formData.content
      ? formData.content.replace(/<[^>]+>/g, "") // Remove HTML tags from content
      : "";
    if (strippedContent.length < 100) {
      setPublishError("Post content must be at least 100 characters long.");
      return;
    }
    try {
      // Post data to the backend API
      const response = await fetch(`${API}/post/createpost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ ...formData, content: formData.content }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message || "Error publishing post.");
        return;
      }
      setPublishError(null);
      navigate("/blogs"); // Navigate to the blogs page after successful post creation
    } catch (error) {
      setPublishError("Error publishing post. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Form container for creating a new post */}
      <div className="w-3/4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create a New Post
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Input for Title */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300">Title</label>
            <TextInput
              type="text"
              placeholder="Post Title"
              required={true}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="dark:bg-gray-700 dark:text-white"
            />
            {/* Input for Category */}
            <label className="text-gray-700 dark:text-gray-300">Category</label>
            <Select
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required={true}
              className="dark:bg-gray-700 dark:text-white"
            >
              <option value="" disabled>
                Select a Category
              </option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Finance">Finance</option>
              <option value="Business">Business</option>
              <option value="Science">Science</option>
            </Select>
          </div>

          {/* File input for image */}
          <div>
            <FileInput onChange={(e) => setFile(e.target.files[0])} />
            <Button
              type="button"
              className="mt-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              size="sm"
              onClick={handleUploadImage}
              disabled={imageFileUploadProgress !== null}
            >
              {/* Show progress during file upload */}
              {imageFileUploadProgress !== null ? (
                <div className="flex items-center gap-2">
                  <CircularProgressbar
                    value={imageFileUploadProgress}
                    text={`${imageFileUploadProgress || 0}%`}
                    className="w-6 h-6"
                  />
                  Uploading...
                </div>
              ) : (
                <span>Upload Image</span>
              )}
            </Button>

            {/* Show errors during file upload */}
            {imageFileUploadError && (
              <Alert
                color="failure"
                className="mt-2 dark:bg-gray-700 dark:text-white"
              >
                <span>{imageFileUploadError}</span>
              </Alert>
            )}

            {/* Display image after successful upload */}
            {formData.image && (
              <img
                src={formData.image}
                alt="Uploaded"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}

            {/* Input for content using ReactQuill */}
            <label className="mt-4 block text-gray-700 dark:text-gray-300">
              Content
            </label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                value={formData.content || ""}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                placeholder="Write your post content here..."
              />
            </div>

            {/* Submit button for publishing the post */}
            <Button
              type="submit"
              className="mt-4 bg-pink-500 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Publish Post
            </Button>

            {/* Display any errors related to post publishing */}
            {publishError && (
              <Alert
                color="failure"
                className="mt-2 dark:bg-gray-700 dark:text-white"
              >
                <span>{publishError}</span>
              </Alert>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
