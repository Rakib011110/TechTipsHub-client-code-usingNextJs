"use client";
import React from "react";

import { useUser } from "@/src/context/user.provider";
import ManageMyPost from "./manage-my-posts/page";
import Dashboard from "./admin-dashboard/page";

const Dash = () => {
  const { user } = useUser();

  return <div>{user?.role === "USER" ? <ManageMyPost /> : <Dashboard />}</div>;
};

export default Dash;
