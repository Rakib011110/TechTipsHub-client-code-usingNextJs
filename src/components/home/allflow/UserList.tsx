import React from "react";
import { User } from "../../UI/Sidebar"; // Assuming you have the `User` type defined here
import UserCard from "./UserCard"; // Import UserCard

const UserList = ({ title, users }: { title: string; users: User[] }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default UserList;
