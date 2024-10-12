// src/services/allposts.js
import envConfig from "@/src/config/envConfig";
import clientAxiosInstance from "@/src/lib/ClientAxiosInstance/ClientAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
interface Comment {
  _id: string;
  content: string;
  author?: string;
  post?: string;
  createdAt: string; // Use Date type for actual date handling if needed
}
export const getRecentPost = async () => {
  const fetchOption = {
    next: {
      tags: ["posts"],
    },
  };

  try {
    const res = await fetch(`${envConfig.baseApi}/posts`, fetchOption);

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);

    return { data: [] }; // Return empty array in case of error
  }
};

export const getCommentsForPost = async (postId: Comment) => {
  try {
    const res = await fetch(`${envConfig.baseApi}/posts/${postId}/comments`);

    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);

    return { data: [] }; // Return empty array in case of error
  }
};

// src/services/mypost.ts

// Update Post Service
export const updatePost = async (
  postId: string,
  formData: FormData,
): Promise<any> => {
  try {
    const { data } = await clientAxiosInstance.patch(
      `/posts/update-post/${postId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Use Mutation Hook for Updating Post
export const useUpdatePost = () => {
  return useMutation<any, Error, { postId: string; formData: FormData }>({
    mutationKey: ["UPDATE_POST"],
    mutationFn: ({ postId, formData }) => updatePost(postId, formData),
    onSuccess: () => {
      toast.success("Post updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while updating the post.",
      );
    },
  });
};
// src/services/allposts.ts

export const deletePost = async (id: string) => {
  const response = await clientAxiosInstance.delete(`/posts/${id}`); // Adjust the endpoint as necessary
  return response.data;
};
