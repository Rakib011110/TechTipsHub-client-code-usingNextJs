"use client";
import { useEffect, useState } from "react";

import { gettingAllUsers } from "@/src/services/getUser";
import { useUser } from "@/src/context/user.provider";
import { IUser } from "@/src/types";
import clientAxiosInstance from "@/src/lib/ClientAxiosInstance/ClientAxiosInstance";

const ManageUsers = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await gettingAllUsers();

      setUsers(data?.data || []);
    };

    fetchUsers();
  }, [user]);

  // Function to verify user
  const handleVerify = async (id: string) => {
    try {
      const response = await clientAxiosInstance.patch(`/users/verify/${id}`);

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === id ? { ...u, verified: true } : u)),
        );
        console.log("User verified successfully");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  // Function to block/unblock user
  const handleBlock = async (id: string, status: string) => {
    try {
      const response = await clientAxiosInstance.patch(`/users/status/${id}`, {
        status,
      });

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === id ? { ...u, status } : u)),
        );
        console.log(
          `User ${status === "ACTIVE" ? "unblocked" : "blocked"} successfully`,
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Function to delete user
  const handleDelete = async (id: string) => {
    try {
      const response = await clientAxiosInstance.delete(`/users/${id}`);

      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
        console.log("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white p-6 shadow rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Profile Picture</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border px-4 py-2">
                  <img
                    alt="Profile"
                    className="rounded-full w-10 h-10 object-cover"
                    src={user.profilePicture || "/default-avatar.png"}
                  />
                </td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.status === "ACTIVE" ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Blocked</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2"
                    onClick={() => handleVerify(user._id)}
                  >
                    {user.verified ? "Verified" : "Verify"}
                  </button>
                  <button
                    className={`${
                      user.status === "ACTIVE"
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-green-500 hover:bg-green-700"
                    } text-white font-bold py-1 px-4 rounded mr-2`}
                    onClick={() =>
                      handleBlock(
                        user._id,
                        user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                      )
                    }
                  >
                    {user.status === "ACTIVE" ? "Block" : "Unblock"}
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
