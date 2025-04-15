import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Add state to check if the user is logged in

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Fetch blog data based on search query
  useEffect(() => {
    if (isLoggedIn) {
      fetchdata(search);
    }
  }, [search, isLoggedIn]);

  const fetchdata = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `${API}/api/post/getallposts?search=${query}`
        : `${API}/api/post/getallposts`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setBlogs(Array.isArray(data.result) ? data.result : []);
    } catch (error) {
      setBlogs([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  // Loading state
  if (loading) {
    return <p className="text-center py-8 dark:text-white">Loading...</p>;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 text-red-800 dark:bg-gray-800 dark:text-white p-4 rounded mb-4 max-w-xl mx-auto text-center">
        {error}
      </div>
    );
  }

  // If user is not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="py-8 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Please login to see blogs
          </h1>
          <div className="text-center">
            <button
              onClick={() => navigate("/signin")}
              className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Latest Blog Posts
        </h1>

        {/* Search alert */}
        {search && (
          <div className="bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-white p-4 rounded mb-4 text-center">
            Search results for: <span className="font-semibold">{search}</span>
          </div>
        )}

        {/* Blog card grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleClick(blog._id)}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {/* Category badge and date */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {blog.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-700 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {blog.content}
                </p>

                {/* Author info */}
                <div className="flex items-center space-x-3">
                  <img
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="Author"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Hari krishnan
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No blogs found message */}
        {blogs.length === 0 && search && !loading && !error && (
          <div className="bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-white p-4 rounded mt-6 text-center max-w-lg mx-auto">
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
