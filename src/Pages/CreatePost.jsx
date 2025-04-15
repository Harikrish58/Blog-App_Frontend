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

const API = import.meta.env.VITE_API_BASE_URL;

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  // Upload selected image to Firebase
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
          setImageFileUploadProgress(null);
          setImageFileUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  // Submit post to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const strippedContent = formData.content
      ? formData.content.replace(/<[^>]+>/g, "")
      : "";
    if (strippedContent.length < 100) {
      setPublishError("Post content must be at least 100 characters long.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/post/createpost`, {
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
      navigate("/blogs");
    } catch (error) {
      setPublishError("Error publishing post. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create a New Post
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-gray-700 dark:text-gray-300 block mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Post Title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-700 dark:text-gray-300 block mb-1">
              Category
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            </select>
          </div>

          {/* File Input & Upload */}
          <div>
            <label className="text-gray-700 dark:text-gray-300 block mb-1">
              Upload Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-gray-700 dark:text-gray-300"
            />

            <button
              type="button"
              onClick={handleUploadImage}
              disabled={imageFileUploadProgress !== null}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              {imageFileUploadProgress !== null ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6">
                    <CircularProgressbar
                      value={imageFileUploadProgress}
                      text={`${imageFileUploadProgress}%`}
                    />
                  </div>
                  Uploading...
                </div>
              ) : (
                "Upload Image"
              )}
            </button>

            {imageFileUploadError && (
              <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded dark:bg-gray-700">
                {imageFileUploadError}
              </div>
            )}

            {formData.image && (
              <img
                src={formData.image}
                alt="Uploaded"
                className="mt-3 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <ReactQuill
              theme="snow"
              value={formData.content || ""}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your post content here..."
              className="bg-white dark:bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold"
          >
            Publish Post
          </button>

          {/* Publish Error */}
          {publishError && (
            <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded dark:bg-gray-700">
              {publishError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
