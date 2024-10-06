import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createPost } from "../services/PostService/PostService";

export const useCreatePost = () => {
  return useMutation<any, Error, FormData>({
    mutationKey: ["CREATE_POST"],
    mutationFn: async (postData) => await createPost(postData),
    onSuccess: () => {
      toast.success("Post created successfully!"); // Adjust to react-toastify
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the post.",
      );
    },
  });
};
