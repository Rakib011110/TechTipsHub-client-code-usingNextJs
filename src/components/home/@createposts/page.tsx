"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { useUser } from "@/src/context/user.provider";
import "react-toastify/dist/ReactToastify.css";
import { useCreatePost } from "@/src/hooks/useCreatePost";

import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import TDInput from "@/src/components/resubaleform/TDInput";

import { CreatPostModal } from "../../UI/createPostModal";

export default function CreatePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postImages, setPostImages] = useState<string[]>([]);

  console.log("postImage", postImages);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { user } = useUser();
  const { mutate: handleCreatePost } = useCreatePost();

  const methods = useForm();
  const { handleSubmit } = methods;

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "techubimage");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dkm4xad0x/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await response.json();

      if (response.ok) {
        return data.secure_url;
      } else {
        toast.error(`Image upload failed: ${data.error?.message}`);

        return null;
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image upload failed.");

      return null;
    }
  };
  // -------------

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
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

      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file)),
      );

      setPostImages(uploadedImages.filter((url) => url));
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!user) {
      toast.error("No user is logged in.");

      return;
    }

    const postData = {
      ...data,
      images: postImages, // postImages are URLs already
      author: user._id,
    };

    try {
      handleCreatePost(postData, {
        onSuccess: () => {
          toast.success("Post created successfully!");
          setImagePreviews([]);
          setPostImages([]);
          methods.reset();
          setIsModalOpen(false);
        },
        onError: () => {
          toast.error("Failed to create post.");
        },
      });
    } catch (error) {
      toast.error("Error submitting form data.");
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-6 mb-10">
        <button
          className="w-full px-1 py-2 text-white font-semibold rounded-md hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <textarea
            className="w-full text-center flex items-center justify-center rounded-2xl h-28 mx-auto text-gray-400 placeholder:text-gray-400
             border-2 border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out
             p-4 shadow-lg hover:shadow-xl"
            placeholder="WHAT IS ON YOUR MIND"
          />
        </button>
      </div>

      <CreatPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Create a New Post
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
              >
                Post Title <span className="text-red-500">*</span>
              </label>
              <TDInput
                required
                name="title"
                placeholder="Enter your post title"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="content"
              >
                Post Content <span className="text-red-500">*</span>
              </label>
              <TDInput
                required
                as="richtext"
                name="content"
                placeholder="Write your content here..."
                rows={6}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="category"
              >
                Category (optional)
              </label>
              <TDInput
                name="category"
                placeholder="e.g., Web, Software Engineering, AI"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id="isPremium"
                {...methods.register("isPremium")}
                type="checkbox"
              />
              <label
                className="ml-2 block text-sm text-gray-700"
                htmlFor="isPremium"
              >
                Is this a Premium Post?
              </label>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="postImages"
              >
                Upload Images:
              </label>
              <input
                multiple
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                id="postImages"
                type="file"
                onChange={handleImageChange}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Image Previews:
                </h4>
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 rounded-md overflow-hidden"
                    >
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover"
                        src={src}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Create Post
              </button>
            </div>
          </form>
        </FormProvider>
      </CreatPostModal>

      <ToastContainer autoClose={5000} position="top-right" />
    </div>
  );
}
