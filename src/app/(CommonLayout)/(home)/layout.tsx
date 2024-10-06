import { ReactNode } from "react";

const layout = ({
  children,
  // recentPosts,
}: {
  children: React.ReactNode;
  recentPosts: ReactNode;
}) => {
  return (
    <div>
      <div className="relative flex flex-col h-screen">
        <main>{children}</main>
        {/* {recentPosts} */}
      </div>
    </div>
  );
};

export default layout;
