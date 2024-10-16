"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  Button,
  CardFooter,
  CardBody,
  Spinner,
  Select,
} from "@nextui-org/react";
import { FaFacebook, FaTwitter, FaLinkedin, FaDownload } from "react-icons/fa";
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
  console.log("Post Content:", posts);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest"); // New sort state
  const { user } = useUser();

  const [userVotes, setUserVotes] = useState<{ [postId: string]: string }>({});

  // Infinite Scroll States
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getRecentPost();
        let sortedPosts = data.sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setPosts(sortedPosts);
        // If fetched posts are less than initial display count, set hasMore to false
        if (sortedPosts.length <= displayCount) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getRecentPost()
        .then(({ data }) => {
          let sortedPosts = data.sort(
            (a: Post, b: Post) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          setPosts(sortedPosts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }, 4000); // 4 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleVote = async (
    postId: string,
    isUpvote: boolean,
    index: number,
  ) => {
    // Check if the user has already voted on this post
    if (userVotes[postId]) {
      toast.error("You can only vote once on this post!");

      return;
    }

    try {
      if (isUpvote) {
        await upvotePost(postId);
        setPosts((prevPosts) =>
          prevPosts.map((post, i) =>
            i === index
              ? { ...post, upvotes: post.upvotes + 1 } // Increment upvote by 1
              : post,
          ),
        );
        setUserVotes((prevVotes) => ({ ...prevVotes, [postId]: "upvote" }));
        toast.success("Upvote successful!");
      } else {
        await downvotePost(postId);
        setPosts((prevPosts) =>
          prevPosts.map((post, i) =>
            i === index
              ? { ...post, downvotes: post.downvotes + 1 } // Increment downvote by 1
              : post,
          ),
        );
        setUserVotes((prevVotes) => ({ ...prevVotes, [postId]: "downvote" }));
        toast.success("Downvote successful!");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Voting failed! Please try again.");
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

    return matchesSearch && matchesCategory;
  });

  // Sorting Logic
  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "mostUpvoted":
        return b.upvotes - a.upvotes;
      case "mostDownvoted":
        return b.downvotes - a.downvotes;
      default:
        return 0;
    }
  });

  // Slice the posts to display only up to displayCount
  const visiblePosts = sortedPosts.slice(0, displayCount);

  // Handle Scroll Event
  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 200; // Trigger when 200px from bottom

    if (scrolledToBottom) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        const newDisplayCount = displayCount + 5;

        if (newDisplayCount >= sortedPosts.length) {
          setDisplayCount(sortedPosts.length);
          setHasMore(false);
        } else {
          setDisplayCount(newDisplayCount);
        }
        setIsLoading(false);
      }, 3000); // 3 second delay for simulation
    }
  }, [isLoading, hasMore, displayCount, sortedPosts.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    return () => AOS.refresh(); // Refresh AOS after every change
  }, []);

  // Handle Sorting Option Change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setDisplayCount(5); // Reset display count
    setHasMore(true);
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Latest Tech Tips & Tutorials
        </h2>

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <select
            className="p-2 border rounded w-1/3"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Web">Web</option>
            <option value="Science">Data Science</option>
            <option value="Database">Database</option>
            <option value="Programming">Programming</option>
          </select>
          <div className="flex space-x-4 w-full md:w-2/3">
            <input
              className="p-2 border rounded w-full"
              placeholder="Search by keywords..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex space-x-4 w-full md:w-1/3">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort By:
            </label>
            <select
              id="sort"
              className="p-2 border rounded w-full"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostUpvoted">Most Upvoted</option>
              <option value="mostDownvoted">Most Downvoted</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col space-y-6" data-aos="fade-up">
          {visiblePosts.map((post, index) => (
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
                        className="rounded-md mt-3"
                        height={400}
                        src={post.images[0]} // Assuming first image is featured
                        width={1000}
                      />
                    )}
                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                      <PostContent content={post.title} />
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

                <div className="flex space-x-3">
                  <Button
                    className="text-sm"
                    variant="ghost"
                    onClick={() => handleShare("facebook", post)}
                  >
                    <FaFacebook />
                  </Button>
                  <Button
                    className="text-sm"
                    variant="ghost"
                    onClick={() => handleShare("twitter", post)}
                  >
                    <FaTwitter />
                  </Button>
                  <Button
                    className="text-sm"
                    variant="ghost"
                    onClick={() => handleShare("linkedin", post)}
                  >
                    <FaLinkedin />
                  </Button>

                  <Button
                    className="text-sm"
                    variant="ghost"
                    onClick={() => handleDownloadPDF(post)}
                  >
                    <FaDownload />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Loading Spinner */}
          {isLoading && hasMore && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}

          {/* No More Posts Message */}
          {!hasMore && (
            <div className="text-center text-gray-500 mt-4">
              You have reached the end!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
