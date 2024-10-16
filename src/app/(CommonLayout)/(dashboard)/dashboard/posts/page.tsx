// pages/admin/posts.tsx
"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import toast

import { getRecentPost, deletePost } from "@/src/services/allposts";
import { Post } from "@/src/types";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import PostContent from "@/src/components/UI/postediteUi/PostContent";

const ManagePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getRecentPost();

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Error fetching posts."); // Notify error
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      toast.success("Post deleted successfully."); // Notify success
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post."); // Notify error
    }
  };

  return (
    <>
      <ToastContainer /> {/* Add toast container */}
      <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>
      <div className="bg-white p-4 shadow rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="border border-gray-300 p-2">
                    <PostContent content={post.title} />{" "}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <PostContent content={post.content} />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 p-2 text-center"
                  colSpan={3}
                >
                  No posts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManagePosts;
