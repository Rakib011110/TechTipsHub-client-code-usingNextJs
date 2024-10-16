"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useUser } from "@/src/context/user.provider";
import { getMyPost } from "@/src/services/mypost";
import PostContent from "@/src/components/UI/postediteUi/PostContent";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

// Define the type for comments
interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  // Add other relevant fields if necessary
}

// Define the type for posts analytics
interface Post {
  _id: string;
  title: string;
  upvotes: number; // Assuming this represents upvotes
  downvotes: number; // Add this field if downvotes are tracked
  comments: Comment[]; // Changed from number to array of Comment objects
}

const AnalyticsPage = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalReactions, setTotalReactions] = useState(0);
  const [totalDownvotes, setTotalDownvotes] = useState(0); // Total downvotes
  const [totalComments, setTotalComments] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user posts data and calculate totals
  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user?._id) {
          const data = await getMyPost(user._id);
          const fetchedPosts: Post[] = data?.data || [];

          if (fetchedPosts.length === 0) {
            setError("No posts available for analytics.");
          }

          // Calculate total reactions, downvotes, and comments
          const reactions = fetchedPosts.reduce(
            (sum: number, post: Post) => sum + post.upvotes,
            0,
          );
          const downvotes = fetchedPosts.reduce(
            (sum: number, post: Post) => sum + (post.downvotes || 0),
            0,
          );
          const comments = fetchedPosts.reduce(
            (sum: number, post: Post) => sum + post.comments.length,
            0,
          );

          // Set the posts and totals in state
          setPosts(fetchedPosts);
          setTotalReactions(reactions);
          setTotalDownvotes(downvotes);
          setTotalComments(comments);
        } else {
          setError("User not logged in.");
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to fetch analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  // Prepare data for the bar chart
  const barChartData = {
    labels: ["Reactions", "Downvotes", "Comments"],
    datasets: [
      {
        label: "Total Count",
        data: [totalReactions, totalDownvotes, totalComments], // Values to display
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)", // Reactions
          "rgba(255, 99, 132, 0.2)", // Downvotes
          "rgba(153, 102, 255, 0.2)", // Comments
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: posts.map((post) => post.title),
    datasets: [
      {
        label: "Upvotes",
        data: posts.map((post) => post.upvotes),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Downvotes",
        data: posts.map((post) => post.downvotes || 0),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Comments",
        data: posts.map((post) => post.comments.length),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart.js options for customizing both charts
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Ensure whole numbers on y-axis
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Cast "top" to the expected type
      },
      title: {
        display: true,
        text: "Content Analytics Overview",
      },
    },
  };

  // Compute Top Posts
  const topUpvotedPosts = [...posts]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  const topDownvotedPosts = [...posts]
    .sort((a, b) => (b.downvotes || 0) - (a.downvotes || 0))
    .slice(0, 3);

  const topCommentedPosts = [...posts]
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 3);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Analytics</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          <p>No posts available to display analytics.</p>
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Bar data={barChartData} options={chartOptions} />
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <Line data={lineChartData} options={chartOptions} />
          </div>

          {/* Top Posts Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Top Posts</h2>

            {/* Most Upvoted Posts */}
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Most Upvoted Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topUpvotedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <h4 className="font-semibold text-lg mb-2">
                      <PostContent content={post.title} />
                    </h4>
                    <p>Upvotes: {post.upvotes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Downvoted Posts */}
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Most Downvoted Posts</h3>
              {topDownvotedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topDownvotedPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                      <h4 className="font-semibold text-lg mb-2">
                        <PostContent content={post.title} />
                      </h4>
                      <p>Downvotes: {post.downvotes || 0}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No downvotes data available.</p>
              )}
            </div>

            {/* Most Commented Posts */}
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Most Commented Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topCommentedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <h4 className="font-semibold text-lg mb-2">
                      <PostContent content={post.title} />
                    </h4>
                    <p>Comments: {post.comments.length}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
