"use client";
// pages/admin/dashboard.tsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useUser } from "@/src/context/user.provider";
import { gettingAllUsers } from "@/src/services/getUser";
import { IUser } from "@/src/types";

const Dashboard = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<IUser[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<any[]>([]); // You can update the type based on actual data
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [postAnalytics, setPostAnalytics] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await gettingAllUsers();

      // Assuming the response has user activity and payment data
      setUsers(data?.data || []);

      // Mock data for the graphs (replace with actual data)
      setMonthlyPayments([
        { month: "Jan", amount: 1200 },
        { month: "Feb", amount: 2100 },
        { month: "Mar", amount: 800 },
        { month: "Apr", amount: 1600 },
        { month: "May", amount: 900 },
      ]);

      setUserActivity([
        { month: "Jan", users: 200 },
        { month: "Feb", users: 450 },
        { month: "Mar", users: 300 },
        { month: "Apr", users: 500 },
        { month: "May", users: 350 },
      ]);

      setPostAnalytics([
        { name: "Post 1", views: 400 },
        { name: "Post 2", views: 300 },
        { name: "Post 3", views: 200 },
        { name: "Post 4", views: 100 },
      ]);
    };

    fetchUsers();
  }, [user]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Payments */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Monthly Payments</h2>
          <LineChart data={monthlyPayments} height={200} width={300}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="amount" stroke="#8884d8" type="monotone" />
          </LineChart>
        </div>

        {/* User Activity */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Activity</h2>
          <BarChart data={userActivity} height={200} width={300}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Posts Analytics */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Posts Analytics</h2>
          <PieChart height={200} width={300}>
            <Pie
              label
              cx="50%"
              cy="50%"
              data={postAnalytics}
              dataKey="views"
              fill="#8884d8"
              nameKey="name"
              outerRadius={80}
            >
              {postAnalytics.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
