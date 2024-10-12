"use client";

import React, { useEffect, useState } from "react";
import { User } from "../../UI/Sidebar";
import { getFlowers, getFlowing } from "@/src/services/flow";
import { useUser } from "@/src/context/user.provider";

const Flow = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]); // Define users as an array of User
  const [flowing, setflowing] = useState<User[]>([]);
  console.log("flowing", flowing);

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
      <h1>All Flowers</h1>
      <div className="grid grid-cols-2 gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="border mx-auto p-4 mb-4 rounded">
              <img
                src={user.profilePicture || "default-image-url"}
                alt={`${user.name}'s profile`}
                className="w-8 h-8 rounded-full mx-auto"
              />
              <h2 className=" text-center text-[80%]">{user.name}</h2>
              <p className="text-[70%] text-gray-600">{user.email}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      <div>
        <h1>All Flowing</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {users.length > 0 ? (
          flowing.map((user) => (
            <div key={user._id} className="border mx-auto p-4 mb-4 rounded">
              <img
                src={user.profilePicture || "default-image-url"}
                alt={`${user.name}'s profile`}
                className="w-8 h-8 rounded-full mx-auto"
              />
              <h2 className=" text-center text-[80%]">{user.name}</h2>
              <p className="text-[70%] text-gray-600">{user.email}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default Flow;
