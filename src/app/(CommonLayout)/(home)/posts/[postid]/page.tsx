"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Button,
  CardBody,
  CardFooter,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { getCommentsForPost, getRecentPost } from "@/src/services/allposts";
import { useUser } from "@/src/context/user.provider";
import { useCreateComment, useUpdateComment } from "@/src/hooks/useCreatePost"; // Comment hooks
import TIInput from "@/src/components/resubaleform/TIInput";
import PostContent from "@/src/components/UI/postediteUi/PostContent";
import { downvotePost, upvotePost } from "@/src/services/votes";

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
  data: any;
  _id?: string;
  content: string;
  author?: string;
  createdAt: string;
}

const PostDetails = () => {
  const { user } = useUser();
  const { postid } = useParams() as { postid: string };

  const methods = useForm();
  const { handleSubmit } = methods;

  const [post, setPost] = useState<Post | null>(null);
  // console.log(post);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userVotes, setUserVotes] = useState<{ [postId: string]: string }>({});

  const { mutate: handleCreateComment } = useCreateComment();
  const { mutate: handleUpdateComment } = useUpdateComment();

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal state

  const [editCommentContent, setEditCommentContent] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null,
  );

  const fetchPost = async () => {
    try {
      const { data: posts } = await getRecentPost();
      const post = posts.find((p: Post) => p._id === postid);

      if (!post) return;
      setPost(post);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  const fetchComments = async () => {
    if (post && post.comments.length > 0) {
      try {
        const fetchedComments = await Promise.all(
          post.comments.map(async (comment: Comment) => {
            const commentData = await getCommentsForPost(comment._id as string);

            return commentData;
          }),
        );
        const filteredComments = fetchedComments.filter(Boolean).flat();

        setComments(filteredComments);
        // console.log(filteredComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postid]);

  useEffect(() => {
    fetchComments();
  }, [post]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPost();
    }, 1000); // 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [postid]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!user) {
      toast.error("No user is logged in.");
      return;
    }

    handleCreateComment(
      { content: data.content, postid },
      {
        onSuccess: () => {
          toast.success("Comment added successfully!");
          setComments((prev) => [
            ...prev,
            {
              content: data.content,
              createdAt: new Date().toISOString(),
            } as Comment, // Ensure that the new object conforms to the Comment type
          ]);
          methods.reset();
        },
        onError: () => {
          toast.error("Failed to add comment.");
        },
      },
    );
  };
  const handleVote = async (isUpvote: boolean) => {
    if (!post) return;
    try {
      if (isUpvote) {
        await upvotePost(post._id);
        setPost((prevPost) => {
          if (!prevPost) return null;

          return { ...prevPost, upvotes: prevPost.upvotes + 1 };
        });
      } else {
        await downvotePost(post._id);
        setPost((prevPost) => {
          if (!prevPost) return null;

          return { ...prevPost, downvotes: prevPost.downvotes + 1 };
        });
      }
    } catch (error) {
      console.error("Error processing vote:", error);
    }
  };

  const openEditModal = (commentId: string, content: string) => {
    setSelectedCommentId(commentId);
    console.log("commentId", commentId);
    setEditCommentContent(content);
    onOpen(); // Open the modal
  };

  const handleEditSubmit = () => {
    if (!selectedCommentId) return;

    handleUpdateComment(
      { commentId: selectedCommentId, content: editCommentContent },
      {
        onSuccess: () => {
          toast.success("Comment updated successfully!");
          fetchComments();
          onOpenChange(); // Close the modal
        },
        onError: () => {
          toast.error("Failed to update comment.");
        },
      },
    );
    // console.log("handleUpdateComment", handleUpdateComment);
  };

  if (!post) return <p>Loading...</p>;

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
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              <PostContent content={post.title} />
            </h2>
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
            <PostContent content={post.content} />
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex items-center space-x-4">
            <Button color="primary" size="sm" onClick={() => handleVote(true)}>
              Upvote ({post.upvotes})
            </Button>
            <Button color="danger" size="sm" onClick={() => handleVote(false)}>
              Downvote ({post.downvotes})
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 border-b pb-3">
          Comments
        </h2>

        {comments.length > 0 ? (
          comments.map((comment: Comment) => (
            <div
              key={comment._id}
              className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">
                    {comment?.data?.author?.name?.charAt(0)}
                  </div>
                  <div className="text-lg font-medium text-gray-800">
                    {comment?.data?.author?.name}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(comment?.data?.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-gray-700">{comment?.data?.content}</p>

              {user && user._id === comment?.data?.author?._id && (
                <div className="text-right">
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() =>
                      openEditModal(comment?.data?._id, comment?.data?.content)
                    }
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        )}

        {/* Comment Input Form */}
        <FormProvider {...methods}>
          <form
            className="bg-gray-50 shadow-sm rounded-lg p-6 mt-6 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TIInput name="content" placeholder="Write your comment here..." />
            <Button
              color="primary"
              type="submit"
              size="lg"
              className="self-end bg-blue-600"
            >
              Submit Comment
            </Button>
          </form>
        </FormProvider>
      </div>

      {/* Edit Comment Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Comment</ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Edit your comment"
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleEditSubmit}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostDetails;
