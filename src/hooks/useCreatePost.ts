import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPost,
  createPostComments,
} from "../services/PostService/PostService";

export const useCreatePost = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["CREATE_POST"],
    mutationFn: async (postData) => await createPost(postData),
    onSuccess: () => {
      toast.success("Post created successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the post.",
      );
    },
  });
};

export const useCreateComment = () => {
  return useMutation<any, Error, { formData: FormData; postid: string }>({
    mutationKey: ["CREATE_COMMENT"],
    mutationFn: async ({ formData, postid }) => {
      return await createPostComments(formData, postid);
    },
    onSuccess: () => {
      toast.success("Comment created successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while creating the comment.",
      );
    },
  });
};
