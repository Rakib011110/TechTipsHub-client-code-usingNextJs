"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FaTrash, FaEdit } from "react-icons/fa";

import { useUser } from "@/src/context/user.provider";
import { getMyPost } from "@/src/services/mypost";
import { deletePost, useUpdatePost } from "@/src/services/allposts";
import TIInput from "@/src/components/resubaleform/TIInput";
import CreatePost from "@/src/components/home/@createposts/page";
import PostContent from "@/src/components/UI/postediteUi/PostContent";

interface Post {
  category: string;
  isPremium: any;
  createdAt: string | number | Date;
  _id: string;
  title: string;
  content: string;
  images?: string[] | null | undefined;
  upvotes: number;
  downvotes: number;
}

const ManageMyPost = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [postImages, setPostImages] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const methods = useForm();
  const { handleSubmit } = methods;

  const { mutate: updatePostMutation } = useUpdatePost();

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user?._id) {
        const data = await getMyPost(user._id);

        setPosts(data?.data || []);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setEditData({ title: post.title, content: post.content });
    setShowModal(true);
  };

  const handleUpdatePost: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    if (!user || !editingPost) {
      toast.error("No user or post selected.");

      return;
    }

    const postData = {
      title: data.title,
      content: data.content,
      author: user._id,
    };

    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("author", postData.author);

    if (postImages) {
      Array.from(postImages).forEach((file) => {
        formData.append("postImages", file);
      });
    }

    try {
      updatePostMutation(
        { postId: editingPost._id, formData },
        {
          onSuccess: () => {
            toast.success("Post updated successfully!");
            setImagePreviews([]);
            setPostImages(null);
            setShowModal(false);
          },
          onError: () => {
            toast.success("Post update failed.");
          },
        },
      );
    } catch (error) {
      toast.error("Error submitting form data.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      setPostImages(files);

      const previews = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      });

      Promise.all(previews)
        .then(setImagePreviews)
        .catch((error) => {
          console.error("Error generating image preview:", error);
          toast.error("Error generating image preview.");
        });
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? post.category === categoryFilter
      : true;

    const matchesPremium = user?.premiumUser ? true : !post.isPremium;

    return matchesSearch && matchesCategory && matchesPremium;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (sortOption) {
      case "upvotes":
        return b.upvotes - a.upvotes;
      case "helpful":
        return b.downvotes - a.downvotes;
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post.");
    }
  };

  return (
    <div className="py-8 px-6 max-w-screen-xl mx-auto ">
      <h1 className="text-3xl font-serif font-bold mb-5">
        Welcome to Manage My Posts
      </h1>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <input
            className="p-2 border rounded w-full"
            placeholder="Search by keywords..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React">React</option>
            <option value="CSS">CSS</option>
          </select>
        </div>
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              sortOption === "newest" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSortOption("newest")}
          >
            Newest
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortOption === "upvotes"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSortOption("upvotes")}
          >
            Most Upvoted
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortOption === "helpful"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSortOption("helpful")}
          >
            Most Helpful
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border">
          <thead>
            <tr>
              <th className="border p-4">Image</th>
              <th className="border p-4">Title</th>
              <th className="border p-4">Content</th>
              <th className="border p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((post: Post) => (
              <tr key={post._id}>
                <td className="border p-4">
                  <Image
                    alt="No Image"
                    className="object-cover"
                    height={50}
                    src={post.images?.[0] || "/default-post-image.jpg"}
                    width={80}
                  />
                </td>
                <td className="border p-4 truncate">
                  {" "}
                  <h2 className="mt-4 text-xl font-bold text-gray-800">
                    <PostContent content={post.title} />
                  </h2>
                </td>
                <td className="border p-4 truncate">
                  {/* <p content={post.content} /> */}

                  <PostContent content={post.content} />

                  {/* <p>{post.content.slice(0, 50)} </p> */}
                </td>
                <td className="border p-4 flex space-x-4 justify-center">
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => handleEditClick(post)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleUpdatePost)}>
                <TIInput
                  label="Title"
                  name="title"
                  placeholder="Edit your title"
                  // value={editData.title}
                />
                <TIInput
                  label="Content"
                  name="content"
                  placeholder="Edit your content"
                />
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
                <div className="flex space-x-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <Image
                      key={index}
                      alt={`Preview ${index}`}
                      className="object-cover"
                      height={50}
                      src={preview}
                      width={50}
                    />
                  ))}
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
                  type="submit"
                >
                  Update Post
                </button>
              </form>
            </FormProvider>
            <button
              className="px-4 py-2 mt-4 bg-gray-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <CreatePost />
    </div>
  );
};

export default ManageMyPost;
