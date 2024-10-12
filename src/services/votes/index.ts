// src/services/voting.ts

import clientAxiosInstance from "@/src/lib/ClientAxiosInstance/ClientAxiosInstance";

// export const upvotePost = async (postId: string) => {
//   try {
//     const response = await clientAxiosInstance.patch(`/posts/upvote/${postId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error upvoting the post:", error);
//     throw error;
//   }
// };

// export const downvotePost = async (postId: string) => {
//   try {
//     const response = await clientAxiosInstance.patch(
//       `/posts/downvote/${postId}`,
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error downvoting the post:", error);
//     throw error;
//   }
// };

export const upvotePost = async (postId: string) => {
  try {
    const response = await clientAxiosInstance.patch(`/posts/upvote/${postId}`);

    return response.data; // Return the updated post object
  } catch (error) {
    console.error("Error upvoting the post:", error);
    throw error;
  }
};

export const downvotePost = async (postId: string) => {
  try {
    const response = await clientAxiosInstance.patch(
      `/posts/downvote/${postId}`,
    );

    return response.data; // Return the updated post object
  } catch (error) {
    console.error("Error downvoting the post:", error);
    throw error;
  }
};
