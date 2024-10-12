"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Button, CardBody, CardFooter, Badge } from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { getRecentPost } from "@/src/services/allposts"; // Service to get post data
import { useUser } from "@/src/context/user.provider";
import { useCreateComment } from "@/src/hooks/useCreatePost"; // Mutation hook for comments
import TIInput from "@/src/components/resubaleform/TIInput";
import PostContent from "@/src/components/UI/postediteUi/PostContent";

interface Post {
  _id: string;
  title: string;
  content: string;
  images: string[];
  upvotes: number;
  downvotes: number;
  isPremium: boolean;
  comments: Comment[];
}

interface Comment {
  _id?: string;
  content: string;
  author?: string;
  createdAt: string;
}

const PostDetails = () => {
  const { user } = useUser();
  const { postid } = useParams() as { postid: string }; // Type assertion here

  const methods = useForm();
  const { handleSubmit } = methods;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const { mutate: handleCreateComment } = useCreateComment(); // Comment mutation

  // Fetch post data and comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: posts } = await getRecentPost();
        const post = posts.find((p: Post) => p._id === postid);

        if (!post) return;
        setPost(post);
        setComments(post.comments);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPost();
  }, [postid]);

  if (!post) return <p>Loading...</p>;

  // Submit comment
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    if (!user) {
      toast.error("No user is logged in.");

      return;
    }

    // Append individual fields to formData
    formData.append("content", data.content); // Ensure content is appended directly
    formData.append("author", user._id); // Append author directly

    handleCreateComment(
      { formData, postid },
      {
        onSuccess: () => {
          toast.success("Comment added successfully!");
          setComments((prev) => [
            ...prev,
            { content: data.content, createdAt: new Date().toISOString() }, // Add comment locally
          ]);
          methods.reset(); // Reset form after successful comment submission
        },
        onError: () => {
          toast.error("Failed to add comment.");
        },
      },
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardBody>
          <div className="flex items-center">
            {post.isPremium && (
              <Badge className="mr-4" color="warning">
                Premium
              </Badge>
            )}
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </div>

          <div className="flex my-4">
            {post.images?.length > 0 && (
              <Image
                alt={post.title}
                className="rounded-lg"
                height={300}
                src={post.images[0]}
                width={500}
              />
            )}
            <PostContent className="ml-4" content={post.content} />
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex items-center space-x-4">
            <Button color="primary" size="sm">
              Upvote ({post.upvotes})
            </Button>
            <Button color="danger" size="sm">
              Downvote ({post.downvotes})
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {comments.length > 0 ? (
          comments.map((comment: Comment, index: number) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {/* Comment Input Form */}
        <FormProvider {...methods}>
          <form className="mt-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <TIInput name="content" placeholder="Add your comment here..." />
            <Button color="primary" type="submit">
              Submit Comment
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PostDetails;
