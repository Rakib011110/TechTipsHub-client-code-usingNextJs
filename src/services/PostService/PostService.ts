import { revalidateTag } from "next/cache";

import axiosInstance from "@/src/lib/AxiosInstance";
import clientAxiosInstance from "@/src/lib/ClientAxiosInstance/ClientAxiosInstance";
import axios from "axios";
import envConfig from "@/src/config/envConfig";

// export const createPost = async (formData: FormData): Promise<any> => {
//   try {
//     const { data } = await axiosInstance.post("/posts/create-post", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     revalidateTag("posts");

//     return data;
//   } catch (error) {
//     console.error("Error creating post:", error);
//     throw error; // <-- Ensure the error is propagated up
//   }
// };

export const createPost = async (formData: FormData): Promise<any> => {
  try {
    const { data } = await clientAxiosInstance.post(
      "/posts/create-post",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    // revalidateTag("posts");

    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const createPostComments = async (
  formData: FormData,
  postid: string,
): Promise<any> => {
  try {
    const { data } = await clientAxiosInstance.post(
      `/posts/comments/${postid}`, // Use dynamic postid in the URL
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
