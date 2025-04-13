import { CalendarIcon } from "@heroicons/react/24/outline";
import { Avatar, Badge, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

const SingleBlog = () => {
  const { id } = useParams(); // Extract the blog ID from the URL parameters
  const [blog, setBlog] = useState(null); // State to hold blog data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors

  useEffect(() => {
    const fetchSingleBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/post/getpost/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (data && data.result) {
          setBlog(data.result); // Set blog data if available
        } else {
          setError("Blog not found"); // Set error if blog is not found
        }
      } catch (error) {
        setError("Error fetching blog data"); // Set error for any API issues
      } finally {
        setLoading(false); // Stop loading when data fetching is complete
      }
    };

    fetchSingleBlog(); // Call the fetch function
  }, [id]); // Re-run the effect when the blog ID changes

  if (loading) {
    return (
      <p className="text-center py-8 dark:text-white">Loading blog post...</p>
    ); // Display while loading
  }

  if (error) {
    return (
      <p className="text-center py-8 text-red-500 dark:text-red-400">
        Error loading blog post: {error}
      </p>
    ); // Display error message if any
  }

  if (!blog) {
    return (
      <p className="text-center py-8 dark:text-white">Blog post not found.</p>
    ); // Display if blog data is not found
  }

  return (
    <div className="py-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Card with content */}
        <Card className="max-w-3xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="relative">
            <img
              className="rounded-t-lg w-full object-cover h-64 md:h-96"
              src={blog.image}
              alt={blog.title} // Blog image
            />
            {/* Blog category badge */}
            <div className="absolute top-4 left-4">
              <Badge color="indigo" size="sm">
                {blog.category}
              </Badge>
            </div>
            {/* Blog creation date */}
            <span className="absolute top-4 right-4 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="p-6">
            {/* Blog title */}
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h2>

            {/* Author information */}
            <div className="flex items-center space-x-4 mb-4">
              <Avatar
                rounded={true}
                size="sm"
                alt="user avatar"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" // Placeholder avatar
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Hari krishnan
              </span>
            </div>

            {/* Blog content */}
            <div className="font-light text-gray-700 dark:text-gray-400 whitespace-pre-line">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />{" "}
              {/* Display blog content */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SingleBlog;
