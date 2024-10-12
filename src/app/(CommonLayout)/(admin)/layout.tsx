// components/admin/AdminLayout.tsx
import React from "react";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/*  if user is login show this side*/}

      {/* if admin is login it will show this */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <Link
            className="hover:bg-gray-700 p-2 rounded"
            href="/admin/dashboard"
          >
            Dashboard
          </Link>
          <Link className="hover:bg-gray-700 p-2 rounded" href="/admin/users">
            Manage Users
          </Link>
          <Link className="hover:bg-gray-700 p-2 rounded" href="/admin/posts">
            Manage Posts
          </Link>
          <Link
            className="hover:bg-gray-700 p-2 rounded"
            href="/admin/payments"
          >
            Payment History
          </Link>
          {/* <Link href="/admin/admins" className="hover:bg-gray-700 p-2 rounded">
            Admin Accounts
          </Link> */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
