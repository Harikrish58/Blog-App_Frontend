import React, { useEffect, useState } from "react";
import { CalendarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal toggle

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.isAdmin) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchSingleBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/post/getpost/${id}`, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (data?.result) {
          setBlog(data.result);
        } else {
          setError("Blog not found");
        }
      } catch {
        setError("Error fetching blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleBlog();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/api/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        alert("Blog deleted successfully");
        navigate("/blogs");
      } else {
        alert(data.message || "Failed to delete blog");
      }
    } catch {
      alert("Error deleting blog");
    }
  };

  if (loading) {
    return <p className="text-center py-8 text-gray-700 dark:text-white">Loading blog post...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500 dark:text-red-400">Error loading blog post: {error}</p>;
  }

  if (!blog) {
    return <p className="text-center py-8 text-gray-700 dark:text-white">Blog post not found.</p>;
  }

  return (
    <div className="py-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 overflow-hidden relative">
          
          {/* Blog Image */}
          <div className="relative">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full object-cover h-64 md:h-96"
            />
            <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {blog.category}
            </div>
            <div className="absolute top-4 right-4 text-sm text-gray-100 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Blog Info */}
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h2>

            <div className="flex items-center gap-4 mb-4">
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

            {/* Delete Button (bottom) */}
            {isAdmin && (
              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete Blog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this blog post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;
