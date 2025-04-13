import React, { useEffect, useState } from "react";
import { Card, Avatar, Badge, Alert } from "flowbite-react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";

// Load API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

const Blogs = () => {
  const Navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchdata(search);
  }, [search]);

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
      if (data && Array.isArray(data.result)) {
        setBlogs(data.result);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      setBlogs([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    Navigate(`/blogs/${id}`);
  };

  if (loading) {
    return <p className="text-center py-8 dark:text-white">Loading...</p>;
  }

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

        {search && (
          <Alert
            color="info"
            className="mb-4 text-center dark:bg-gray-800 dark:text-white"
          >
            <span>Search results for: {search}</span>
          </Alert>
        )}

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
                    {new Date(blog.createdAt).toLocaleDateString()}
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
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Hari krishnan
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
