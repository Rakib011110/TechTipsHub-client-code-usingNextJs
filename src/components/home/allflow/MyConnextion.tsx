"use client";

import React, { useEffect, useState } from "react";
import { User } from "../../UI/Sidebar";
import { getFlowers, getFlowing } from "@/src/services/flow";
import { useUser } from "@/src/context/user.provider";
import { followUser, unfollowUser } from "@/src/services/flowUser";

const MyConnection = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [flowing, setFlowing] = useState<User[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (user?._id) {
        const data = await getFlowers(user._id);
        setUsers(data?.data || []);
      }
    };

    fetchAllUsers();
  }, [user]);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      if (user?._id) {
        const data = await getFlowing(user._id);
        const followedUserIds = data?.data.map((u: User) => u._id) || [];
        setFlowing(data?.data || []);
        setFollowing(followedUserIds); // Initialize following state
      }
    };

    fetchFollowingUsers();
  }, [user]);

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
    <div>
      <h1>All Flowers {users.length}</h1>
      <div className="grid grid-cols-1 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                  src={
                    user.profilePicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  }
                />
                <div>
                  <div className="flex justify-between gap-5">
                    <h3 className="text-[80%] font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <div>
                      <button
                        className={`p-1 text-sm rounded-full transition ${
                          following.includes(user._id)
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                        onClick={() => handleFollow(user._id)}
                      >
                        {following.includes(user._id) ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <div>
        <h1>All Flowing {flowing.length}</h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {flowing.length > 0 ? (
          flowing.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover"
                  src={
                    user.profilePicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  }
                />
                <div>
                  <div>
                    <button
                      className={`p-1 text-sm rounded-full transition ${
                        following.includes(user._id)
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      onClick={() => handleFollow(user._id)}
                    >
                      {following.includes(user._id) ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                  <div className="flex justify-between gap-5">
                    <h3 className="text-[80%] font-semibold text-gray-900">
                      {user.name}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default MyConnection;
