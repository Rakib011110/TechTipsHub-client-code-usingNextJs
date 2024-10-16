"use client";

import React, { useEffect, useState } from "react";
import { getFlowers, getFlowing } from "@/src/services/flow";
import { useUser } from "@/src/context/user.provider";
import { followUser, unfollowUser } from "@/src/services/flowUser";
import { User } from "@/src/components/UI/Sidebar";

const MyConnectionlist = () => {
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
    <div className="max-w-6xl mx-auto p-6">
      {/* All Flowers Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          All Users ({users.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((userItem) => (
                  <tr key={userItem._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <img
                        alt={userItem.name}
                        className="w-10 h-10 rounded-full object-cover"
                        src={
                          userItem.profilePicture ||
                          "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                        }
                      />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {userItem.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                          following.includes(userItem._id)
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                        onClick={() => handleFollow(userItem._id)}
                      >
                        {following.includes(userItem._id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* All Flowing Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Following ({flowing.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {flowing.length > 0 ? (
                flowing.map((userItem) => (
                  <tr key={userItem._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <img
                        alt={userItem.name}
                        className="w-10 h-10 rounded-full object-cover"
                        src={
                          userItem.profilePicture ||
                          "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                        }
                      />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {userItem.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                          following.includes(userItem._id)
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                        onClick={() => handleFollow(userItem._id)}
                      >
                        {following.includes(userItem._id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MyConnectionlist;
