import React from "react";

import { User } from "../../UI/Sidebar";

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <img
        alt={`${user.name}'s profile`}
        className="w-16 h-16 rounded-full object-cover"
        src={user.profilePicture || "default-image-url"}
      />
      <div className="ml-4">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
