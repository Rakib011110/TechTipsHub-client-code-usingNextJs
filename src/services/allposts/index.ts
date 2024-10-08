// src/services/allposts.js
import envConfig from "@/src/config/envConfig";
import axios from "axios";
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
