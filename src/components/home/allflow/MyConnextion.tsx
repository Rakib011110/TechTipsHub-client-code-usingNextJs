"use client";

import React, { useEffect, useState } from "react";

import { User } from "../../UI/Sidebar";

import { getFlowers, getFlowing } from "@/src/services/flow";
import { useUser } from "@/src/context/user.provider";

const MyConnection = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]); // Define users as an array of User
  const [flowing, setflowing] = useState<User[]>([]);

  // console.log("flowing", flowing);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user?._id) {
        const data = await getFlowers(user._id);

        setUsers(data?.data || []); // Handle data from API response
      }
    };

    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user?._id) {
        const data = await getFlowing(user._id);

        setflowing(data?.data || []); // Handle data from API response
      }
    };

    fetchUserPosts();
  }, [user]);

  return (
    <div>
      <h1>All Flowers {users?.length}</h1>
      <div className="grid grid-cols-1  gap-6">
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
                  </div>
                  {/* <p className="text-gray-600 text-[80%]">{user.email}</p> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <div>
        <h1>All Flowing {flowing?.length}</h1>
      </div>
      <div className="grid grid-cols-1  gap-6">
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
                  <div className="flex justify-between gap-5">
                    <h3 className="text-[80%] font-semibold text-gray-900">
                      {user.name}
                    </h3>
                  </div>
                  {/* <p className="text-gray-600 text-[80%]">{user.email}</p> */}
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
