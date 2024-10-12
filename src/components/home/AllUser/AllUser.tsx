"use client";
import { useUser } from "@/src/context/user.provider";
import { followUser, unfollowUser } from "@/src/services/flowUser";
import { getAllUsers } from "@/src/services/getUser";
import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

const AllUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const { user } = useUser();

  // Fetch all users and following list
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data?.data || []);
    };

    if (user) {
      setFollowing(user.following || []);
    }

    fetchUsers();
  }, [user]);

  // Follow/Unfollow functionality
  const handleFollow = async (targetUserId: string) => {
    if (following.includes(targetUserId)) {
      await unfollowUser(targetUserId);
      setFollowing(following.filter((id) => id !== targetUserId));
    } else {
      await followUser(targetUserId);
      setFollowing([...following, targetUserId]);
    }
  };

  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        users.map((targetUser) => (
          <div
            key={targetUser._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={
                  targetUser.profilePicture ||
                  "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                }
                alt={targetUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex justify-between ga-5">
                <div className="flex-grow">
                  <h3 className="text-md font-semibold text-gray-800">
                    {targetUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">{targetUser.email}</p>
                </div>
                <div>
                  {user && user._id !== targetUser._id && (
                    <button
                      className={` p-1 text-sm rounded-full transition ${
                        following.includes(targetUser._id)
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      onClick={() => handleFollow(targetUser._id)}
                    >
                      {following.includes(targetUser._id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default AllUser;
