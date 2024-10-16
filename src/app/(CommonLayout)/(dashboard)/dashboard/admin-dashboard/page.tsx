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
import { IUser, Post } from "@/src/types";
import { getRecentPost } from "@/src/services/allposts";

const Dashboard = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<IUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [postAnalytics, setPostAnalytics] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const usersData = await gettingAllUsers();
      const postsData = await getRecentPost();

      setUsers(usersData?.data || []);
      setPosts(postsData?.data || []);

      // Assuming your users model has createdAt and premium fields
      const userActivityData = usersData.data.reduce(
        (acc: any[], user: IUser) => {
          const month = new Date(user.createdAt as string).toLocaleString(
            "default",
            {
              month: "short",
            },
          );
          const existingMonth = acc.find((item) => item.month === month);

          if (existingMonth) {
            existingMonth.users += 1;
          } else {
            acc.push({ month, users: 1 });
          }

          return acc;
        },
        [],
      );

      setUserActivity(userActivityData);

      // Assuming each user has a "premium" status and you can get payments from premium users
      const monthlyPaymentsData = usersData.data.reduce(
        (acc: any[], user: IUser) => {
          if (user.premiumUser) {
            const month = new Date(user?.createdAt as string).toLocaleString(
              "default",
              {
                month: "short",
              },
            );
            const existingMonth = acc.find((item) => item.month === month);

            if (existingMonth) {
              existingMonth.amount += 40; // Assuming $20 per premium user
            } else {
              acc.push({ month, amount: 20 });
            }
          }

          return acc;
        },
        [],
      );

      setMonthlyPayments(monthlyPaymentsData);

      // Post analytics: count views for each post
      const postAnalyticsData = postsData.data.map((post: Post) => ({
        name: post.title.slice(0, 10),
        // views: post.views || 0,
      }));

      setPostAnalytics(postAnalyticsData);
    };

    fetchDashboardData();
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
