// src/components/NewsFeed.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, CardFooter, CardBody } from "@nextui-org/react"; // Import NextUI components

import { getRecentPost } from "@/src/services/allposts";

interface Post {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string; // Add more properties as needed
}

const NewsFeed = async () => {
  const { data: posts }: { data: Post[] } = await getRecentPost();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Latest Tech Tips & Tutorials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post._id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/posts/${post._id}`}>
              <CardBody>
                {/* Image Section */}
                {post.images?.length > 0 && (
                  <Image
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-md"
                    height={300}
                    src={post.images[0]}
                    width={500}
                  />
                )}
                {/* Post Information Section */}
                <CardBody className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                  {post.title}
                </CardBody>
                <CardBody className="text-gray-700 mt-2 line-clamp-3">
                  {post.description}
                </CardBody>
              </CardBody>
            </Link>
            {/* Action Buttons */}
            <CardFooter>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button color="primary" size="sm">
                    Upvote
                  </Button>
                  <Button color="danger" size="sm">
                    Downvote
                  </Button>
                </div>
                <span className="text-sm text-gray-500">{post.category}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
