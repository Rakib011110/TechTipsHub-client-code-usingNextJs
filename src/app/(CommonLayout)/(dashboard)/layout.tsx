"use client";
// components/admin/AdminLayout.tsx
import React from "react";
import Link from "next/link";
import { useUser } from "@/src/context/user.provider";
import { SidebarOptions } from "@/src/components/UI/Sidebar/SidebarOptions/SidebarOptions";
import { dashboarduserLinks } from "@/src/components/UI/Sidebar/constant";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen">
      {/*  if user is login show this side*/}

      {/* if admin is login it will show this */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        {user?.role === "USER" ? (
          <div>
            <SidebarOptions links={dashboarduserLinks} />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <nav className="flex flex-col space-y-4">
              <Link
                className="hover:bg-gray-700 p-2 rounded"
                href="/dashboard/admin-dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="hover:bg-gray-700 p-2 rounded"
                href="/dashboard/users"
              >
                Manage Users
              </Link>
              <Link
                className="hover:bg-gray-700 p-2 rounded"
                href="/dashboard/posts"
              >
                Manage Posts
              </Link>
              <Link
                className="hover:bg-gray-700 p-2 rounded"
                href="/dashboard/payments"
              >
                Payment History
              </Link>
              {/* <Link href="/admin/admins" className="hover:bg-gray-700 p-2 rounded">
            Admin Accounts
          </Link> */}
            </nav>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
