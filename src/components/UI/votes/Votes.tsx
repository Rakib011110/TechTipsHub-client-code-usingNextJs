import { downvotePost, upvotePost } from "@/src/services/votes";
import { CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/react";
import React from "react";

const Votes = () => {
  const handleVote = async (
    postId: string,
    isUpvote: boolean,
    index: number,
  ) => {
    try {
      // Call appropriate vote function
      const updatedPost = isUpvote
        ? await upvotePost(postId)
        : await downvotePost(postId);

      // Update local state
      posts[index] = updatedPost;
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <CardFooter>
      <div className="flex items-center space-x-4">
        <Button
          color="primary"
          size="sm"
          onClick={() => handleVote(post._id, true, index)}
        >
          Upvote ({post.upvotes})
        </Button>
        <Button
          color="danger"
          size="sm"
          onClick={() => handleVote(post._id, false, index)}
        >
          Downvote ({post.downvotes})
        </Button>
        <span className="text-sm text-gray-500">{post.category}</span>
      </div>
    </CardFooter>
  );
};

export default Votes;
