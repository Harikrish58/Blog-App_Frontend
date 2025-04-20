import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/post/getpost/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (data && data.result) {
          setBlog(data.result);
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        setError("Error fetching blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleBlog();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center py-8 text-gray-700 dark:text-white">
        Loading blog post...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-8 text-red-500 dark:text-red-400">
        Error loading blog post: {error}
      </p>
    );
  }

  if (!blog) {
    return (
      <p className="text-center py-8 text-gray-700 dark:text-white">
        Blog post not found.
      </p>
    );
  }

  return (
    <div className="py-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 overflow-hidden">
          {/* Blog Image */}
          <div className="relative">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full object-cover h-64 md:h-96"
            />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {blog.category}
            </div>

            {/* Date */}
            <div className="absolute top-4 right-4 text-sm text-gray-100 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Blog Info */}
          <div className="p-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h2>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt="author"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Hari krishnan
              </span>
            </div>

            {/* Blog Content */}
            <div className="font-light text-gray-700 dark:text-gray-400 whitespace-pre-line">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
