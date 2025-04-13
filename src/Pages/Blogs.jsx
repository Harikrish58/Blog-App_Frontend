import React, { useEffect, useState } from "react";
import { Card, Avatar, Badge, Alert } from "flowbite-react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";

const Blogs = () => {
  // State initialization
  const Navigate = useNavigate();
  const [blogs, setBlogs] = useState([]); // Stores the list of blogs
  const [searchParams] = useSearchParams(); // To get search query from URL
  const search = searchParams.get("search") || ""; // Search query parameter
  const [error, setError] = useState(null); // Stores error messages
  const [loading, setLoading] = useState(true); // Manages loading state

  // Fetch blog data when search query changes
  useEffect(() => {
    fetchdata(search);
  }, [search]);

  // Fetch blog data from API
  const fetchdata = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `http://localhost:5000/api/post/getallposts?search=${query}` // URL with search query
        : "http://localhost:5000/api/post/getallposts"; // URL without search query
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"), // Use token for authenticated API calls
        },
      });
      const data = await res.json();
      if (data && Array.isArray(data.result)) {
        setBlogs(data.result); // Store the fetched blogs in state
      } else {
        setBlogs([]); // In case result is not an array
      }
    } catch (error) {
      setBlogs([]); // Handle error by clearing the blog list
      setError("Something went wrong. Please try again."); // Set error message
    } finally {
      setLoading(false); // Set loading state to false after the fetch completes
    }
  };

  // Navigate to individual blog page when clicked
  const handleClick = (id) => {
    Navigate(`/blogs/${id}`);
  };

  // Show loading message if data is still being fetched
  if (loading) {
    return <p className="text-center py-8 dark:text-white">Loading...</p>;
  }

  // Show error message if there was an issue fetching the data
  if (error) {
    return (
      <Alert color="failure" className="mb-4 dark:bg-gray-800 dark:text-white">
        <span>{error}</span>
      </Alert>
    );
  }

  return (
    <div className="py-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Latest Blog Posts
        </h1>

        {/* If search query exists, display it */}
        {search && (
          <Alert
            color="info"
            className="mb-4 text-center dark:bg-gray-800 dark:text-white"
          >
            <span>Search results for: {search}</span>
          </Alert>
        )}

        {/* Display list of blog cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <Card
              key={blog._id || index}
              className="max-w-sm rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleClick(blog._id)}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <Badge color="indigo" size="sm">
                    {blog.category}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    {new Date(blog.createdAt).toLocaleDateString()}{" "}
                    {/* Display blog creation date */}
                  </span>
                </div>
                <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {blog.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar
                    rounded={true}
                    size="xs"
                    alt="user avatar"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" // Placeholder for user avatar
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Hari krishnan
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Display message if no blogs are found */}
        {blogs.length === 0 && search && !loading && !error && (
          <Alert
            color="info"
            className="mt-6 text-center dark:bg-gray-800 dark:text-white"
          >
            <span>No blogs found.</span>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Blogs;
