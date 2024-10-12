"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, CardFooter, CardBody } from "@nextui-org/react";
import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaDownload,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { getRecentPost } from "@/src/services/allposts";
import { downvotePost, upvotePost } from "@/src/services/votes";
import { Post } from "@/src/types";
import { useUser } from "@/src/context/user.provider";
import PostContent from "@/src/components/UI/postediteUi/PostContent";

const NewsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const { user } = useUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getRecentPost();
        const sortedPosts = data.sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleVote = async (
    postId: string,
    isUpvote: boolean,
    index: number,
  ) => {
    try {
      // Make the API call
      if (isUpvote) {
        await upvotePost(postId);
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts];

          updatedPosts[index].upvotes += 1;

          return updatedPosts;
        });
        toast.success("Upvote successful!"); // Show success toast
      } else {
        await downvotePost(postId);
        // Update local state for immediate feedback
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts];

          updatedPosts[index].downvotes += 1;

          return updatedPosts;
        });
        toast.success("Downvote successful!"); // Show success toast
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Voting failed! Please try again."); // Show error toast
    }
  };

  // PDF download handler
  const handleDownloadPDF = (post: Post) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(post.title, 10, 20);
    doc.setFontSize(12);
    doc.text(`Author: ${post?.author?.name}`, 10, 30);
    doc.text(`Category: ${post.category}`, 10, 40);
    doc.text(post.content || "", 10, 50);
    doc.save(`${post.title}.pdf`);
  };

  // Function to handle social media sharing
  const handleShare = (platform: string, post: Post) => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    const text = encodeURIComponent(`Check out this post: ${post.title}`);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${post.title}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? post.category === categoryFilter
      : true;

    // Temporarily disable premium check for testing
    // const matchesPremium = user?.premiumUser ? true : !post.isPremium;

    return matchesSearch && matchesCategory;
  });

  console.log(posts);
  console.log(filteredPosts);

  useEffect(() => {
    AOS.init({
      duration: 1000, // You can adjust animation duration here
      once: true, // Whether animation should happen only once
    });

    return () => AOS.refresh(); // Refresh AOS after every change
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Latest Tech Tips & Tutorials
        </h2>

        <div className="flex space-x-4 mb-6">
          <input
            className="p-2 border rounded w-full"
            placeholder="Search by keywords..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Web">Web</option>
            <option value="Science">Data Science</option>
            <option value="Patabase">Database</option>
            <option value="Programming">Programming</option>
          </select>
        </div>

        {/* <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              sortOption === "newest" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSortOption("newest")}
          >
            Newest
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortOption === "upvotes"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSortOption("upvotes")}
          >
            Most Upvoted
          </button>
          <button
            className={`px-4 py-2 rounded ${
              sortOption === "helpful"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSortOption("helpful")}
          >
            Most Helpful
          </button>
        </div> */}

        <div data-aos="fade-up" className="flex flex-col space-y-6">
          {filteredPosts.map((post, index) => (
            <Card
              key={post._id}
              className="relative hover:shadow-lg transition-shadow duration-300"
            >
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      alt={post?.author?.name}
                      className="rounded-full"
                      height={40}
                      src={
                        post?.author?.profilePicture ||
                        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      width={40}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post?.author?.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {post.isPremium && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}

                <Link href={`/posts/${post._id}`}>
                  <CardBody>
                    {post.images?.length > 0 && (
                      <Image
                        alt={post.title}
                        className="   rounded-md mt-3"
                        height={400}
                        src={post.images[0]} // Assuming first image is featured
                        width={1000}
                      />
                    )}
                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                      {post.title}
                    </h2>
                    <PostContent content={post.content} />
                  </CardBody>
                </Link>
              </CardBody>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <Button
                    className="text-sm"
                    color="success"
                    variant="flat"
                    onClick={() => handleVote(post._id, true, index)}
                  >
                    Upvote ({post.upvotes})
                  </Button>
                  <Button
                    className="text-sm"
                    color="danger"
                    variant="flat"
                    onClick={() => handleVote(post._id, false, index)}
                  >
                    Downvote ({post.downvotes})
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="flex items-center"
                    onClick={() => handleDownloadPDF(post)}
                  >
                    <FaDownload />
                    <span className="ml-1">Download</span>
                  </Button>
                  <Button
                    className="flex items-center"
                    onClick={() => handleShare("facebook", post)}
                  >
                    <FaFacebook />
                    <span className="ml-1">Share</span>
                  </Button>
                  <Button
                    className="flex items-center"
                    onClick={() => handleShare("twitter", post)}
                  >
                    <FaTwitter />
                    <span className="ml-1">Share</span>
                  </Button>
                  <Button
                    className="flex items-center"
                    onClick={() => handleShare("linkedin", post)}
                  >
                    <FaLinkedin />
                    <span className="ml-1">Share</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
